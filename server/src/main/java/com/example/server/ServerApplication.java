package com.example.server;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@SpringBootApplication
@EnableJpaAuditing
@org.springframework.scheduling.annotation.EnableScheduling
@org.springframework.scheduling.annotation.EnableAsync
public class ServerApplication {

    public static void main(String[] args) {
        SpringApplication.run(ServerApplication.class, args);
        log.info("Sever running at http://localhost:8081");
    }
}