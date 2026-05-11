package com.example.server.service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    private static final String SENDER  = "noreply@fita.vnua.edu.vn";
    private static final DateTimeFormatter DATETIME_FMT =
            DateTimeFormatter.ofPattern("HH:mm dd/MM/yyyy");

    @Autowired
    private TemplateEngine templateEngine;

    @Autowired
    private JavaMailSender mailSender;

    @Value("${kltn.frontend.url}")
    private String frontendUrl;

    public void sendForgotPasswordEmail(String toEmail, String name, String token) {
        Context context = new Context();
        context.setVariable("name", name);
        context.setVariable("resetLink", frontendUrl + "/reset-password?token=" + token);
        sendHtml(toEmail, "Đặt lại mật khẩu - Hệ thống NCKH FITA", "forgotPassword", context);
    }

    public void sendSimpleEmail(String toEmail, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(SENDER);
            message.setTo(toEmail);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("Không thể gửi email: " + e.getMessage());
        }
    }

    /**
     * Nhắc người dùng chọn phương án NCKH.
     *
     * @param isLastDay true nếu hôm nay là ngày cuối (16/01)
     */
    @Async
    public void sendPlanSelectionReminderEmail(String toEmail, String name,
                                               int year, boolean isLastDay) {
        Context ctx = new Context();
        ctx.setVariable("name", name);
        ctx.setVariable("year", year);
        ctx.setVariable("isLastDay", isLastDay);
        ctx.setVariable("selectUrl", frontendUrl + "/activity/standards");

        String subject = isLastDay
                ? "[NCKH " + year + "] Nhắc nhở cuối: Hôm nay là hạn chót đăng ký phương án!"
                : "[NCKH " + year + "] Thông báo mở đăng ký phương án nghiên cứu khoa học";

        sendHtml(toEmail, subject, "planSelectionReminder", ctx);
    }

    /**
     * Xác nhận người dùng đã chọn (hoặc được tự động gán) phương án.
     *
     * @param autoAssigned true nếu do hệ thống tự động gán PA1
     */
    @Async
    public void sendPlanSelectionConfirmationEmail(String toEmail, String name,
                                                   int planId, int year,
                                                   LocalDateTime selectedAt,
                                                   boolean autoAssigned) {
        Context ctx = new Context();
        ctx.setVariable("name", name);
        ctx.setVariable("planId", planId);
        ctx.setVariable("year", year);
        ctx.setVariable("selectedAt", selectedAt.format(DATETIME_FMT));
        ctx.setVariable("autoAssigned", autoAssigned);

        String subject = autoAssigned
                ? "[NCKH " + year + "] Hệ thống đã tự động gán PA1 cho bạn"
                : "[NCKH " + year + "] Xác nhận đăng ký PA" + planId + " thành công";

        sendHtml(toEmail, subject, "planSelectionConfirmation", ctx);
    }

    // ── internal helper ──────────────────────────────────────────────────────

    private void sendHtml(String toEmail, String subject, String template, Context ctx) {
        try {
            String html = templateEngine.process(template, ctx);
            MimeMessage msg = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(msg, true, "UTF-8");
            helper.setFrom(SENDER);
            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setText(html, true);
            mailSender.send(msg);
        } catch (Exception e) {
            throw new RuntimeException("Không thể gửi email tới " + toEmail + ": " + e.getMessage(), e);
        }
    }
}
