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
        // Giả sử bạn muốn ảnh truy cập qua: http://localhost:8080/images/ten_anh.jpg
        registry.addResourceHandler("/images/**")
                .addResourceLocations("file:" + uploadDir + "/");
    }
}
