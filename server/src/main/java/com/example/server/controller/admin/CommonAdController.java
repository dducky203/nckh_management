package com.example.server.controller.admin;

import com.example.server.controller.user.EventDetailController;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@Controller
@RequestMapping("/ad")
public class CommonAdController {

    @Autowired
    EventDetailController eventDetailController;


    // get admin
    @GetMapping("")
    public String enterAdmin(Model model){
        int year = LocalDate.now().getYear();
        model.addAttribute("year", year);
        model.addAttribute("statistics", eventDetailController.getStats(year));
        return "admin/index";
    }


}
