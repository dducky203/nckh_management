package com.example.server.service;

import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Service
public class EmailService {

    @Autowired
    private TemplateEngine templateEngine;

    @Autowired
    private JavaMailSender mailSender;

    @Value("${kltn.frontend.url}")
    private String frontendUrl;

    // Gửi email forgot password với template HTML
    public void sendForgotPasswordEmail(String toEmail, String name,  String token) {
        try {
            // 1. Tạo dữ liệu cho template
            Context context = new Context();
            context.setVariable("name", name);
            context.setVariable("resetLink", frontendUrl + "/reset-password?token=" + token);

            // 2. Render file HTML ra chuỗi
            String htmlContent = templateEngine.process("forgotPassword", context);

            // 3. Tạo email
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom("noreply@fita.vnua.edu.vn");
            helper.setTo(toEmail);
            helper.setSubject("Đặt lại mật khẩu - Hệ thống NCKH FITA");
            helper.setText(htmlContent, true);

            // 4. Gửi email
            mailSender.send(message);

        } catch (Exception e) {
            throw new RuntimeException("Không thể gửi email: " + e.getMessage());
        }
    }

    // Method gửi email đơn giản (giữ lại cho tương thích)
    public void sendSimpleEmail(String toEmail, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("noreply@fita.vnua.edu.vn");
            message.setTo(toEmail);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("Không thể gửi email: " + e.getMessage());
        }
    }
}
