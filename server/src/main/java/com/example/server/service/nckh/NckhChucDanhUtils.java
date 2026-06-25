package com.example.server.service.nckh;

/**
 * Chuẩn hoá chức danh (tên hiển thị hoặc mã) sang enum DB: GS_PGS, TS, THS, KS_CN.
 */
public final class NckhChucDanhUtils {

    private NckhChucDanhUtils() {}

    public static String toEnumKey(String raw) {
        if (raw == null || raw.isBlank()) {
            return "KS_CN";
        }
        String up = raw.trim().toUpperCase().replace(" ", "").replace("/", "_");
        if (up.contains("GS") || up.contains("PGS")) {
            return "GS_PGS";
        }
        if (up.equals("TS") || up.contains("TIEN") || up.contains("TIẾN")) {
            return "TS";
        }
        if (up.equals("THS") || up.contains("THAC") || up.contains("THẠC")) {
            return "THS";
        }
        if (up.equals("KS_CN") || up.contains("KS") || up.contains("CN") || up.contains("CU_NHAN")) {
            return "KS_CN";
        }
        return up;
    }
}
