package com.example.server.controller.admin;

import com.example.server.DTO.users.UserDetailsDTO;
import com.example.server.controller.user.CommonController;
import com.example.server.controller.user.EmailController;
import com.example.server.domain.*;
import com.example.server.mapper.UserMapper;
import com.example.server.repository.*;
import com.example.server.DTO.users.UserDTO;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.security.SecureRandom;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Controller
@RequestMapping("/dashboard/manage-users")
public class ManagerUserController {
    @Autowired
    TitleRepository titleRepository;
    @Autowired
    UserRepository userRepository;
    @Autowired
    ResumeRepository resumeRepository;
    @Autowired
    RoleRepository roleRepository;
    @Autowired
    EmailController emailController;
    @Autowired
    TypeOfCriterionRepository typeOfCriterionRepository;
    @Autowired
    CommonController commonController;
    @Autowired
    GroupRepository groupRepository;
    @Autowired
    private UserMapper userMapper;

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
                        // Hoạt động: inActive = false AND isDeleted = false
                        inActive = true;
                        isDeleted = true;
                        break;
                    case "inactive":
                        // Không hoạt động: inActive = true AND isDeleted = false
                        inActive = false;
                        isDeleted = true;
                        break;
                    case "deleted":
                        // Đã xóa: isDeleted = true (không quan tâm inActive)
                        isDeleted = false;
                        break;
                }
            }

            // Gọi repository method phù hợp
            if (search != null && !search.trim().isEmpty()) {
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



    @PostMapping("/createUser")
    public String createUser(Model model, @RequestParam String name,
            @RequestParam String username,
            @RequestParam(required = false) Integer power,
            @RequestParam(required = false) Integer id_title,

            @RequestParam(required = false) String email,
            @RequestParam(required = false) String phone,
            @RequestParam(required = false) String address,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate birthday) {
        // Tạo mật khẩu random
        String rawPassword = generateRandomPassword(8);
        List<User> users = userRepository.findAll();
        for (User user : users) {
            if (user.getUsername().equals(username)) {
                model.addAttribute("message", "Tài khoản đang bị trùng tài khoản đăng nhập");
                return "/admin/user/createUser";
            }
        }
        // Tạo user
        User user = new User();
        user.setName(name);
        user.setUsername(username);
        user.setPassword(rawPassword);
        user.setIdRole(roleRepository.findById(2).get());
        user.setPower(power);
        if (power == 4) {
            user.setIdTitle(null);
        } else
            user.setIdTitle(titleRepository.findById(id_title).get());

        // user.setCreateDate(LocalDate.now());
        // user.setUpdateDate(null);
        userRepository.save(user);

        // Tạo resume
        Resume resume = new Resume();
        resume.setIdUser(user);
        resume.setCode(user.getUsername());
        resume.setEmail(email);
        resume.setPhone(phone);
        resume.setAddress(address);
        resume.setBirthday(birthday);

        resumeRepository.save(resume);
        // Gửi email chứa mật khẩu
        sendPasswordEmail(user.getUsername(), email, rawPassword);

        return "redirect:/ad";
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

    public void sendPasswordForgotEmail(String code, String toEmail, String rawPassword) {
        // send email to user
        String subject = "Thông tin tài khoản của bạn";
        String bodyGuest = "Tài khoản của bạn đã được cập nhật." +
                "\nTài Khoản đăng nhập:" + code +
                " \nMật khẩu đăng nhập: " + rawPassword;
        emailController.sendEmail(toEmail, subject, bodyGuest);
    }

    // manager user
    @GetMapping("/manager")
    public String manager(Model model, HttpSession session) {
        List<Group> groups = groupRepository.findAll();
        List<User> users = userRepository.findAll();

        List<User> powerUser1 = new ArrayList<>();
        List<User> powerUser2 = new ArrayList<>();
        List<User> powerUser3 = new ArrayList<>();
        List<User> powerUser4 = new ArrayList<>();
        for (User user : users) {
            if (user.getPower() != null) {
                if (user.getPower() == 1)
                    powerUser1.add(user);
                if (user.getPower() == 2)
                    powerUser2.add(user);
                if (user.getPower() == 3)
                    powerUser3.add(user);
                if (user.getPower() == 4)
                    powerUser4.add(user);
            }
        }
        model.addAttribute("users1", powerUser1);
        model.addAttribute("users2", powerUser2);
        model.addAttribute("users3", powerUser3);
        model.addAttribute("users4", powerUser4);
        model.addAttribute("groups", groups);

        return "admin/user/managerUser";
    }

    @GetMapping("/mResume/{idUser}")
    public ResponseEntity<?> managerResume(@PathVariable Integer idUser, Model model) {

        // model.addAttribute("user",userRepository.findByIdUser(idUser));
        // model.addAttribute("resume",resumeRepository.findByIdUser(idUser));
        // return "admin/user/repairResume";
        User user = userRepository.findByIdUser(idUser);
        return new ResponseEntity<User>(user, HttpStatus.OK);
    }

    // save resume
    @PostMapping("/mSaveResume/{idUser}")
    public String saveResume(@PathVariable Integer idUser,
            @RequestParam(name = "power") Integer power,
            @RequestParam(name = "name") String name,
            @RequestParam(name = "email") String email,
            @RequestParam(name = "phone") String phone,
            @RequestParam(name = "address") String address,
            @RequestParam(name = "birthday") LocalDate birthday,
            Model model) {
        model.addAttribute("user", userRepository.findByIdUser(idUser));
        model.addAttribute("resume", resumeRepository.findByIdUser(idUser));
        User user = userRepository.findByIdUser(idUser);
        user.setPower(power);
        user.setName(name);
        userRepository.save(user);

        Resume resume = resumeRepository.findByIdUser(idUser);
        resume.setBirthday(birthday);
        resume.setAddress(address);
        resume.setEmail(email);
        resume.setPhone(phone);
        resumeRepository.save(resume);
        return "redirect:/ad/managerUser/manager";
    }

}
