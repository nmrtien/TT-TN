package ptit.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;
import ptit.constant.CreditStatus;
import ptit.constant.RoleGroup;
import ptit.entity.CreditApplication;
import ptit.entity.CreditTask;
import ptit.repository.CreditApplicationRepository;
import ptit.repository.CreditTaskRepository;
import ptit.service.IScoring;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.time.format.ResolverStyle;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ScoringService implements IScoring {

    private final CreditApplicationRepository applicationRepository;

    private final CreditTaskRepository taskRepository;


    @Override
    public String createApplication(CreditApplication application) {
        String result = validateApplication(application);
        if (StringUtils.hasLength(result)) {
            log.error(result);
            return result;
        }
        List<CreditApplication> applications = applicationRepository
                .findByLegalDocTypeAndLegalDocNumberAndStatus(application.getLegalDocType(),
                        application.getLegalDocNumber(), CreditStatus.IN_PROGRESS.name());
        if (!CollectionUtils.isEmpty(applications)) {
            result = "KHÔNG THÀNH CÔNG. ĐANG TỒN TẠI HỒ SƠ CỦA KHÁCH HÀNG CHƯA XỬ LÝ XONG, " +
                    "VUI LÒNG HOÀN TẤT HOẶC ĐÓNG CÁC HỒ SƠ CŨ ĐỂ TIẾP TỤC";
            log.error(result);
            return result;
        }
        return saveApplication(application);
    }


    @Override
    public String closeApplication(String applicationId) {
        CreditApplication application = validateAction(applicationId);
        String result = application.getValidateResult();
        if (StringUtils.hasLength(application.getValidateResult())) {
            log.error(result);
            return result;
        }
        application.setStatus(CreditStatus.CLOSED);
        return saveApplication(application);
    }


    @Override
    public String completeTask(CreditTask task) {
        CreditApplication application = validateAction(task.getApplicationId());
        String result = application.getValidateResult();
        if (StringUtils.hasLength(application.getValidateResult())) {
            log.error(result);
            return result;
        }
        CreditTask taskSaved = taskRepository.findById(task.getId()).orElse(null);
        if (taskSaved == null) {
            result = "KHÔNG THÀNH CÔNG. CÔNG VIỆC KHÔNG TỒN TẠI";
            log.error(result);
            return result;
        }
        if (CreditStatus.IN_PROGRESS != application.getStatus()) {
            result = "KHÔNG THÀNH CÔNG. TRẠNG THÁI HỒ SƠ KHÔNG ĐƯỢC PHÉP HOÀN THÀNH";
            log.error(result);
            return result;
        }
        if (RoleGroup.RB_AM == task.getRoleGroup()) {
            taskRepository.save(task);
            application.setStatus(task.getStatus());
            return saveApplication(application);
        }
        int levelTask = RoleGroup.RB_RM == task.getRoleGroup() ? 1 : 2;
    }


    private CreditApplication validateAction(String applicationId) {
        CreditApplication application = applicationRepository.findById(applicationId).orElse(new CreditApplication());
        if (application.getId() == null) {
            application.setValidateResult("KHÔNG THÀNH CÔNG. HỒ SƠ KHÔNG TỒN TẠI");
            return application;
        }
        if (CreditStatus.IN_PROGRESS != application.getStatus()) {
            application.setValidateResult("KHÔNG THÀNH CÔNG. TRẠNG THÁI HỒ SƠ KHÔNG CHO PHÉP THỰC HIỆN YÊU CẦU NÀY");
            return application;
        }
        return application;
    }


    private String saveApplication(CreditApplication application) {
        applicationRepository.save(application);
        String result = "THÀNH CÔNG";
        log.info(result);
        return result;
    }


    private String validateApplication(CreditApplication application) {
        if (application == null)
            return "KHÔNG THÀNH CÔNG. THÔNG TIN HỒ SƠ KHÔNG ĐƯỢC PHÉP NULL";
        if (!StringUtils.hasLength(application.getLegalDocType()))
            return "KHÔNG THÀNH CÔNG. LOẠI CHỨNG TỪ PHÁP LÝ KHÁCH HÀNG KHÔNG ĐƯỢC ĐỂ TRỐNG";
        if (!StringUtils.hasLength(application.getLegalDocNumber()))
            return "KHÔNG THÀNH CÔNG. SỐ CHỨNG TỪ PHÁP LÝ KHÁCH HÀNG KHÔNG ĐƯỢC ĐỂ TRỐNG";
        String regexLegalDocNumber = "d{12}$";
        if (!application.getPhone().matches(regexLegalDocNumber))
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

}
