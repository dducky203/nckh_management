package com.example.server.helpers;

import com.example.server.service.JwtService;
import com.example.server.service.UserService;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.server.ResponseStatusException;


import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserService userService;


    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    @Override
    public void doFilterInternal(
            @NotNull HttpServletRequest request,
            @NotNull HttpServletResponse response,
            @NotNull FilterChain filterChain) throws ServletException, IOException {

        try {
            // Bỏ qua kiểm tra cho các endpoint công khai
            String path = request.getServletPath();
            if (path.startsWith("/auth/") || path.contains("/public/") ) {
                filterChain.doFilter(request, response);
                return;
            }

            final String authHeader = request.getHeader("Authorization");
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                filterChain.doFilter(request, response);
                return;
            }

            final String jwt = authHeader.substring(7);
            try {
                final String username = jwtService.extractUsername(jwt);
                
                if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    // Tải thông tin người dùng từ database
                    UserDetails userDetails = userService.loadUserByUsername(username);

                    // Nếu token hợp lệ, thực hiện xác thực
                    if (jwtService.isTokenValid(jwt, userDetails.getUsername())) {
                        // Tạo đối tượng xác thực
                        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null, // credentials thường là null vì đã xác thực bằng token
                                userDetails.getAuthorities()
                        );
                        authToken.setDetails(
                                new WebAuthenticationDetailsSource().buildDetails(request)
                        );

                        // Đặt đối tượng xác thực vào SecurityContext
                        SecurityContextHolder.getContext().setAuthentication(authToken);
                        logger.info("Xác thực thành công tài khoản: {}", userDetails.getUsername());
                    }
                }
            } catch (ExpiredJwtException ex) {
                logger.warn("Token hết hạn: {}", ex.getMessage());
                // Không ghi vào response ở đây - để Spring Security xử lý
            }
            
            // Chuyển tiếp request cho filter tiếp theo
            filterChain.doFilter(request, response);
        } catch (Exception e) {
            logger.error("Lỗi trong JWT filter: {}", e.getMessage());
            filterChain.doFilter(request, response);
        }
    }
}


