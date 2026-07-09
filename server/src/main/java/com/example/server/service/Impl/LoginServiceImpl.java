package com.example.server.service.Impl;

import com.example.server.domain.Resume;
import com.example.server.repository.ResumeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.server.domain.User;
import com.example.server.repository.UserRepository;
import com.example.server.service.LoginService;
import com.example.server.service.PasswordService;

@Service
public class LoginServiceImpl implements LoginService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ResumeRepository resumeRepository;

    @Autowired
    private PasswordService passwordService;

    public User checkLoginUser(String username, String inputPassword) {
        User user = userRepository.checkLogin(username);
        if (user == null || !passwordService.matches(inputPassword, user.getPassword())) {
            return null;
        }
        else return user;
    }

    public User checkForgotPass(String email) {
        Resume info = resumeRepository.findResumeByEmail(email)
                .orElseThrow(() -> new RuntimeException("User không tồn tại"));

        return userRepository.findByIdResume(info);
    }

}
