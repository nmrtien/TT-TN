package ptit.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;
import ptit.entity.SystemUser;
import ptit.proxy.NotificationClient;
import ptit.repository.SystemUserRepository;
import ptit.service.ISystemUser;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.time.format.ResolverStyle;
import java.util.*;

import ptit.entity.Email;

@Slf4j
@Service
@RequiredArgsConstructor
public class SystemUserService implements ISystemUser {

    private final SystemUserRepository systemUserRepository;
    private final NotificationClient notificationClient;


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
        systemUser.setPassword(getNewPassword());
        sendEmail(systemUser);
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
        systemUser.setPassword(systemUserSaved.getPassword());
        return saveSystemUser(systemUser);
    }


    @Override
    public SystemUser detail(String id) {
        return systemUserRepository.findById(id).orElse(new SystemUser());
    }


    @Override
    public List<SystemUser> getUsers(Set<String> userNames) {
        return systemUserRepository.findAllByUserNameIn(userNames);
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
            return "KHÔNG THÀNH CÔNG. THÔNG TIN NGƯỜI DÙNG KHÔNG ĐƯỢC PHÉP NULL";
        String userName = systemUser.getUserName();
        if (!StringUtils.hasLength(userName))
            return "KHÔNG THÀNH CÔNG. MÃ NGƯỜI DÙNG KHÔNG ĐƯỢC ĐỂ TRỐNG";
        String regex = "^[a-zA-Z0-9]{4,}$";
        if (!userName.matches(regex))
            return "KHÔNG THÀNH CÔNG. MÃ NGƯỜI DÙNG KHÔNG HỢP LỆ";
        List<SystemUser> systemUsers = systemUserRepository.findAllByUserName(userName);
        if (!CollectionUtils.isEmpty(systemUsers))
            return "KHÔNG THÀNH CÔNG. MÃ NGƯỜI DÙNG ĐÃ TỒN TẠI";
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
        if (systemUser.getRoleGroup() == null)
            return "KHÔNG THÀNH CÔNG. NHÓM QUYỀN KHÔNG HỢP LỆ";
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


    private String getNewPassword() {
        String uuid = UUID.randomUUID().toString();
        Random random = new Random();
        int randomNumber = random.nextInt(900) + 100;
        return uuid.split("-")[0] + randomNumber;
    }


    private void sendEmail(SystemUser systemUser) {
        Email email = new Email();
        email.setSubject("THÔNG BÁO TẠO TÀI KHOẢN THÀNH CÔNG TẠI CREDIT SCORING PLATFORM");
        email.setContent("Chúc mừng bạn đã tạo thành công tài khoản tại CSP. " +
                "Vui lòng không cung cấp thông tin cho bất kỳ ai. UserName: "+systemUser.getUserName()
                +". Password: "+systemUser.getPassword());
        email.setTo(new HashSet<>(Collections.singleton(systemUser.getEmail())));
        notificationClient.sendEmail(email);
    }
}
