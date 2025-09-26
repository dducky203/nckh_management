package com.example.server.controller.api;

import com.example.server.DTO.NcmDTO;
import com.example.server.domain.Admin;
import com.example.server.domain.User;
import com.example.server.service.JwtService;
import com.example.server.service.LoginService;
import com.example.server.service.NcmService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/login")
@CrossOrigin(origins = "*") // Enable CORS for React frontend
public class LoginRestController {
    
    @Autowired
    private LoginService loginService;
    
    @Autowired
    private NcmService ncmService;
    
    @Autowired
    private JwtService jwtService;
    
    @PostMapping
    public ResponseEntity<Map<String, Object>> login(
            @RequestBody Map<String, String> credentials) {
        
        String username = credentials.get("username");
        String password = credentials.get("password");
        Map<String, Object> response = new HashMap<>();
        
        // Check user login
        User user = loginService.checkLoginUser(username, password);
        if (user == null) {
            // Check admin login
            Admin admin = loginService.checkLoginAdmin(username, password);
            if (admin == null) {
                response.put("success", false);
                response.put("message", "Sai tài khoản hoặc mật khẩu");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            } else {
                // Generate JWT token for admin
                String token = jwtService.generateToken(admin.getUsername(), "admin", admin.getId());
                
                // Return admin data with token
                response.put("success", true);
                response.put("userType", "admin");
                response.put("token", token);
                response.put("userData", Map.of(
                    "id", admin.getId(),
                    "username", admin.getUsername(),
                    "name", admin.getName()
                ));
                return ResponseEntity.ok(response);
            }
        }
        
        // Generate JWT token for user
        String token = jwtService.generateToken(user.getUsername(), "user", user.getId());
        
        // Return user data with token
        response.put("success", true);
        response.put("userType", "user");
        response.put("token", token);
        response.put("userData", Map.of(
            "id", user.getId(),
            "username", user.getUsername(),
            "name", user.getName(),
            "power", user.getPower()
        ));
        
        // Get current NCM for the user and include if exists
        NcmDTO currentNcm = ncmService.getNcmByUserId(user.getId())
                .stream()
                .filter(ncm -> ncm.getYear() == LocalDate.now().getYear())
                .findFirst()
                .orElse(null);
        
        if (currentNcm != null) {
            response.put("ncmData", currentNcm);
        }
        
        return ResponseEntity.ok(response);
    }
    
    @Autowired
    private com.example.server.repository.ResumeRepository resumeRepository;
    
    @Autowired
    private com.example.server.controller.admin.ManagerUserController managerUserController;
    
    @Autowired
    private com.example.server.service.UserService userService;
    
    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, Object>> forgotPassword(
            @RequestBody Map<String, String> request) {
        String username = request.get("username");
        Map<String, Object> response = new HashMap<>();
        
        User user = loginService.checkForgotPass(username);
        if (user != null) {
            com.example.server.domain.Resume resume = resumeRepository.findByIdUser(user.getId());
            String pass = managerUserController.generateRandomPassword(8);
            managerUserController.sendPasswordForgotEmail(user.getUsername(), resume.getEmail(), pass);
            user.setPassword(pass);
            userService.save(user);
            
            response.put("success", true);
            response.put("message", "Mật khẩu đã được gửi lại qua gmail của bạn, vui lòng kiểm tra để đăng nhập");
        } else {
            response.put("success", false);
            response.put("message", "Không tồn tại mã này");
        }
        
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/logout")
    public ResponseEntity<Map<String, Object>> logout() {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Đã đăng xuất thành công");
        
        return ResponseEntity.ok(response);
    }
    
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
}