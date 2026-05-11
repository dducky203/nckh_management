package com.example.server.service.Impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.server.domain.User;
import com.example.server.repository.UserRepository;
import com.example.server.service.LoginService;
import com.example.server.service.SHA_256_password;

@Service
public class LoginServiceImpl implements LoginService {
    @Autowired
    private UserRepository userRepository;


    public User checkLoginUser(String username, String inputPassword) {

        User user = userRepository.checkLogin(username);
        if (user == null) return null;
        else {
            if (!(SHA_256_password.comparePassword(inputPassword, user.getPassword()))) return null;
            else return user;
        }
    }


    public User checkForgotPass(String email) {
        List<User> users = userRepository.findAll();
        for (User user : users) {
            if (user.getIdResume().getEmail().equals(email)) {
                return user;
            }
        }
        return null;
    }

}
