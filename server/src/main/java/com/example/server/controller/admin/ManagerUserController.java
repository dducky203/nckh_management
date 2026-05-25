package com.example.server.controller.admin;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.*;
import org.springframework.http.*;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import com.example.server.DTO.SuccessResponseDTO;
import com.example.server.DTO.users.UserDetailsDTO;
import com.example.server.DTO.users.UserRequest;
import com.example.server.controller.user.EmailController;
import com.example.server.domain.User;
import com.example.server.domain.Role;
import com.example.server.mapper.UserMapper;
import com.example.server.repository.*;
import com.example.server.service.*;

import jakarta.validation.Valid;

@Controller
@RequestMapping("/dashboard/manage-users")
public class ManagerUserController {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final EmailController emailController;
    private final UserMapper userMapper;
    private final UserService userService;
    private final EmailService emailService;
    private final ExcelService excelService;

    public ManagerUserController(UserRepository userRepository, RoleRepository roleRepository, EmailController emailController, TypeOfCriterionRepository typeOfCriterionRepository, GroupRepository groupRepository, UserMapper userMapper, UserService userService, EmailService emailService, ExcelService excelService) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.emailController = emailController;
        this.userMapper = userMapper;
        this.userService = userService;
        this.emailService = emailService;
        this.excelService = excelService;
    }

    @GetMapping("/roles")
    @ResponseBody
    public ResponseEntity<?> getRoles() {
        List<Role> roles = roleRepository.findAll(Sort.by(Sort.Direction.ASC, "id"));
        return ResponseEntity.ok(new SuccessResponseDTO<>(roles, "Danh sách role"));
    }

    @GetMapping("/get-all-user")
    @ResponseBody
    public ResponseEntity<?> getAllUser(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDirection,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Integer power,
            @RequestParam(required = false) String status) {

        try {
            // Tạo Sort object
            Sort sort = sortDirection.equalsIgnoreCase("desc")
                    ? Sort.by(sortBy).descending()
                    : Sort.by(sortBy).ascending();

            // Tạo Pageable object
            Pageable pageable = PageRequest.of(page, size, sort);

            // Lấy dữ liệu phân trang với filter và search
            Page<User> userPage;

            // Xác định status filter
            Boolean inActive = null;
            Boolean isDeleted = null;
            if (status != null) {
                switch (status) {
                    case "active":
                        inActive = false;
                        isDeleted = false;
                        break;
                    case "inactive":
                        inActive = true;
                        isDeleted = false;
                        break;
                    case "deleted":
                        isDeleted = true;
                        break;
                }
            }

            // Gọi repository method phù hợp
            if (search != null && !search.isBlank()) {
                userPage = userRepository.findWithFilters(search.trim(), power, inActive, isDeleted, pageable);
            } else {
                userPage = userRepository.findWithFilters(null, power, inActive, isDeleted, pageable);
            }

            // Convert User entities sang UserDTO
            List<UserDetailsDTO> users = userPage.getContent().stream()
                    .map(userMapper::toUserDetailDTO)
                    .collect(Collectors.toList());

            // Tạo response
            Map<String, Object> response = new HashMap<>();
            response.put("users", users);
            response.put("currentPage", userPage.getNumber());
            response.put("totalItems", userPage.getTotalElements());
            response.put("totalPages", userPage.getTotalPages());
            response.put("pageSize", userPage.getSize());
            response.put("hasNext", userPage.hasNext());
            response.put("hasPrevious", userPage.hasPrevious());

            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Lỗi khi lấy danh sách user: " + e.getMessage());
            return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/create")
    public ResponseEntity<?> createUser(@Valid @RequestBody UserRequest request) {
        userService.createUser(request);
        return ResponseEntity.ok(new SuccessResponseDTO<>(null, "Tạo mới user thành công!"));
    }

    @PostMapping("/update")
    public ResponseEntity<?> updateUser(@Valid @RequestBody UserRequest request) {
        userService.updateUser(request);
        return ResponseEntity.ok(new SuccessResponseDTO<>(null, "Cập nhật user thành công!"));
    }

    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteUser(
            @RequestParam(value = "username") String username,
            @RequestParam(value = "force", defaultValue = "false") Boolean force) {
        userService.deleteUser(username, force);
        return ResponseEntity.ok(new SuccessResponseDTO<>(null, "Xóa user thành công!"));
    }

    @PatchMapping("reset-password")
    public ResponseEntity<?> resetPassword(@RequestParam(value = "username") String username) {
        try {
            userService.resetPassword(username);
            return ResponseEntity.ok(new SuccessResponseDTO<>(null, "Reset password thành công!"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
    }

    // random pass
    public String generateRandomPassword(int length) {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        SecureRandom random = new SecureRandom();
        StringBuilder sb = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            sb.append(chars.charAt(random.nextInt(chars.length())));
        }
        return sb.toString();
    }

    public void sendPasswordEmail(String code, String toEmail, String rawPassword) {
        // send email to user
        String subject = "Thông tin tài khoản của bạn";
        String bodyGuest = "Tài khoản của bạn đã được tạo." +
                "\nTài Khoản đăng nhập:" + code +
                " \nMật khẩu đăng nhập: " + rawPassword;
        emailController.sendEmail(toEmail, subject, bodyGuest);
    }

    public void sendPasswordForgotEmail(String name, String toEmail, String token) {
        try {
            // Sử dụng template HTML thay vì plain text
            emailService.sendForgotPasswordEmail(toEmail, name, token);
        } catch (Exception e) {
            throw new RuntimeException("Không thể gửi email đặt lại mật khẩu: " + e.getMessage());
        }
    }
    @PostMapping("/export-excel")
    public ResponseEntity<Resource> exportUsersToExcel(@RequestBody List<Integer> userIds) {
        try {
            if (userIds == null || userIds.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(null);
            }

            // Xuất file
            byte[] excelData = excelService.exportExcelFile(userIds);
            ByteArrayResource resource = new ByteArrayResource(excelData);

            String timestamp = LocalDateTime.now()
                    .format(DateTimeFormatter.ofPattern("dd-MM-yyyy"));
            String fileName = "DanhSachNguoiDung_" + timestamp + ".xlsx";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentDispositionFormData("attachment", fileName);
            headers.setContentType(
                    MediaType.parseMediaType(
                            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));

            return ResponseEntity.ok()
                    .headers(headers)
                    .contentLength(excelData.length)
                    .body(resource);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

}
