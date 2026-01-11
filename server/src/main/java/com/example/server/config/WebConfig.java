package com.example.server.config;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Value("${upload.dir}")
    private String uploadDir;

    // Trong một class cấu hình




    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
    String location = "file:" + uploadDir;
    // Normalize Windows paths for Spring's file: URL handling
    location = location.replace("\\\\", "/");
    if (!location.endsWith("/")) {
        location = location + "/";
    }

    // Serve uploaded files. With spring.mvc.servlet.path=/api, these become /api/file/** and /api/images/**
    registry.addResourceHandler("/file/**")
        .addResourceLocations(location);

    registry.addResourceHandler("/images/**")
        .addResourceLocations(location);
    }
}
