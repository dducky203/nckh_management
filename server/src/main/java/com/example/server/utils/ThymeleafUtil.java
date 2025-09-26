package com.example.server.utils;

import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ThymeleafUtil {
    public ThymeleafUtil() {
        System.out.println(">>> ThymeleafUtil loaded");
    }
    // cac ipOperatingStandard hien thi tgian dien ra
    public boolean isShowEventDate(Integer id) {
        if (id == null) return false;
        return List.of(1, 5, 9, 13, 30, 31).contains(id);
    }
}
