package ptit.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;
import ptit.constant.CreditStatus;
import ptit.constant.RoleGroup;
import ptit.entity.*;
import ptit.proxy.ConfigClient;
import ptit.repository.CreditApplicationRepository;
import ptit.repository.CreditTaskRepository;
import ptit.service.IScoring;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.time.format.ResolverStyle;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ScoringService implements IScoring {

    private final CreditApplicationRepository applicationRepository;

    private final CreditTaskRepository taskRepository;

    private final ConfigClient configClient;


    @Override
    public CreditTask createApplication(CreditApplication application) {
        String result = validateApplication(application);
        if (StringUtils.hasLength(result))
            return buildFailTask(result);
        List<CreditApplication> applications = applicationRepository
                .findByLegalDocTypeAndLegalDocNumberAndStatus(application.getLegalDocType(),
                        application.getLegalDocNumber(), CreditStatus.IN_PROGRESS.name());
        if (!CollectionUtils.isEmpty(applications)) {
            result = "KHÔNG THÀNH CÔNG. ĐANG TỒN TẠI HỒ SƠ CỦA KHÁCH HÀNG CHƯA XỬ LÝ XONG, " +
                    "VUI LÒNG HOÀN TẤT HOẶC ĐÓNG CÁC HỒ SƠ CŨ ĐỂ TIẾP TỤC";
            return buildFailTask(result);
        }
        application.setStatus(CreditStatus.NEW);
        CreditApplication applicationSaved = saveApplication(application);
        return createNextTask(new CreditTask(), applicationSaved);
    }


    @Override
    public List<CreditApplication> getApplications(ApplicationRequest request) {
        List<CreditApplication> applications = applicationRepository.findAllByOrderByCreateTimeDesc();
        Map<String, CreditTask> latestTaskMap = getLatestTaskMap(applications);
        if (CollectionUtils.isEmpty(latestTaskMap))
            return applications;
        return applications.stream()
                .filter(application -> {
                    CreditTask latestTask = latestTaskMap.get(application.getId());
                    return latestTask != null && StringUtils.isEmpty(latestTask.getAssignee())
                            && latestTask.getRoleGroup().equals(request.getRoleGroup());
                }).peek(application -> {
                    CreditTask latestTask = latestTaskMap.get(application.getId());
                    application.setLatestTaskId(latestTask.getId());
                }).toList();
    }


    @Override
    public List<CreditApplication> getApplications(CreditStatus status) {
        List<CreditApplication> applications = applicationRepository.findByStatusOrderByCreateTimeDesc(status);
        Map<String, CreditTask> latestTaskMap = getLatestTaskMap(applications);
        if (CollectionUtils.isEmpty(latestTaskMap))
            return applications;
        return applications.stream()
                .peek(application -> {
                    CreditTask latestTask = latestTaskMap.get(application.getId());
                    application.setLatestTaskId(latestTask.getId());
                }).toList();
    }


    @Override
    public CreditTask closeApplication(String taskId) {
        CreditTask task = validateTaskAction(taskId, CreditStatus.IN_PROGRESS);
        if (StringUtils.hasLength(task.getErrorMsg()))
            return buildFailTask(task.getErrorMsg());
        CreditApplication application = validateApplicationAction(task.getApplicationId());
        if (StringUtils.hasLength(application.getErrorMsg()))
            return buildFailTask(application.getErrorMsg());
        application.setStatus(CreditStatus.CLOSED);
        CreditApplication applicationSaved = saveApplication(application);
        task.setStatus(CreditStatus.CLOSED);
        task.setApplication(applicationSaved);
        return taskRepository.save(task);
    }


    @Override
    public CreditTask claimTask(ClaimTask claimTask) {
        if (claimTask == null || !StringUtils.hasLength(claimTask.getTaskId())
                || !StringUtils.hasLength(claimTask.getUserName()))
            return buildFailTask("KHÔNG THÀNH CÔNG. YÊU CẦU NHẬN VIỆC KHÔNG HỢP LỆ");
        List<CreditTask> tasks = taskRepository.findAllByAssignee(claimTask.getUserName());
        if (!CollectionUtils.isEmpty(tasks)) {
            boolean isInProgress = tasks.stream().anyMatch(t -> CreditStatus.IN_PROGRESS == t.getStatus()
                    || CreditStatus.NEW == t.getStatus());
            if (isInProgress)
                return buildFailTask("KHÔNG THÀNH CÔNG. BẠN ĐANG XỬ LÝ HỒ SƠ KHÁC. " +
                        "HÃY XỬ LÝ TIẾP HOẶC ĐÓNG HỒ SƠ ĐÓ ĐỂ CÓ THỂ NHẬN VIỆC");
        }
        CreditTask task = validateTaskAction(claimTask.getTaskId(), CreditStatus.NEW);
        if (StringUtils.hasLength(task.getErrorMsg()))
            return buildFailTask(task.getErrorMsg());
        if (StringUtils.hasLength(task.getAssignee()))
            return buildFailTask("KHÔNG THÀNH CÔNG. CÔNG VIỆC ĐANG ĐƯỢC USER KHÁC XỬ LÝ");
        CreditApplication application = validateApplicationAction(task.getApplicationId());
        if (StringUtils.hasLength(application.getErrorMsg()))
            return buildFailTask(application.getErrorMsg());
        task.setAssignee(claimTask.getUserName());
        task.setStatus(CreditStatus.IN_PROGRESS);
        return taskRepository.save(task);
    }


    @Override
    public CreditTask getTask(String taskId) {
        CreditTask task = taskRepository.findById(taskId).orElse(new CreditTask());
        if (task.getId() == null)
            return task;
        CreditApplication application = applicationRepository
                .findById(task.getApplicationId()).orElse(new CreditApplication());
        task.setApplication(application);
        return task;
    }


    @Override
    public CreditTask completeTask(CreditTask task) {
        CreditApplication application = validateApplicationAction(task.getApplicationId());
        String result = application.getErrorMsg();
        if (StringUtils.hasLength(application.getErrorMsg())) {
            return buildFailTask(result);
        }
        CreditTask taskSaved = taskRepository.findById(task.getId()).orElse(null);
        if (taskSaved == null) {
            result = "KHÔNG THÀNH CÔNG. CÔNG VIỆC KHÔNG TỒN TẠI";
            return buildFailTask(result);
        }
        if (CreditStatus.IN_PROGRESS != application.getStatus() && RoleGroup.RB_RM != task.getRoleGroup()) {
            result = "KHÔNG THÀNH CÔNG. TRẠNG THÁI HỒ SƠ KHÔNG ĐƯỢC PHÉP HOÀN THÀNH";
            return buildFailTask(result);
        }
        if (RoleGroup.RB_AM == task.getRoleGroup()) {
            application.setStatus(task.getStatus());
            saveApplication(application);
            task.setStatus(CreditStatus.COMPLETED);
            return taskRepository.save(task);
        }
        if (RoleGroup.RB_RM == task.getRoleGroup()) {
            application.setStatus(CreditStatus.IN_PROGRESS);
            saveApplication(application);
        }
        task.setStatus(CreditStatus.COMPLETED);
        taskRepository.save(task);
        return createNextTask(taskSaved, application);
    }


    @Override
    public List<Model> getModels(Integer level) {
        if (level == null)
            return Collections.emptyList();
        return configClient.getModels(level);
    }


    private Map<String, CreditTask> getLatestTaskMap(List<CreditApplication> applications) {
        if (CollectionUtils.isEmpty(applications))
            return Collections.emptyMap();
        Set<String> applicationIds = applications.stream()
                .map(CreditApplication::getId)
                .collect(Collectors.toSet());
        List<CreditTask> tasks = taskRepository.findAllByApplicationIdIn(applicationIds);
        return tasks.stream()
                .collect(Collectors.toMap(
                        CreditTask::getApplicationId, // Key: applicationId
                        task -> task,                 // Value: CreditTask hiện tại
                        (existingTask, newTask) ->
                                existingTask.getCreateTime().isAfter(newTask.getCreateTime())
                                        ? existingTask
                                        : newTask             // Nếu trùng key, giữ lại task có createTime mới hơn
                ));
    }


    private CreditTask createNextTask(CreditTask task, CreditApplication application) {
        RoleGroup nextRoleGroup = task.getRoleGroup() == null ? RoleGroup.RB_RM
                : RoleGroup.RB_RM == task.getRoleGroup() ? RoleGroup.RB_CA : RoleGroup.RB_AM;
        int nextLevelTask = task.getRoleGroup() == null ? 1 : RoleGroup.RB_RM == task.getRoleGroup() ? 2 : 3;
        LocalDateTime now = LocalDateTime.now();
        List<Model> models = getModels(nextLevelTask);
        CreditTask newTask = new CreditTask();
        BeanUtils.copyProperties(task, newTask);
        newTask.setId(null);
        newTask.setAssignee(null);
        newTask.setApplicationId(application.getId());
        newTask.setRoleGroup(nextRoleGroup);
        newTask.setModels(models);
        newTask.setStatus(CreditStatus.NEW);
        newTask.setCreateTime(now);
        newTask.setUpdateTime(now);

        CreditTask newSaved = taskRepository.save(newTask);
        newTask.setNextTaskId(newSaved.getId());
        newTask.setApplication(application);
        return newSaved;
    }


    private CreditApplication validateApplicationAction(String applicationId) {
        CreditApplication application = applicationRepository.findById(applicationId).orElse(new CreditApplication());
        if (application.getId() == null) {
            application.setErrorMsg("KHÔNG THÀNH CÔNG. HỒ SƠ KHÔNG TỒN TẠI");
            return application;
        }
        if (CreditStatus.IN_PROGRESS != application.getStatus()) {
            application.setErrorMsg("KHÔNG THÀNH CÔNG. TRẠNG THÁI HỒ SƠ KHÔNG CHO PHÉP THỰC HIỆN YÊU CẦU NÀY");
            return application;
        }
        return application;
    }


    private CreditTask validateTaskAction(String taskId, CreditStatus status) {
        CreditTask task = getTask(taskId);
        if (task.getId() == null) {
            task.setErrorMsg("KHÔNG THÀNH CÔNG. TASK KHÔNG TỒN TẠI");
            return task;
        }
        if (status != task.getStatus()) {
            task.setErrorMsg("KHÔNG THÀNH CÔNG. TRẠNG THÁI TASK KHÔNG CHO PHÉP THỰC HIỆN YÊU CẦU NÀY");
            return task;
        }
        return task;
    }


    private CreditApplication saveApplication(CreditApplication application) {
        LocalDateTime now = LocalDateTime.now();
        if (application.getId() == null)
            application.setCreateTime(now);
        application.setUpdateTime(now);
        return applicationRepository.save(application);
    }


    private String validateApplication(CreditApplication application) {
        if (application == null)
            return "KHÔNG THÀNH CÔNG. THÔNG TIN HỒ SƠ KHÔNG ĐƯỢC PHÉP NULL";
        if (!StringUtils.hasLength(application.getLegalDocType()))
            return "KHÔNG THÀNH CÔNG. LOẠI CHỨNG TỪ PHÁP LÝ KHÁCH HÀNG KHÔNG ĐƯỢC ĐỂ TRỐNG";
        if (!StringUtils.hasLength(application.getLegalDocNumber()))
            return "KHÔNG THÀNH CÔNG. SỐ CHỨNG TỪ PHÁP LÝ KHÁCH HÀNG KHÔNG ĐƯỢC ĐỂ TRỐNG";
        String regexLegalDocNumber = "^\\d{12}$";
        if (!application.getLegalDocNumber().matches(regexLegalDocNumber))
            return "KHÔNG THÀNH CÔNG. ĐỊNH DẠNG SỐ CHỨNG TỪ PHÁP LÝ KHÁCH HÀNG KHÔNG HỢP LỆ";
        if (!StringUtils.hasLength(application.getPhone()))
            return "KHÔNG THÀNH CÔNG. SỐ ĐIỆN THOẠI KHÁCH HÀNG KHÔNG ĐƯỢC ĐỂ TRỐNG";
        String regexPhone = "^0\\d{9}$";
        if (!application.getPhone().matches(regexPhone))
            return "KHÔNG THÀNH CÔNG. ĐỊNH DẠNG SỐ ĐIỆN THOẠI KHÁCH HÀNG KHÔNG HỢP LỆ";
        if (!StringUtils.hasLength(application.getEmail()))
            return "KHÔNG THÀNH CÔNG. EMAIL KHÁCH HÀNG KHÔNG ĐƯỢC ĐỂ TRỐNG";
        String regexMail = "^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}$";
        if (!application.getEmail().matches(regexMail))
            return "KHÔNG THÀNH CÔNG. ĐỊNH DẠNG EMAIL KHÁCH HÀNG KHÔNG HỢP LỆ";
        if (!StringUtils.hasLength(application.getBirthday()))
            return "KHÔNG THÀNH CÔNG. NGÀY SINH KHÁCH HÀNG KHÔNG ĐƯỢC ĐỂ TRỐNG";
        if (!isValidBirthday(application.getBirthday()))
            return "KHÔNG THÀNH CÔNG. NGÀY SINH KHÁCH HÀNG KHÔNG HỢP LỆ";
        if (!StringUtils.hasLength(application.getLoanPurpose()))
            return "KHÔNG THÀNH CÔNG. MỤC ĐÍCH VAY KHÔNG ĐƯỢC ĐỂ TRỐNG";
        if (!StringUtils.hasLength(application.getLoanTerm()))
            return "KHÔNG THÀNH CÔNG. THỜI HẠN VAY KHÔNG ĐƯỢC ĐỂ TRỐNG";
        if (!StringUtils.hasLength(application.getId()))
            application.setId(null);
        return null;
    }


    public static boolean isValidBirthday(String birthdayStr) {
        String regexBirthday = "^\\d{2}/\\d{2}/\\d{4}$";
        if (birthdayStr == null || !birthdayStr.matches(regexBirthday)) {
            return false;
        }
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/uuuu")
                .withResolverStyle(ResolverStyle.STRICT);
        try {
            LocalDate birthday = LocalDate.parse(birthdayStr, formatter);
            LocalDate today = LocalDate.now();
            return birthday.isBefore(today);
        } catch (DateTimeParseException e) {
            return false;
        }
    }


    private CreditTask buildFailTask(String errorMsg) {
        log.error(errorMsg);
        CreditTask creditTask = new CreditTask();
        creditTask.setErrorMsg(errorMsg);
        return creditTask;
    }

}
