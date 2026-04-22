package com.example.server.utils;

import java.time.LocalDate;
import java.time.MonthDay;

/**
 * Cửa sổ đăng ký phương án NCKH: từ ngày 02/01 đến 16/01 hàng năm (inclusive).
 * Sau 16/01 hệ thống tự động chọn PA1 và người dùng không thể thay đổi.
 */
public final class PlanSelectionWindowUtil {

    public static final MonthDay OPEN_DAY  = MonthDay.of(1, 2);   // 02/01
    public static final MonthDay CLOSE_DAY = MonthDay.of(1, 16);  // 16/01
    public static final MonthDay AUTO_ASSIGN_DAY = MonthDay.of(1, 17); // tự động gán PA1

    public static final int DEFAULT_PLAN_ID = 1; // PA1

    private PlanSelectionWindowUtil() {}

    /** Trả về true nếu ngày hiện tại nằm trong cửa sổ đăng ký (02/01 → 16/01). */
    public static boolean isOpen() {
        return isOpen(LocalDate.now());
    }

    public static boolean isOpen(LocalDate date) {
        MonthDay today = MonthDay.from(date);
        return !today.isBefore(OPEN_DAY) && !today.isAfter(CLOSE_DAY);
    }

    /** Trả về true nếu hôm nay là đúng ngày khai mạc (02/01). */
    public static boolean isOpeningDay() {
        return MonthDay.from(LocalDate.now()).equals(OPEN_DAY);
    }

    /** Trả về true nếu hôm nay là đúng ngày cuối (16/01). */
    public static boolean isClosingDay() {
        return MonthDay.from(LocalDate.now()).equals(CLOSE_DAY);
    }

    /** Trả về true nếu đã qua hạn (sau 16/01). */
    public static boolean isPastDeadline() {
        return MonthDay.from(LocalDate.now()).isAfter(CLOSE_DAY);
    }
}
