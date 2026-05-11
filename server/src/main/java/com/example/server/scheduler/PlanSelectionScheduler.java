package com.example.server.scheduler;

import java.time.LocalDate;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.example.server.service.nckh.UserPlanYearService;


@Component
public class PlanSelectionScheduler {

    private static final Logger log = LoggerFactory.getLogger(PlanSelectionScheduler.class);

    private final UserPlanYearService userPlanYearService;

    public PlanSelectionScheduler(UserPlanYearService userPlanYearService) {
        this.userPlanYearService = userPlanYearService;
    }

    /**
     * Chạy lúc 08:00 ngày 02/01 hàng năm.
     * Gửi email thông báo mở đăng ký phương án.
     */
    @Scheduled(cron = "0 0 8 2 1 *")
    public void sendOpeningReminder() {
        int year = LocalDate.now().getYear();
        log.info("[PlanScheduler] Gửi email nhắc MỞ đăng ký PA năm {}", year);
        try {
            userPlanYearService.sendReminderEmails(year, false);
            log.info("[PlanScheduler] Đã gửi email nhắc mở đăng ký PA năm {}", year);
        } catch (Exception e) {
            log.error("[PlanScheduler] Lỗi khi gửi email nhắc mở đăng ký: {}", e.getMessage(), e);
        }
    }

    /**
     * Chạy lúc 08:00 ngày 16/01 hàng năm.
     * Gửi email nhắc nhở lần cuối (hạn chót hôm nay).
     */
    @Scheduled(cron = "0 0 8 16 1 *")
    public void sendClosingReminder() {
        int year = LocalDate.now().getYear();
        log.info("[PlanScheduler] Gửi email nhắc HẠN CUỐI đăng ký PA năm {}", year);
        try {
            userPlanYearService.sendReminderEmails(year, true);
            log.info("[PlanScheduler] Đã gửi email nhắc hạn cuối PA năm {}", year);
        } catch (Exception e) {
            log.error("[PlanScheduler] Lỗi khi gửi email nhắc hạn cuối: {}", e.getMessage(), e);
        }
    }

    /**
     * Chạy lúc 00:05 ngày 17/01 hàng năm.
     * Tự động gán PA1 cho tất cả user chưa chọn phương án.
     */
    @Scheduled(cron = "0 5 0 17 1 *")
    public void autoAssignDefaultPlan() {
        int year = LocalDate.now().getYear();
        log.info("[PlanScheduler] Bắt đầu tự động gán PA1 cho năm {}", year);
        try {
            int count = userPlanYearService.autoAssignDefaultPlan(year);
            log.info("[PlanScheduler] Đã tự động gán PA1 cho {} user năm {}", count, year);
        } catch (Exception e) {
            log.error("[PlanScheduler] Lỗi khi tự động gán PA1: {}", e.getMessage(), e);
        }
    }
}
