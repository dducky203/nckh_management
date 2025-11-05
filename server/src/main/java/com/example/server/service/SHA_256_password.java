package com.example.server.service;


import org.springframework.stereotype.Service;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

@Service
public class SHA_256_password {
    //https://www.baeldung.com/sha-256-hashing-java
    public static String SHA_password(String password) {
        try {
            // Tạo một đối tượng MessageDigest với thuật toán SHA-256
            MessageDigest md = MessageDigest.getInstance("SHA-256");

            // Mã hóa mật khẩu thành mảng byte
            byte[] hashedPassword = md.digest(password.getBytes());

            // Chuyển đổi mảng byte thành dạng hex
            StringBuilder hexString = new StringBuilder();
            for (byte b : hashedPassword) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) {
                    hexString.append('0');
                }
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
            // Xử lý ngoại lệ nếu thuật toán không được hỗ trợ
            return null;
        }
    }

    public static boolean comparePassword(String inputPassword, String password) {
        if (inputPassword == null || password == null) return false;

        // Hash lại mật khẩu user nhập vào
        String hashedInput = SHA_password(inputPassword);

        // So sánh với hash trong DB
        return hashedInput.equals(password);
    }


    public static String GM_SHA_password(String input) {
        try {
            // Tạo một đối tượng MessageDigest với thuật toán SHA-256
            MessageDigest digest = MessageDigest.getInstance("SHA-256");

            // Mã hóa chuỗi dữ liệu thành một mảng byte
            byte[] hash = digest.digest(input.getBytes());

            // Chuyển đổi mảng byte thành chuỗi hex
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) {
                    hexString.append('0');
                }
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
            // Xử lý ngoại lệ nếu thuật toán không được hỗ trợ
            return null;
        }
    }
}
