package com.example.server.utils;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import com.example.server.domain.User;
import com.example.server.helpers.CustomUserDetails;

public class SecurityUtils {

    public static Integer getCurrentUserId() {
        // 1. Lấy authentication từ Context
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // 2. Kiểm tra xem có dữ liệu không
        if (authentication != null && authentication.isAuthenticated() 
            && authentication.getPrincipal() instanceof CustomUserDetails) {

            // 3. Ép kiểu về CustomUserDetails
            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

            // 4. Lấy ID từ entity User bên trong
            return userDetails.getId();
        }

        return null; // Trả về null nếu chưa đăng nhập hoặc lỗi
    }

    /**
     * Kiểm tra xem user có quyền admin không
     * Admin bao gồm:
     * - Role = admin (bất kể hoa/thường), hoặc
     * - Title = "Thư ký", "Trưởng khoa", "Phó khoa"
     * Role {@code assistant} chỉ được coi là đủ quyền khi đồng thời có một trong các chức danh trên.
     */
    public static boolean isAdmin(User user) {
        if (user == null) {
            return false;
        }

        if (user.getIdRole() != null && user.getIdRole().getName() != null) {
            String roleName = user.getIdRole().getName().trim();
            if ("admin".equalsIgnoreCase(roleName)) {
                return true;
            }
        }

        if (user.getIdTitle() != null && user.getIdTitle().getName() != null) {
            String titleName = user.getIdTitle().getName().trim();
            return "Thư ký".equalsIgnoreCase(titleName)
                || "Trưởng khoa".equalsIgnoreCase(titleName)
                || "Phó khoa".equalsIgnoreCase(titleName);
        }

        return false;
    }

    /** Role hệ thống Trợ lí NCKH: quyền nghiệp vụ cao hơn user, chỉ sau admin. */
    public static boolean isAssistant(User user) {
        if (user == null || user.getIdRole() == null || user.getIdRole().getName() == null) {
            return false;
        }
        return "assistant".equalsIgnoreCase(user.getIdRole().getName().trim());
    }

    /** Được thao tác các chức năng vận hành NCKH (duyệt, định mức năm, …): admin/lãnh đạo hoặc Trợ lí NCKH. */
    public static boolean hasNckhStaffAccess(User user) {
        return isAdmin(user) || isAssistant(user);
    }

    /**
     * Quản trị “hẹp”: user đủ quyền admin theo {@link #isAdmin} nhưng không phải chỉ role assistant.
     * Dùng để chặn Trợ lí NCKH khỏi các màn chỉ dành cho quản trị viên (vd. quản lý user toàn hệ thống).
     */
    public static boolean isStrictAdminPortalUser(User user) {
        return isAdmin(user) && !isAssistant(user);
    }
}