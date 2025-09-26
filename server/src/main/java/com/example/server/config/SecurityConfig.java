package com.example.server.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests(auth -> auth
//                        .requestMatchers("/ad/**").hasRole("ADMIN").permitAll()
                        .requestMatchers("/ad/**").permitAll()
                        .requestMatchers("/user/**").permitAll()
                        .requestMatchers(
                                "/",
                                "/login",
                                "/login/**",
                                "/api/**", // Allow all API endpoints
                                "/intro",
                                "/ncm/showNcmNotUser",
                                "/news/**",
                                "/sheet/**",
                                "/filter/**",
                                "/event/**",
                                "/event/preFile/**",
                                "/css/**",
                                "/file/**",
                                "/download/**",
                                "/ncm/showNcmNotUser/**",
                                "/assets/**").permitAll()
//                        .anyRequest().authenticated()
                                .anyRequest().permitAll()
                )
                .csrf(AbstractHttpConfigurer::disable)
                .formLogin(AbstractHttpConfigurer::disable); //  dùng login thủ công

        return http.build();
    }

}
