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
     * - Role = "ADMIN"
     * - Title = "Thư ký", "Trưởng khoa", "Phó khoa"
     */
    public static boolean isAdmin(User user) {
        if (user == null) {
            return false;
        }

        // Kiểm tra role
        if (user.getIdRole() != null && "ADMIN".equalsIgnoreCase(user.getIdRole().getName())) {
            return true;
        }

        // Kiểm tra title
        if (user.getIdTitle() != null && user.getIdTitle().getName() != null) {
            String titleName = user.getIdTitle().getName().trim();
            return "Thư ký".equalsIgnoreCase(titleName) 
                || "Trưởng khoa".equalsIgnoreCase(titleName) 
                || "Phó khoa".equalsIgnoreCase(titleName);
        }

        return false;
    }
}