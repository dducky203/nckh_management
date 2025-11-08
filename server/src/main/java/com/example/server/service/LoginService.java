package com.example.server.service;

import com.example.server.domain.User;


public interface LoginService {


    public User checkLoginUser(String username, String inputPassword);

    public User checkForgotPass(String username);

}
