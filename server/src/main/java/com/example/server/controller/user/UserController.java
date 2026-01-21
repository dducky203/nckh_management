package com.example.server.controller.user;

import com.example.server.DTO.SuccessResponseDTO;
import com.example.server.DTO.users.ChangePasswordRequest;
import com.example.server.DTO.users.ExportUserRequest;
import com.example.server.DTO.users.UserDTO;
import com.example.server.DTO.users.UserDetailsDTO;
import com.example.server.DTO.users.UserRequest;
import com.example.server.domain.User;
import com.example.server.exception.ErrorException;
import com.example.server.mapper.UserMapper;
import com.example.server.repository.*;
import com.example.server.service.BreadcrumbService;
import com.example.server.service.CloudinaryService;
import com.example.server.service.ExcelService;
import com.example.server.service.ResumeService;
import com.example.server.service.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/users")
public class UserController {
    @Autowired
    private UserService userService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ResumeService resumeService;
    @Autowired
    private ResumeRepository resumeRepository;
    @Autowired
    NcmRepository NcmRepository;
    @Autowired
    private NcmRepository ncmRepository;
    @Autowired
    TypeOfCriterionRepository typeOfCriterionRepository;
    @Autowired
    BreadcrumbService breadcrumbService;
    @Autowired
    CommonController commonController;
    @Autowired
    private GroupRepository groupRepository;
    @Autowired
    private UserMapper userMapper;
    @Autowired
    private ExcelService excelService;
    @Autowired
    private CloudinaryService cloudinaryService;

    @GetMapping("/profile")
    public ResponseEntity<?> profile(@RequestParam(name = "id") Integer userId) {
        User user = userRepository.findByIdUser(userId);

        if (user == null)
            throw new ErrorException("Người dùng không tồn tại !", HttpStatus.NOT_FOUND);
        else {
            UserDetailsDTO userDTO = userMapper.toUserDetailDTO(user);
            return ResponseEntity.ok(new SuccessResponseDTO<>(userDTO, "Lấy thông tin người dùng thành công."));
        }
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
            @RequestParam(value = "birthday", required = false) String birthday) {

        try {
            User user = userRepository.findByUsername(username);

            if (user == null)
                throw new ErrorException("Người dùng không tồn tại!", HttpStatus.NOT_FOUND);

            // Update basic info
            if (name != null && !name.isEmpty()) user.setName(name);
//            if (email != null && !email.isEmpty()) user.setEmail(email);
//            if (title != null && !title.isEmpty()) user.setTitle(title);
//            if (phone != null && !phone.isEmpty()) user.setPhone(phone);
//            if (address != null && !address.isEmpty()) user.setAddress(address);
//            if (birthday != null && !birthday.isEmpty()) user.setBirthday(birthday);

            // Upload avatar if provided
            if (avatarFile != null && !avatarFile.isEmpty()) {
                // Xóa ảnh cũ nếu có
                if (user.getAvatar() != null && !user.getAvatar().isEmpty()) {
                    try {
                        String oldPublicId = cloudinaryService.extractPublicIdFromUrl(user.getAvatar());
                        if (oldPublicId != null) {
                            cloudinaryService.deleteFile(oldPublicId);
                        }
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
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size) {
        return userService.searchUsers(keyword, page, size);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable("id") Integer id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ErrorException("Người dùng không tồn tại!", HttpStatus.NOT_FOUND));
        UserDetailsDTO userDTO = userMapper.toUserDetailDTO(user);
        return ResponseEntity.ok(new SuccessResponseDTO<>(userDTO, "Lấy thông tin người dùng thành công."));
    }

}
