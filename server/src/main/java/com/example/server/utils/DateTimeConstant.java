package com.example.server.utils;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Date;

public class DateTimeConstant {
    private static final DateTimeFormatter FORMAT_DD_MM_YY = DateTimeFormatter.ofPattern("dd/MM/yy");
    private static final DateTimeFormatter FORMAT_DD_MM_YYYY = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    private static final DateTimeFormatter FORMAT_TIME_DATE = DateTimeFormatter.ofPattern("HH:mm:ss dd/MM/yyyy");

    public static String toDate(LocalDate date) {
        if (date == null) return null;
        return date.format(FORMAT_DD_MM_YY);
    }
    public static String toDate(Date date) {
        if (date == null) return null;
        return date.toInstant()
                .atZone(ZoneId.systemDefault())
                .toLocalDateTime()
                .format(FORMAT_DD_MM_YYYY);
    }
    public static String toDateTime(Date date) {
        if (date == null) return null;

        return date.toInstant()
                .atZone(ZoneId.systemDefault())
                .toLocalDateTime()
                .format(FORMAT_TIME_DATE);
    }
}
