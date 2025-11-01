package com.example.server.utils;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

public class DateTimeConstant {
    private static final DateTimeFormatter FORMAT_DD_MM_YY =
            DateTimeFormatter.ofPattern("dd/MM/yy");

    public static String toDate(LocalDate date) {
        if (date == null) return null;
        return date.format(FORMAT_DD_MM_YY);
    }
}
