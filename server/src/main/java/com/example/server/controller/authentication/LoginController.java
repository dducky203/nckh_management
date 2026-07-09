package com.example.server.controller.authentication;

import java.util.HashMap;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.example.server.DTO.login.LoginRequestDTO;
import com.example.server.DTO.login.LoginResponseDTO;
import com.example.server.DTO.response.ErrorResponseDTO;
import com.example.server.DTO.response.SuccessResponseDTO;
import com.example.server.DTO.users.UserDetailsDTO;
import com.example.server.controller.admin.ManagerUserController;
import com.example.server.domain.User;
import com.example.server.exception.LoginFailedException;
import com.example.server.mapper.UserMapper;
import com.example.server.repository.UserRepository;
import com.example.server.service.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*") // Enable CORS for React frontend
public class LoginController {

    private final LoginService loginService;

    private final UserMapper userMapper;

    private final JwtService jwtService;

    private final ManagerUserController managerUserController;

    private final UserRepository userRepository;

    private final PasswordService passwordService;

    public LoginController(
            LoginService loginService,
            UserMapper userMapper,
            JwtService jwtService,
            ManagerUserController managerUserController,
            UserRepository userRepository,
            PasswordService passwordService) {
        this.loginService = loginService;
        this.userMapper = userMapper;
        this.jwtService = jwtService;
        this.managerUserController = managerUserController;
        this.userRepository = userRepository;
        this.passwordService = passwordService;
    }

    @PostMapping(value = "/login")
    public ResponseEntity<?> login(
            @Valid @RequestBody LoginRequestDTO credentials) {

        String username = credentials.getUsername();
        String password = credentials.getPassword();

        User user = loginService.checkLoginUser(username, password);

        if (user == null) {
            throw new LoginFailedException("Tài khoản hoặc mật khẩu không chính xác!");
        } else {
            // Generate JWT token for user
            String token = jwtService.generateToken(user.getUsername(), user.getIdRole().getName(), user.getId(), 0);
            UserDetailsDTO userInfo = userMapper.toUserDetailDTO(user);
            return ResponseEntity.ok(new LoginResponseDTO(true, "Đăng nhập thành công", token, userInfo));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            SecurityContextHolder.clearContext();
            return ResponseEntity.ok(new SuccessResponseDTO<>("Đăng xuất thành công !"));
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorResponseDTO("Không tìm thấy token hợp lệ"));
        }
    }

    @PostMapping("/validate-token")
    public ResponseEntity<?> validateToken(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        Map<String, Object> response = new HashMap<>();

        if (token == null || token.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorResponseDTO("Token không được cung cấp"));
        }

        try {
            String username = jwtService.extractUsername(token);
            String userType = jwtService.extractClaim(token, claims -> claims.get("userType", String.class));
            Integer userId = jwtService.extractClaim(token, claims -> claims.get("userId", Integer.class));

            if (username != null && !jwtService.isTokenExpired(token)) {
                response.put("success", true);
                response.put("userType", userType);
                response.put("userId", userId);
                response.put("username", username);
                return ResponseEntity.ok(response);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body((new ErrorResponseDTO("Token không hợp lệ: " + e.getMessage())));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body((new ErrorResponseDTO("Token không hợp lệ hoặc hết hạn")));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        try {
            // 1. Validate input
            if (email == null || email.isBlank()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body((new ErrorResponseDTO("Email không được để trống")));
            }

            // 2. Validate email format
            if (!email.matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body((new ErrorResponseDTO("Email không hợp lệ")));
            }

            // 3. Tìm user theo email
            User user = loginService.checkForgotPass(email);

            if (user != null) {
                // 4. Generate token reset password với thời hạn 1 giờ (3600000ms)
                String resetToken = jwtService.generateToken(
                        user.getUsername(),
                        user.getIdRole().getName(),
                        user.getId(),
                        3600000 // 1 hour expiration
                );

                // 5. Gửi email với token
                managerUserController.sendPasswordForgotEmail(
                        user.getName(),
                        user.getIdResume().getEmail(),
                        resetToken);

                return ResponseEntity.ok(new SuccessResponseDTO<>("Link đặt lại mật khẩu đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư!"));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body((new ErrorResponseDTO("Email không tồn tại trong hệ thống")));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ErrorResponseDTO("Có lỗi xảy ra khi xử lý yêu cầu: " + e.getMessage()));
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> body) {
        String token = body.get("token");
        String newPassword = body.get("newPassword");


        try {
            // 1. Validate input
            if (StringUtils.isBlank(token)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body((new ErrorResponseDTO("Token không được cung cấp")));
            }

            if (StringUtils.isBlank(newPassword)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body((new ErrorResponseDTO("Mật khẩu mới không được để trống")));
            }

            if (newPassword.length() < 6) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorResponseDTO("Mật khẩu mới phải có ít nhất 6 ký tự"));
            }

            // 2. Validate và extract thông tin từ token
            String username;
            try {
                username = jwtService.extractUsername(token);
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorResponseDTO("Token không hợp lệ"));
            }

            if (username == null || username.isBlank()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorResponseDTO("Token không chứa thông tin người dùng hợp lệ"));
            }

            // 3. Kiểm tra token hết hạn
            if (jwtService.isTokenExpired(token)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorResponseDTO("Token đã hết hạn. Vui lòng yêu cầu đặt lại mật khẩu mới"));
            }

            // 4. Tìm user trong database
            User user = userRepository.findByUsername(username);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorResponseDTO("Người dùng không tồn tại"));
            }

            // 5. Kiểm tra user có bị vô hiệu hóa không
            if (user.getInActive() && user.getIsDeleted()) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new ErrorResponseDTO("Tài khoản đã bị vô hiệu hóa"));
            }

            // 6. Hash và lưu mật khẩu mới
            user.setPassword(passwordService.encode(newPassword));
            userRepository.save(user);
            return ResponseEntity.ok(new SuccessResponseDTO<>("Mật khẩu đã được đặt lại thành công! Bạn có thể đăng nhập với mật khẩu mới."));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ErrorResponseDTO("Có lỗi xảy ra khi đặt lại mật khẩu: " + e.getMessage()));
        }
    }
}