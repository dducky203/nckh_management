package com.example.server.utils;

/**
 * Tên authority dùng trong Spring Security (CustomUserDetails + SecurityConfig).
 * Đồng bộ nghiệp vụ với {@link SecurityUtils} và FE {@code permissions.js}.
 */
public final class SecurityRoles {

    private SecurityRoles() {
    }

    /** Role hệ thống admin (và chức danh lãnh đạo được map qua SecurityUtils.isAdmin). */
    public static final String ROLE_ADMIN = "ROLE_ADMIN";

    /** Role trợ lí NCKH. */
    public static final String ROLE_ASSISTANT = "ROLE_ASSISTANT";

    /** Role user thường. */
    public static final String ROLE_USER = "ROLE_USER";

    /** Sinh viên (power=4 hoặc title Sinh viên). */
    public static final String ROLE_STUDENT = "ROLE_STUDENT";

    /**
     * Vận hành NCKH: admin/lãnh đạo hoặc assistant.
     * Dùng cho duyệt hoạt động, định mức, quản lý tin, chat analysis...
     */
    public static final String NCKH_STAFF = "NCKH_STAFF";
    public static final String ROLE_NCKH_STAFF = "ROLE_NCKH_STAFF";

    /**
     * Quản trị hẹp: admin/lãnh đạo, không phải chỉ assistant.
     * Dùng cho quản lý người dùng toàn hệ thống.
     */
    public static final String STRICT_ADMIN = "STRICT_ADMIN";
    public static final String ROLE_STRICT_ADMIN = "ROLE_STRICT_ADMIN";
}
