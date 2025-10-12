package com.example.server.controller.user;

import com.example.server.DTO.SuccessResponseDTO;
import com.example.server.DTO.UserDTO;
import com.example.server.domain.BreadcrumbItem;
import com.example.server.domain.Resume;
import com.example.server.domain.User;
import com.example.server.exception.ErrorException;
import com.example.server.mapper.UserMapper;
import com.example.server.repository.*;
import com.example.server.service.BreadcrumbService;
import com.example.server.service.ResumeService;
import com.example.server.service.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/user")
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


    // Quản lý chung hồ sơ nhân sự
    @GetMapping("/manager")
    public String manager(Model model, HttpSession session) {
        // call menu
        commonController.allTypeOfCriteria(model, typeOfCriterionRepository);
        List<User> users = userRepository.findAll();

        List<User> powerUser1 = new ArrayList<>();
        List<User> powerUser2 = new ArrayList<>();
        List<User> powerUser3 = new ArrayList<>();
        for (User user : users) {
            if (user.getPower() == 1) powerUser1.add(user);
            if (user.getPower() == 2) powerUser2.add(user);
            if (user.getPower() == 3) powerUser3.add(user);

        }
        model.addAttribute("users1", powerUser1);
        model.addAttribute("users2", powerUser2);
        model.addAttribute("users3", powerUser3);

        model.addAttribute("groups", groupRepository.findAll());
        //      Lưu vào session

        model.addAttribute("breadcrumbs", breadcrumbService.getBreadcrumbForType(null, false, false, false, true)); // gửi ra view
        // end breadcrumb

        return "user/manager/managerResume";
    }

    @GetMapping("/profile")
    public ResponseEntity<?> profile(@RequestParam(name = "id") Integer userId) {
        User user = userRepository.findByIdUser(userId);

        if (user == null) throw new ErrorException("Người dùng không tồn tại !", HttpStatus.NOT_FOUND);
        else {
            UserDTO userDTO = userMapper.toDTO(user);
            return ResponseEntity.ok(new SuccessResponseDTO<>(userDTO, "Lấy thông tin người dùng thành công."));
        }
    }

    // save resume
    @PostMapping("/update-profile")
    public String saveResume(@RequestParam(name = "id") Integer userId, @RequestParam(name = "power") Integer power, Model model) {
//        model.addAttribute("user",userRepository.findByIdUser(userId));
//        model.addAttribute("resume",resumeRepository.findByIdUser(userId));
        User user = userRepository.findByIdUser(userId);
        user.setPower(power);
        userRepository.save(user);
        return "redirect:/user/manager";
    }

}
