package com.example.server.service;

import com.example.server.domain.Admin;
import com.example.server.domain.Resume;
import com.example.server.domain.User;
import com.example.server.repository.AdminRepository;
import com.example.server.repository.ResumeRepository;
import com.example.server.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
public class LoginService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    AdminRepository adminRepository;
    @Autowired
    private ResumeRepository resumeRepository;
    @Autowired
    PasswordEncoder passwordEncoder;


    // get user by username and password
    public User checkLoginUser(String username ,String inputPassword ) {

        User user = userRepository.findByUsernameOrEmail(username) ;
        if (user == null) return null;
        else {
            String hashedInput = SHA_256_password.SHA_password(inputPassword);
            if(!(hashedInput.equals(user.getPassword()))) return null;
            else return user;
        }
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
