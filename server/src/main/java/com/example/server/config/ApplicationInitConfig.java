
package com.example.server.config;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.example.server.domain.Role;
import com.example.server.domain.User;
import com.example.server.repository.RoleRepository;
import com.example.server.repository.UserRepository;
import com.example.server.service.SHA_256_password;

import lombok.extern.slf4j.Slf4j;


@Slf4j
@Configuration
public class ApplicationInitConfig {
    @Bean
    ApplicationRunner applicationRunner(UserRepository userRepository, RoleRepository roleRepository){
        return  args -> {
            ensureAssistantRole(roleRepository);
            // Tạo admin mặc định nếu chưa tồn tại
            if (userRepository.findByUsername("admin") == null) {
                User userAdmin = new User();
                userAdmin.setUsername("admin");
                userAdmin.setName("admin");
                // Hash mật khẩu mặc định "admin" bằng utility hiện có
                userAdmin.setPassword(SHA_256_password.SHA_password("admin"));
                // Nếu hệ thống dùng Role entity, cố gắng gán role admin (id = 1 giả định)
                roleRepository.findById(1).ifPresent(userAdmin::setIdRole);

                userRepository.save(userAdmin);
                log.warn("Admin user has been created with username 'admin' and password 'admin'. Please change it!");
            } else {
                log.info("Admin user already exists, skipping creation.");
            }
        };
    }

    /** Role hệ thống: assistant — quyền cao hơn user, chỉ sau admin (tên hiển thị: Trợ lí NCKH). */
    private void ensureAssistantRole(RoleRepository roleRepository) {
        if (roleRepository.findFirstByNameIgnoreCase("assistant").isPresent()) {
            return;
        }
        Role assistant = new Role();
        assistant.setName("assistant");
        assistant.setNotes("Trợ lí NCKH");
        roleRepository.save(assistant);
        log.info("Seeded role 'assistant' (Trợ lí NCKH).");
    }
}