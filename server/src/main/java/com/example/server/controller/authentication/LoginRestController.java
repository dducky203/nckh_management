package com.example.server.controller.authentication;

import com.example.server.DTO.users.UserDTO;
import com.example.server.DTO.login.LoginRequestDTO;
import com.example.server.DTO.login.LoginResponseDTO;
import com.example.server.DTO.users.UserDetailsDTO;
import com.example.server.domain.Resume;
import com.example.server.domain.User;
import com.example.server.exception.LoginFailedException;
import com.example.server.mapper.UserMapper;
import com.example.server.service.JwtService;
import com.example.server.service.LoginService;
import com.example.server.service.NcmService;
import com.example.server.utils.DateTimeConstant;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*") // Enable CORS for React frontend
public class LoginRestController {
    
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


    @PostMapping(value = "/login")
    public ResponseEntity<?> login(
           @Valid @RequestBody LoginRequestDTO credentials) {

        
        String username = credentials.getUsername();
        String password = credentials.getPassword();

        User user = loginService.checkLoginUser(username ,password);

        if(user == null){
            throw new LoginFailedException("Tài khoản hoặc mật khẩu không chính xác!");
        }else{
            // Generate JWT token for user
            String token = jwtService.generateToken(user.getUsername(), user.getIdRole().getName(), user.getId());
            UserDetailsDTO userInfo = userMapper.toUserDetailDTO(user);
            return ResponseEntity.ok(new LoginResponseDTO(true, "Đăng nhập thành công",token ,userInfo));
        }


//        // Get current NCM for the user and include if exists
//        NcmDTO currentNcm = ncmService.getNcmByUserId(user.getId())
//                .stream()
//                .filter(ncm -> ncm.getYear() == LocalDate.now().getYear())
//                .findFirst()
//                .orElse(null);
//
//        if (currentNcm != null) {
//            response.put("ncmData", currentNcm);
//        }
        

    }
    

    
    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, Object>> forgotPassword(
            @RequestBody Map<String, String> request) {
        String username = request.get("username");
        Map<String, Object> response = new HashMap<>();
        
        User user = loginService.checkForgotPass(username);
        if (user != null) {
            Resume resume = resumeRepository.findByIdUser(user.getId());
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
    public ResponseEntity<Map<String, Object>> logout(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        Map<String, Object> response = new HashMap<>();

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);

//            // Phương pháp 1: Thêm token vào blacklist/revoked token storage
//            jwtService.addToBlacklist(token);

            // Hoặc Phương pháp 2: Nếu dùng Spring Security + JWT, invalidate session
            SecurityContextHolder.clearContext();

            response.put("success", true);
            response.put("message", "Đã đăng xuất thành công");
        } else {
            response.put("success", false);
            response.put("message", "Không tìm thấy token hợp lệ");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

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