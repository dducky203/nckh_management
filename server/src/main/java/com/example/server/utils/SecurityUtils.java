package com.example.server.utils;

import com.example.server.helpers.CustomUserDetails;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

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
}