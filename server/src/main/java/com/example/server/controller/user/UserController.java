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

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

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

    // save resume
    @PostMapping("/update-profile")
    public ResponseEntity<?> updateUser(@RequestBody UserRequest request) {

        User user = userRepository.findByUsername(request.getUsername());

        // userRepository.save(user);
        if (user == null)
            throw new ErrorException("Người dùng không tồn tại !", HttpStatus.NOT_FOUND);
        else {
            UserDetailsDTO userDTO = userMapper.toUserDetailDTO(user);
            return ResponseEntity.ok(new SuccessResponseDTO<>(userDTO, "Lấy thông tin người dùng thành công."));
        }
    }

    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(
            @RequestParam(value = "username") String username,
            @RequestBody ChangePasswordRequest request) {
        userService.changePassword(username, request.getCurrentPassword(), request.getNewPassword(), false);
        return ResponseEntity.ok(new SuccessResponseDTO<>(null, "Đổi mật khẩu thành công!"));
    }

}
