package ptit.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;
import ptit.entity.SystemUser;
import ptit.proxy.EmployeeClient;
import ptit.repository.SystemUserRepository;
import ptit.service.ISystemUser;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.time.format.ResolverStyle;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class SystemUserService implements ISystemUser {

    private final SystemUserRepository systemUserRepository;
    private final EmployeeClient employeeClient;


    @Override
    public String create(SystemUser systemUser) {
        String result = validateSystemUser(systemUser);
        if (StringUtils.hasLength(result)) {
            log.error(result);
            return result;
        }
        List<SystemUser> systemUsers = systemUserRepository.findAllByUserName(systemUser.getUserName());
        if (!CollectionUtils.isEmpty(systemUsers))
            return "KHÔNG THÀNH CÔNG. USER ĐÃ TỒN TẠI";
        systemUser.setId(null);
        return saveSystemUser(systemUser);
    }


    @Override
    public String update(SystemUser systemUser) {
        String result = validateSystemUser(systemUser);
        if (StringUtils.hasLength(result)) {
            log.error(result);
            return result;
        }
        if (!StringUtils.hasLength(systemUser.getId()))
            return "KHÔNG THÀNH CÔNG. THÔNG TIN ID KHÔNG HỢP LỆ";
        SystemUser systemUserSaved = systemUserRepository.findById(systemUser.getId()).orElse(null);
        if (systemUserSaved == null) {
            result = "KHÔNG THÀNH CÔNG. USER KHÔNG TỒN TẠI";
            log.error(result);
            return result;
        }
        systemUser.setUserName(systemUserSaved.getUserName());
        return saveSystemUser(systemUser);
    }


    @Override
    public SystemUser detail(String id) {
        return systemUserRepository.findById(id).orElse(new SystemUser());
    }


    @Override
    public SystemUser detail(String username, String password) {
        return systemUserRepository.findByUserNameAndPassword(username, password).orElse(new SystemUser());
    }


    @Override
    public List<SystemUser> list() {
        return systemUserRepository.findAllByOrderByUserNameDesc();
    }


    private String saveSystemUser(SystemUser systemUser) {
        systemUserRepository.save(systemUser);
        String result = "THÀNH CÔNG";
        log.info(result);
        return result;
    }


    private String validateSystemUser(SystemUser systemUser) {
        if (systemUser == null)
            return "KHÔNG THÀNH CÔNG. THÔNG TIN USER KHÔNG ĐƯỢC PHÉP NULL";
        if (!StringUtils.hasLength(systemUser.getUserName()))
            return "KHÔNG THÀNH CÔNG. MÃ NHÂN VIÊN KHÔNG ĐƯỢC ĐỂ TRỐNG";
        String password = systemUser.getPassword();
        if (!StringUtils.hasLength(password))
            return "KHÔNG THÀNH CÔNG. MẬT KHẨU KHÔNG ĐƯỢC ĐỂ TRỐNG";
        if (password.trim().length() < 6)
            return "KHÔNG THÀNH CÔNG. MẬT KHẨU PHẢI CÓ ÍT NHẤT 6 KÝ TỰ";
        if (!StringUtils.hasLength(systemUser.getFullName()))
            return "KHÔNG THÀNH CÔNG. HỌ VÀ TÊN KHÔNG ĐƯỢC ĐỂ TRỐNG";
        if (!StringUtils.hasLength(systemUser.getPhone()))
            return "KHÔNG THÀNH CÔNG. SỐ ĐIỆN THOẠI KHÔNG ĐƯỢC ĐỂ TRỐNG";
        String regexPhone = "^0\\d{9}$";
        if (!systemUser.getPhone().matches(regexPhone))
            return "KHÔNG THÀNH CÔNG. ĐỊNH DẠNG SỐ ĐIỆN THOẠI KHÔNG HỢP LỆ";
        if (!StringUtils.hasLength(systemUser.getEmail()))
            return "KHÔNG THÀNH CÔNG. EMAIL KHÔNG ĐƯỢC ĐỂ TRỐNG";
        String regexMail = "^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}$";
        if (!systemUser.getEmail().matches(regexMail))
            return "KHÔNG THÀNH CÔNG. ĐỊNH DẠNG EMAIL KHÔNG HỢP LỆ";
        if (!StringUtils.hasLength(systemUser.getBirthday()))
            return "KHÔNG THÀNH CÔNG. NGÀY SINH KHÔNG ĐƯỢC ĐỂ TRỐNG";
        if (!isValidBirthday(systemUser.getBirthday()))
            return "KHÔNG THÀNH CÔNG. NGÀY SINH KHÔNG HỢP LỆ";
        if (!StringUtils.hasLength(systemUser.getPosition()))
            return "KHÔNG THÀNH CÔNG. NGÀY SINH KHÔNG ĐƯỢC ĐỂ TRỐNG";
        if (!StringUtils.hasLength(systemUser.getId()))
            systemUser.setId(null);
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
