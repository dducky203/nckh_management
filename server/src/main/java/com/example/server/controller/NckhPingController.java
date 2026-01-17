package com.example.server.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class NckhPingController {

    @GetMapping("/nckh/ping")
    public String ping() {
        return "OK";
    }
}
