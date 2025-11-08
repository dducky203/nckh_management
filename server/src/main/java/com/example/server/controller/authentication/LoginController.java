package com.example.server.controller.authentication;

import com.example.server.DTO.SuccessResponseDTO;
import com.example.server.DTO.login.LoginRequestDTO;
import com.example.server.DTO.login.LoginResponseDTO;
import com.example.server.DTO.users.UserDetailsDTO;
import com.example.server.domain.User;
import com.example.server.exception.LoginFailedException;
import com.example.server.mapper.UserMapper;
import com.example.server.repository.UserRepository;
import com.example.server.service.JwtService;
import com.example.server.service.LoginService;
import com.example.server.service.NcmService;
import com.example.server.service.SHA_256_password;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*") // Enable CORS for React frontend
public class LoginController {

    @Autowired
    private LoginService loginService;

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private NcmService ncmService;

    @Autowired
    private JwtService jwtService;
    @Autowired
    private com.example.server.repository.ResumeRepository resumeRepository;

    @Autowired
    private com.example.server.controller.admin.ManagerUserController managerUserController;

    @Autowired
    private com.example.server.service.UserService userService;

    @Autowired
    private UserRepository userRepository;

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

        // // Get current NCM for the user and include if exists
        // NcmDTO currentNcm = ncmService.getNcmByUserId(user.getId())
        // .stream()
        // .filter(ncm -> ncm.getYear() == LocalDate.now().getYear())
        // .findFirst()
        // .orElse(null);
        //
        // if (currentNcm != null) {
        // response.put("ncmData", currentNcm);
        // }

    }

    // @PostMapping("/forgot-password")
    // public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> body) {
    //     String email = body.get("email");
    //     String newPassword = body.get("email");
    //     Map<String, Object> response = new HashMap<>();

    //     try {
    //         User user = loginService.checkForgotPass(email);

    //         if (user != null) {
    //             // Generate new password
    //             // String newPassword = managerUserController.generateRandomPassword(8);
    //             // 1h het han
    //             String token = jwtService.generateToken(user.getUsername(), user.getIdRole().getName(), user.getId(),
    //                     3600000);
    //             // user.setPassword(SHA_256_password.GM_SHA_password(newPassword));
    //             // userService.save(user);
    //             // userService.changePassword(user.getUsername(),null, newPassword,true);

    //             // Send email with HTML template
    //             managerUserController.sendPasswordForgotEmail(
    //                     user.getUsername(),
    //                     user.getIdResume().getEmail(),
    //                     newPassword, token);

    //             response.put("success", true);
    //             response.put("message", "Mật khẩu mới đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư!");
    //             return ResponseEntity.ok(response);
    //         } else {
    //             response.put("success", false);
    //             response.put("message", "Email không tồn tại trong hệ thống");
    //             return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    //         }
    //     } catch (Exception e) {
    //         response.put("success", false);
    //         response.put("message", "Có lỗi xảy ra khi xử lý yêu cầu: " + e.getMessage());
    //         return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    //     }

    // }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        Map<String, Object> response = new HashMap<>();

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            // String token = authHeader.substring(7);

            // // Phương pháp 1: Thêm token vào blacklist/revoked token storage
            // jwtService.addToBlacklist(token);

            // Hoặc Phương pháp 2: Nếu dùng Spring Security + JWT, invalidate session
            SecurityContextHolder.clearContext();

            return ResponseEntity.ok(new SuccessResponseDTO("Đăng xuất thành công !"));
        } else {
            response.put("success", false);
            response.put("message", "Không tìm thấy token hợp lệ");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    // @PostMapping("/reset-password")
    // public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> body) {
    //     String token = body.get("token");
    //     String newPassword = body.get("newPassword");
    //     Map<String, Object> response = new HashMap<>();

    //     try {
    //         // 1. Validate input
    //         if (token == null || token.isEmpty()) {
    //             response.put("success", false);
    //             response.put("message", "Token không được cung cấp");
    //             return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    //         }

    //         if (newPassword == null || newPassword.length() < 6) {
    //             response.put("success", false);
    //             response.put("message", "Mật khẩu mới phải có ít nhất 6 ký tự");
    //             return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    //         }

    //         // 2. Validate và extract thông tin từ token
    //         String username = jwtService.extractUsername(token);

    //         if (username == null || jwtService.isTokenExpired(token)) {
    //             response.put("success", false);
    //             response.put("message", "Token không hợp lệ hoặc đã hết hạn");
    //             return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    //         }

    //         user.setPassword(SHA_256_password.GM_SHA_password(newPassword));
    //         userService.save(user);

    //         response.put("success", true);
    //         response.put("message", "Mật khẩu đã được đặt lại thành công!");
    //         return ResponseEntity.ok(response);

    //     } catch (Exception e) {
    //         response.put("success", false);
    //         response.put("message", "Có lỗi xảy ra khi đặt lại mật khẩu: " + e.getMessage());
    //         return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    //     }
    // }

    @PostMapping("/validate-token")
    public ResponseEntity<Map<String, Object>> validateToken(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        Map<String, Object> response = new HashMap<>();

        if (token == null || token.isEmpty()) {
            response.put("success", false);
            response.put("message", "Token không được cung cấp");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
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
            response.put("success", false);
            response.put("message", "Token không hợp lệ: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        response.put("success", false);
        response.put("message", "Token không hợp lệ hoặc hết hạn");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        Map<String, Object> response = new HashMap<>();

        try {
            // 1. Validate input
            if (email == null || email.trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "Email không được để trống");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }

            // 2. Validate email format
            if (!email.matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
                response.put("success", false);
                response.put("message", "Email không hợp lệ");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
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

                // 5. Gửi email với token (KHÔNG gửi password)
                managerUserController.sendPasswordForgotEmail(
                        user.getName(),
                        user.getIdResume().getEmail(),
                        null, // Không cần password ở đây
                        resetToken
                );

                response.put("success", true);
                response.put("message", "Link đặt lại mật khẩu đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư!");
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "Email không tồn tại trong hệ thống");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Có lỗi xảy ra khi xử lý yêu cầu: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> body) {
        String token = body.get("token");
        String newPassword = body.get("newPassword");
        Map<String, Object> response = new HashMap<>();

        try {
            // 1. Validate input
            if (token == null || token.trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "Token không được cung cấp");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }

            if (newPassword == null || newPassword.trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "Mật khẩu mới không được để trống");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }

            if (newPassword.length() < 6) {
                response.put("success", false);
                response.put("message", "Mật khẩu mới phải có ít nhất 6 ký tự");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }

            // 2. Validate và extract thông tin từ token
            String username;
            try {
                username = jwtService.extractUsername(token);
            } catch (Exception e) {
                response.put("success", false);
                response.put("message", "Token không hợp lệ");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }

            if (username == null || username.trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "Token không chứa thông tin người dùng hợp lệ");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }

            // 3. Kiểm tra token hết hạn
            if (jwtService.isTokenExpired(token)) {
                response.put("success", false);
                response.put("message", "Token đã hết hạn. Vui lòng yêu cầu đặt lại mật khẩu mới");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }

            // 4. Tìm user trong database
            User user = userRepository.findByUsername(username);
            if (user == null) {
                response.put("success", false);
                response.put("message", "Người dùng không tồn tại");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

            // 5. Kiểm tra user có bị vô hiệu hóa không
            if (user.getInActive()) {
                response.put("success", false);
                response.put("message", "Tài khoản đã bị vô hiệu hóa");
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
            }

            // 6. Hash và lưu mật khẩu mới
            user.setPassword(SHA_256_password.GM_SHA_password(newPassword));
            userRepository.save(user);


            response.put("success", true);
            response.put("message", "Mật khẩu đã được đặt lại thành công! Bạn có thể đăng nhập với mật khẩu mới.");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Có lỗi xảy ra khi đặt lại mật khẩu: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}