package com.example.server.utils;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.server.ResponseStatusException;

import com.example.server.domain.User;
import com.example.server.helpers.CustomUserDetails;

public class SecurityUtils {

    public static Integer getCurrentUserId() {
        // 1. Lấy authentication từ Context
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // 2. Kiểm tra xem có dữ liệu không
        if (authentication != null && authentication.isAuthenticated() 
            && authentication.getPrincipal() instanceof CustomUserDetails userDetails) {

            return userDetails.getId();
        }

        return null;
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

    /** power = 4 hoặc chức danh Sinh viên — không xem định mức cá nhân/nhóm. */
    public static boolean isStudent(User user) {
        if (user == null) {
            return false;
        }
        if (user.getPower() != null && user.getPower() == 4) {
            return true;
        }
        if (user.getIdTitle() != null && user.getIdTitle().getName() != null) {
            return "Sinh viên".equalsIgnoreCase(user.getIdTitle().getName().trim());
        }
        return false;
    }

    public static User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()
                && authentication.getPrincipal() instanceof CustomUserDetails userDetails) {
            return userDetails.getUser();
        }
        return null;
    }

    public static void assertCanAccessQuota(User user) {
        if (isStudent(user)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Sinh viên không được truy cập định mức hoạt động cá nhân và định mức nhóm.");
        }
    }

    public static void assertCurrentUserCanAccessQuota() {
        User user = getCurrentUser();
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Vui lòng đăng nhập");
        }
        assertCanAccessQuota(user);
    }

    /** Sinh viên không được xem danh sách / chi tiết nhóm giảng viên. */
    public static void assertCanViewLecturerResearchGroups(User user) {
        if (isStudent(user)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Sinh viên không được xem nhóm nghiên cứu giảng viên.");
        }
    }

    public static void assertCurrentUserCanViewLecturerResearchGroups() {
        User user = getCurrentUser();
        if (user != null) {
            assertCanViewLecturerResearchGroups(user);
        }
    }
}