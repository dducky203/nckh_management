package com.example.server.controller.user;

import java.time.LocalDate;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.example.server.DTO.response.SuccessResponseDTO;
import com.example.server.DTO.users.ChangePasswordRequest;
import com.example.server.DTO.users.UserDetailsDTO;
import com.example.server.domain.User;
import com.example.server.exception.ErrorException;
import com.example.server.mapper.UserMapper;
import com.example.server.repository.ResumeRepository;
import com.example.server.repository.UserRepository;
import com.example.server.service.AddressService;
import com.example.server.service.CloudinaryService;
import com.example.server.service.UserService;
import com.example.server.utils.SecurityUtils;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/users")
public class UserController {
    private final UserService userService;
    private final UserRepository userRepository;

    private final UserMapper userMapper;
    private final CloudinaryService cloudinaryService;
    private final AddressService addressService;

    public UserController(UserService userService, UserRepository userRepository, UserMapper userMapper,
                          CloudinaryService cloudinaryService, AddressService addressService) {
        this.userService = userService;
        this.userRepository = userRepository;
        this.userMapper = userMapper;
        this.cloudinaryService = cloudinaryService;
        this.addressService = addressService;
    }

    @GetMapping("/profile")
    public ResponseEntity<?> profile(@RequestParam(name = "id") Integer userId) {
        SecurityUtils.requireCurrentUser();
        User user = userRepository.findByIdUser(userId);

        if (user == null)
            throw new ErrorException("Người dùng không tồn tại !", HttpStatus.NOT_FOUND);
        else {
            UserDetailsDTO userDTO = userMapper.toUserDetailDTO(user);
            return ResponseEntity.ok(new SuccessResponseDTO<>(userDTO, "Lấy thông tin người dùng thành công."));
        }
    }

    /**
     * Quyền nghiệp vụ của user đang đăng nhập (đồng bộ FE ProtectedRoute / menu).
     */
    @GetMapping("/me/permissions")
    public ResponseEntity<?> myPermissions() {
        User user = SecurityUtils.requireCurrentUser();
        Map<String, Object> perms = new HashMap<>();
        perms.put("userId", user.getId());
        perms.put("role", user.getIdRole() != null ? user.getIdRole().getName() : null);
        perms.put("title", user.getIdTitle() != null ? user.getIdTitle().getName() : null);
        perms.put("power", user.getPower());
        perms.put("isAdmin", SecurityUtils.isAdmin(user));
        perms.put("isAssistant", SecurityUtils.isAssistant(user));
        perms.put("isStudent", SecurityUtils.isStudent(user));
        perms.put("hasNckhStaffAccess", SecurityUtils.hasNckhStaffAccess(user));
        perms.put("isStrictAdmin", SecurityUtils.isStrictAdminPortalUser(user));
        perms.put("canAccessQuota", !SecurityUtils.isStudent(user) || SecurityUtils.hasNckhStaffAccess(user));
        return ResponseEntity.ok(new SuccessResponseDTO<>(perms, "Quyền người dùng hiện tại"));
    }

    // Update profile with avatar
    @PostMapping("/update-profile")
    public ResponseEntity<?> updateUser(
            @RequestParam(value = "file", required = false) MultipartFile avatarFile,
            @RequestParam("username") String username,
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "email", required = false) String email,
            @RequestParam(value = "title", required = false) String title,
            @RequestParam(value = "phone", required = false) String phone,
            @RequestParam(value = "address", required = false) String address,
            @RequestParam(value = "provinceCode", required = false) String provinceCode,
            @RequestParam(value = "wardCode", required = false) String wardCode,
            @RequestParam(value = "addressDetail", required = false) String addressDetail,
            @RequestParam(value = "birthday", required = false) LocalDate birthday) {

        try {
            User user = userRepository.findByUsername(username);

            if (user == null )
                throw new ErrorException("Người dùng không tồn tại!", HttpStatus.NOT_FOUND);

            // Update basic info
            if (name != null && !name.isEmpty()) user.setName(name);
            if (email != null && !email.isEmpty()) user.getIdResume().setEmail(email);
            if (title != null && !title.isEmpty()) user.getIdTitle().setName(title);
            if (phone != null && !phone.isEmpty()) user.getIdResume().setPhone(phone);
            if (birthday != null ) user.getIdResume().setBirthday(birthday);
            addressService.applyAddressToResume(
                    user.getIdResume(),
                    provinceCode,
                    wardCode,
                    addressDetail,
                    address);

            // Upload avatar if provided
            if (avatarFile != null && !avatarFile.isEmpty()) {
                // Xóa ảnh cũ nếu có
                if (StringUtils.isNotBlank(user.getAvatar())) {
                    try {
                        cloudinaryService.deleteFileByUrl(user.getAvatar());
                    } catch (Exception e) {
                        System.err.println("Không thể xóa ảnh cũ: " + e.getMessage());
                    }
                }

                // Upload ảnh mới
                String avatarUrl = cloudinaryService.uploadFile(avatarFile, "avatars");
                user.setAvatar(avatarUrl);
            }

            userRepository.save(user);
            UserDetailsDTO userDTO = userMapper.toUserDetailDTO(user);
            return ResponseEntity.ok(new SuccessResponseDTO<>(userDTO, "Cập nhật thông tin thành công."));
        } catch (Exception e) {
            throw new ErrorException("Lỗi cập nhật thông tin: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(
            @RequestParam(value = "username") String username,
            @RequestBody ChangePasswordRequest request) {
        userService.changePassword(username, request.getCurrentPassword(), request.getNewPassword(), false);
        return ResponseEntity.ok(new SuccessResponseDTO<>(null, "Đổi mật khẩu thành công!"));
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchUsers(
            @RequestParam(value = "keyword") String keyword,
            @RequestParam(value = "type", defaultValue = "ALL") String type,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size) {
        return userService.searchUsers(keyword,type, page, size);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable("id") Integer id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ErrorException("Người dùng không tồn tại!", HttpStatus.NOT_FOUND));
        UserDetailsDTO userDTO = userMapper.toUserDetailDTO(user);
        return ResponseEntity.ok(new SuccessResponseDTO<>(userDTO, "Lấy thông tin người dùng thành công."));
    }

}
