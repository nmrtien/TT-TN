package ptit.service.impl;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;
import ptit.entity.Email;
import ptit.service.IEmail;


@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService implements IEmail {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String from;

    @Override
    public void sendEmail(Email email) {
        try {
            if (email == null || !StringUtils.hasLength(email.getSubject()) || !StringUtils.hasLength(email.getContent())
                    || CollectionUtils.isEmpty(email.getTo()))
                return;
            String greeting = "<p>Dear anh/chị,</p>" ;
            String signature = "<br>\n" +
                    "<br>\n" +
                    "\n" +
                    "<div style=\"font-family: Arial, Helvetica, sans-serif; font-size: 13px; color: #555;\">\n" +
                    "    <div style=\"border-top: 1px solid #dddddd; padding-top: 12px;\">\n" +
                    "        <strong style=\"font-size: 14px; color: #222;\">\n" +
                    "            PTIT Credit Scoring System\n" +
                    "        </strong>\n" +
                    "        <br>\n" +
                    "\n" +
                    "        <span>\n" +
                    "            Hệ thống chấm điểm tín dụng khách hàng cá nhân\n" +
                    "        </span>\n" +
                    "        <br>\n" +
                    "\n" +
                    "        <span style=\"color: #999;\">\n" +
                    "            This is an automated email. Please do not reply.\n" +
                    "        </span>\n" +
                    "    </div>\n" +
                    "</div>";
            String content = greeting + email.getContent() + signature;
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(from);
            helper.setTo(email.getTo().toArray(new String[0]));
            if (!CollectionUtils.isEmpty(email.getCc()))
                helper.setCc(email.getCc().toArray(new String[0]));
            helper.setSubject(email.getSubject());
            helper.setText(content, true);
            mailSender.send(message);
        } catch (Exception e) {
            log.error(e.getMessage(), e);
        }
    }

}
