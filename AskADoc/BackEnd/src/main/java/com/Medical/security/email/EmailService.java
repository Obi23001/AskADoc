package com.Medical.security.email;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;
    private final SpringTemplateEngine templateEngine;

    @Async // for the user to not wait for so long for the mail to be sent
    public void sendEmail(String toWho,
                          String username,
                          EmailTemplateName emailTemplateName,
                          String confirmationUrl,
                          String activiationCode,
                          String subject) throws MessagingException {
        String templateName;
        if (emailTemplateName == null){
            templateName = "confirm-email";
        }else {
            templateName = emailTemplateName.name();
        }

        MimeMessage mimeMessage =   mailSender.createMimeMessage();
        MimeMessageHelper mimeMessageHelper =   new MimeMessageHelper(
                mimeMessage,
                MimeMessageHelper.MULTIPART_MODE_MIXED,
                StandardCharsets.UTF_8.name()
        );
        /**
         * Pass parameters to email HTML
         */
        Map<String, Object> properties = new HashMap<>();
        properties.put("username",username);
        properties.put("confirmationUrl",confirmationUrl);
        properties.put("activation_code",activiationCode);

        Context context = new Context();
        context.setVariables(properties);

        mimeMessageHelper.setFrom("contact@6solutions.com");
        mimeMessageHelper.setTo(toWho);
        mimeMessageHelper.setSubject(subject);

        String template = templateEngine.process(templateName, context);

        mimeMessageHelper.setText(template, true);

        mailSender.send(mimeMessage);
    }
}
