package com.example.server.service;

import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
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

    // Gửi email forgot password với template HTML
    public void sendForgotPasswordEmail(String toEmail, String username, String newPassword) {
        try {
            // 1. Tạo dữ liệu cho template
            Context context = new Context();
            context.setVariable("username", username);
            context.setVariable("newPassword", newPassword);
            context.setVariable("resetLink", "http://localhost:3000/login"); // Link về trang login

            // 2. Render file HTML ra chuỗi
            String htmlContent = templateEngine.process("forgotPassword", context);

            // 3. Tạo email
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom("noreply@fita.vnua.edu.vn");
            helper.setTo(toEmail);
            helper.setSubject("Đặt lại mật khẩu - Hệ thống NCKH FITA");
            helper.setText(htmlContent, true); // true = HTML

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
