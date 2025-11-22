package com.example.server.utils;

public class Constants {
    public  static String getPowerDescription(Integer power) {
        if (power == null)
            return "";

        switch (power) {
            case 1:
                return "Trưởng khoa";
            case 2:
                return "Phó khoa";
            case 3:
                return "Cán bộ khoa";
            case 4:
                return "Sinh viên";
            default:
                return "Không xác định";
        }
    }
}
