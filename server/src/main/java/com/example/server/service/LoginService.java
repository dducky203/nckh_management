package com.example.server.service;

import com.example.server.domain.User;


public interface LoginService {


    User checkLoginUser(String username, String inputPassword);

    User checkForgotPass(String username);

}
