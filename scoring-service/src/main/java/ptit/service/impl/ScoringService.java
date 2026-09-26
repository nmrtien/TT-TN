package ptit.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;
import ptit.constant.CreditStatus;
import ptit.constant.RoleGroup;
import ptit.entity.*;
import ptit.proxy.ConfigClient;
import ptit.proxy.NotificationClient;
import ptit.proxy.UserClient;
import ptit.repository.CreditApplicationRepository;
import ptit.repository.CreditTaskRepository;
import ptit.service.IScoring;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.time.format.ResolverStyle;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class ScoringService implements IScoring {

    private final CreditApplicationRepository applicationRepository;

    private final CreditTaskRepository taskRepository;

    private final ConfigClient configClient;

    private final UserClient userClient;

    private final NotificationClient notificationClient;


    @Override
    public CreditTask createApplication(CreditApplication application) {
        String result = validateApplication(application);
        if (StringUtils.hasLength(result))
            return buildFailTask(result);
        if (!StringUtils.hasLength(application.getCreateBy()))
            return buildFailTask("KHÔNG THÀNH CÔNG. NGƯỜI KHỞI TẠO HỒ SƠ KHÔNG ĐƯỢC ĐỂ TRỐNG");
        List<CreditApplication> applications = applicationRepository
                .findByLegalDocTypeAndLegalDocNumberAndStatus(application.getLegalDocType(),
                        application.getLegalDocNumber(), CreditStatus.IN_PROGRESS.name());
        if (!CollectionUtils.isEmpty(applications))
            return buildFailTask("KHÔNG THÀNH CÔNG. ĐANG TỒN TẠI HỒ SƠ CỦA KHÁCH HÀNG CHƯA XỬ LÝ XONG, " +
                    "VUI LÒNG HOÀN TẤT HOẶC ĐÓNG CÁC HỒ SƠ CŨ ĐỂ TIẾP TỤC");
        application.setStatus(CreditStatus.IN_PROGRESS);
        CreditApplication applicationSaved = saveApplication(application);
        sendEmail(new HashSet<>(Collections.singleton(application.getCreateBy())),
                "THÔNG BÁO KHỞI TẠO HỒ SƠ THÀNH CÔNG TẠI CREDIT SCORING PLATFORM",
                "Bạn đã khởi tạo hồ sơ thành công với mã hồ sơ: "+application.getId()
                        +". Thông tin khách hàng: "+application.getFullName()+", số Chứng từ pháp lý: "
                        +application.getLegalDocNumber());
        return createNextTask(new CreditTask(), applicationSaved, application.getCreateBy(), CreditStatus.IN_PROGRESS);
    }


    @Override
    public List<CreditApplication> getApplications(ApplicationRequest request) {
        List<CreditTask> tasks;
        if (CreditStatus.NEW == request.getStatus())
            tasks = taskRepository.findAllByRoleGroupAndAssigneeIsNull(request.getRoleGroup());
        else tasks = taskRepository.findAllByRoleGroupAndAssignee(request.getRoleGroup(), request.getUserName());
        if (CollectionUtils.isEmpty(tasks))
            return Collections.emptyList();
        Set<String> applicationIds = tasks.stream()
                .map(CreditTask::getApplicationId)
                .collect(Collectors.toSet());
        List<CreditApplication> applications = applicationRepository.findAllByIdInOrderByCreateTimeDesc(applicationIds);
        if (CollectionUtils.isEmpty(applications))
            return Collections.emptyList();
        List<CreditApplication> applicationsFinal;
        if (CreditStatus.NEW != request.getStatus())
            applicationsFinal = applications.stream()
                    .filter(application -> application.getStatus() == request.getStatus())
                    .toList();
        else
            applicationsFinal = new ArrayList<>(applications);
        Map<String, String> latestTaskMap = tasks.stream()
                .collect(Collectors.toMap(CreditTask::getApplicationId, CreditTask::getId, (a, b) -> a));
        return applicationsFinal.stream()
                .peek(application ->
                    application.setLatestTaskId(latestTaskMap.get(application.getId()))
                ).toList();
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
        CreditTask task = validateTaskAction(claimTask.getTaskId(), CreditStatus.NEW);
        if (StringUtils.hasLength(task.getErrorMsg()))
            return buildFailTask(task.getErrorMsg());
        if (StringUtils.hasLength(task.getAssignee()))
            return buildFailTask("KHÔNG THÀNH CÔNG. CÔNG VIỆC ĐANG ĐƯỢC USER KHÁC XỬ LÝ");
        CreditApplication application = validateApplicationActionClaim(task.getApplicationId());
        if (StringUtils.hasLength(application.getErrorMsg()))
            return buildFailTask(application.getErrorMsg());
        application.setStatus(CreditStatus.IN_PROGRESS);
        saveApplication(application);
        task.setAssignee(claimTask.getUserName());
        task.setStatus(CreditStatus.IN_PROGRESS);
        CreditTask taskSaved = taskRepository.save(task);
        sendEmail(new HashSet<>(Collections.singleton(taskSaved.getAssignee())),
                "THÔNG BÁO TIẾP NHẬN CÔNG VIỆC THÀNH CÔNG TẠI CREDIT SCORING PLATFORM",
                "Bạn đã tiếp nhận công việc thành công cho hồ sơ: "+application.getId()
                        +". Thông tin khách hàng: "+application.getFullName()+", số Chứng từ pháp lý: "
                        +application.getLegalDocNumber());
        return taskSaved;
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
    public CreditTask detailTask(ApplicationRequest request) {
        CreditApplication application = applicationRepository
                .findById(request.getApplicationId()).orElse(new CreditApplication());
        CreditTask task = taskRepository
                .findByApplicationIdAndAssigneeAndRoleGroup(request.getApplicationId(), request.getUserName(),
                        request.getRoleGroup());
        if (task == null)
            return buildFailTask("BẠN KHÔNG CÓ CÔNG VIỆC NÀO CỦA HỒ SƠ NÀY");
        task.setApplication(application);
        return task;
    }


    @Override
    public CreditTask completeTask(CreditTask taskRequest) {
        CreditApplication application = validateApplicationAction(taskRequest.getApplicationId());
        String result = application.getErrorMsg();
        if (StringUtils.hasLength(application.getErrorMsg()))
            return buildFailTask(result);
        CreditTask taskSaved = taskRepository.findById(taskRequest.getId()).orElse(null);
        if (taskSaved == null)
            return buildFailTask("KHÔNG THÀNH CÔNG. CÔNG VIỆC KHÔNG TỒN TẠI");
        if (CreditStatus.IN_PROGRESS != application.getStatus() && RoleGroup.RB_RM != taskRequest.getRoleGroup())
            return buildFailTask("KHÔNG THÀNH CÔNG. TRẠNG THÁI HỒ SƠ KHÔNG ĐƯỢC PHÉP HOÀN THÀNH");
        if (CreditStatus.CLOSED == taskRequest.getCompleteType() && !StringUtils.hasLength(taskRequest.getComment()))
            return buildFailTask("KHÔNG THÀNH CÔNG. LÝ DO ĐÓNG HỒ SƠ KHÔNG ĐƯỢC ĐỂ TRỐNG");
        taskSaved.setComment(taskRequest.getComment());
        taskSaved.setModels(taskRequest.getModels());
        taskSaved.setStatus(CreditStatus.COMPLETED);
        CreditApplication applicationSaved = application;
        if (RoleGroup.RB_AM == taskSaved.getRoleGroup() || CreditStatus.CLOSED == taskRequest.getCompleteType()) {
            application.setStatus(taskRequest.getCompleteType());
            applicationSaved = saveApplication(application);
            taskSaved.setApplication(applicationSaved);
            CreditTask lastTask = taskRepository.save(taskSaved);
            String applicationStatus = CreditStatus.CLOSED == application.getStatus() ? "ĐÃ BỊ ĐÓNG với lý do: " + taskSaved.getComment()
                    : CreditStatus.APPROVED == application.getStatus() ? "ĐÃ ĐƯỢC PHÊ DUYỆT với nội dung: " + taskSaved.getComment()
                    : CreditStatus.REJECTED == application.getStatus() ? "ĐÃ BỊ TỪ CHỐI PHÊ DUYỆT với lý do: " + taskSaved.getComment() : "";
            List<CreditTask> tasks = taskRepository.findAllByApplicationId(application.getId());
            Set<String> userNames = tasks.stream()
                    .map(CreditTask::getAssignee)
                    .filter(StringUtils::hasLength).collect(Collectors.toSet());
            sendEmail(userNames,
                    "THÔNG BÁO HỒ SƠ ĐÃ ĐƯỢC HOÀN TẤT TẠI CREDIT SCORING PLATFORM",
                    "Hồ sơ với mã: "+application.getId()+". Thông tin khách hàng: "
                            +application.getFullName()+", số Chứng từ pháp lý: "
                            +application.getLegalDocNumber() +" đã hoàn tất. Trạng thái hồ sơ: "+applicationStatus);
            return lastTask;
        }
        if (RoleGroup.RB_RM == taskSaved.getRoleGroup()) {
            application.setStatus(CreditStatus.IN_PROGRESS);
            applicationSaved = saveApplication(application);
        }
        taskSaved.setApplication(applicationSaved);
        CreditTask taskAfterSaved = taskRepository.save(taskSaved);
        createNextTask(taskSaved, application, null, CreditStatus.NEW);
        return taskAfterSaved;
    }


    @Override
    public List<Model> getModels(String roleGroup) {
        if (!StringUtils.hasLength(roleGroup))
            return Collections.emptyList();
        return configClient.getModels(roleGroup);
    }


    @Override
    public List<CreditApplication> getAllApplication() {
        return applicationRepository.findAll();
    }


    @Override
    public List<CreditTask> getAllTasks() {
        return taskRepository.findAll();
    }


    private CreditTask createNextTask(CreditTask task, CreditApplication application,
                                      String assignee, CreditStatus status) {
        RoleGroup nextRoleGroup = task.getRoleGroup() == null ? RoleGroup.RB_RM
                : RoleGroup.RB_RM == task.getRoleGroup() ? RoleGroup.RB_CA : RoleGroup.RB_AM;
        LocalDateTime now = LocalDateTime.now();
        List<Model> models = task.getModels() == null ? new ArrayList<>() : task.getModels();
        List<Model> modelsNew = getModels(nextRoleGroup.name());
        models.addAll(modelsNew);
        CreditTask newTask = new CreditTask();
        BeanUtils.copyProperties(task, newTask);
        newTask.setId(null);
        newTask.setAssignee(assignee);
        newTask.setApplicationId(application.getId());
        newTask.setRoleGroup(nextRoleGroup);
        newTask.setModels(models);
        newTask.setStatus(status);
        newTask.setCreateTime(now);
        newTask.setUpdateTime(now);

        CreditTask newSaved = taskRepository.save(newTask);
        newTask.setNextTaskId(newSaved.getId());
        newTask.setApplication(application);
        return newSaved;
    }


    private CreditApplication validateApplicationActionClaim(String applicationId) {
        CreditApplication application = applicationRepository.findById(applicationId).orElse(new CreditApplication());
        if (application.getId() == null) {
            application.setErrorMsg("KHÔNG THÀNH CÔNG. HỒ SƠ KHÔNG TỒN TẠI");
            return application;
        }
        return application;
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


    private void sendEmail(Set<String> userNames, String subject, String content) {
        Email email = new Email();
        email.setTo(userNames);
        List<SystemUser> users = userClient.getUsers(email);
        if (CollectionUtils.isEmpty(users)) {
            log.info("get users with response is empty");
            return;
        }
        Set<String> to = users.stream()
                .map(SystemUser::getEmail)
                .collect(Collectors.toSet());
        email.setTo(to);
        email.setSubject(subject);
        email.setContent(content);
        notificationClient.sendEmail(email);
    }

}
