package com.example.server.utils;

public class NormalizeUtils {
    public static String normalizeName(String name) {
        if (name == null || name.isBlank()) return null;

        name = name.trim().toLowerCase();

        StringBuilder result = new StringBuilder();
        for (String w : name.split("\\s+")) {
            result.append(Character.toUpperCase(w.charAt(0)))
                    .append(w.substring(1))
                    .append(" ");
        }
        return result.toString().trim();
    }

    public static String normalizeEmail(String email) {
        return email == null ? null : email.trim().toLowerCase();
    }
}
