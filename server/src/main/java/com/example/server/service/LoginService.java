package com.example.server.service;

import com.example.server.domain.Admin;
import com.example.server.domain.Resume;
import com.example.server.domain.User;
import com.example.server.repository.AdminRepository;
import com.example.server.repository.ResumeRepository;
import com.example.server.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@Service
public class LoginService {
    @Autowired
    UserRepository userRepository;
    @Autowired
    AdminRepository adminRepository;
    @Autowired
    ResumeRepository resumeRepository;

    // get user by username and password
    public User checkLoginUser(String username, String inputPassword) {
        // Tìm user theo username
        User user = userRepository.findByUsername(username);

        if (user == null) return null;

        String hashedInput = SHA_256_password.SHA_password(inputPassword);

        // TH1: mật khẩu trong DB đã mã hóa → so sánh bản SHA
        if (user.getPassword().equals(hashedInput)) {
            return user;
        }

        // TH2: mật khẩu trong DB là raw (chưa mã hóa) → so sánh trực tiếp
        if (user.getPassword().equals(inputPassword)) {
            // Nếu đúng → mã hóa và lưu lại
            user.setPassword(hashedInput);
            userRepository.save(user);
            return user;
        }

        // Không đúng cả 2 → sai mật khẩu
        return null;
    }


    // get user by username and password
    public Admin checkLoginAdmin(String username, String inputPassword) {
        Admin admin = adminRepository.findByUsername(username);
        if (admin == null) return null;

        String hashedInput = SHA_256_password.SHA_password(inputPassword);

        if (admin.getPassword().equals(hashedInput)) {
            return admin;
        }

        if (admin.getPassword().equals(inputPassword)) {
            admin.setPassword(hashedInput);
            adminRepository.save(admin);
            return admin;
        }

        return null;
    }

    // check username (while forgotPass)
    public User checkForgotPass(String username) {
        List<User> users = userRepository.findAll();
        for (User user : users) {
            if (user.getUsername().equals(username)) {
                return user;
            }
        }
        return null;
    }
}
