package com.example.server.config;

import java.util.Arrays;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.example.server.helpers.JwtAuthenticationFilter;
import com.example.server.utils.SecurityRoles;

import lombok.RequiredArgsConstructor;

/**
 * Phân quyền REST theo JWT authority.
 * Path khớp servlet path (không gồm prefix /api — do spring.mvc.servlet.path=/api).
 */
@Configuration
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
    private final JwtAccessDeniedHandler jwtAccessDeniedHandler;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint(jwtAuthenticationEntryPoint)
                        .accessDeniedHandler(jwtAccessDeniedHandler))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // --- Công khai ---
                        .requestMatchers(
                                "/auth/**",
                                "/public/**",
                                "/download/**",
                                "/file/**",
                                "/nckh/ping",
                                "/chatbot/health",
                                "/rooms/public",
                                "/error"
                        ).permitAll()
                        .requestMatchers(HttpMethod.GET, "/events", "/events/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/address/**").permitAll()

                        // --- Admin hẹp: quản lý user ---
                        .requestMatchers("/dashboard/manage-users/**")
                        .hasAnyAuthority(
                                SecurityRoles.STRICT_ADMIN,
                                SecurityRoles.ROLE_STRICT_ADMIN)

                        // --- Cán bộ NCKH + admin ---
                        .requestMatchers(
                                "/admin/**",
                                "/v1/admin/**",
                                "/ad/**",
                                "/admin/nckh/**",
                                "/admin/research-groups/**",
                                "/admin/news/**"
                        )
                        .hasAnyAuthority(
                                SecurityRoles.NCKH_STAFF,
                                SecurityRoles.ROLE_NCKH_STAFF,
                                SecurityRoles.STRICT_ADMIN,
                                SecurityRoles.ROLE_STRICT_ADMIN)

                        // Duyệt / từ chối hoạt động NCKH
                        .requestMatchers(
                                HttpMethod.POST,
                                "/nckh/activities/*/approve",
                                "/nckh/activities/*/reject"
                        )
                        .hasAnyAuthority(
                                SecurityRoles.NCKH_STAFF,
                                SecurityRoles.ROLE_NCKH_STAFF)
                        .requestMatchers(HttpMethod.GET, "/nckh/activities/pending")
                        .hasAnyAuthority(
                                SecurityRoles.NCKH_STAFF,
                                SecurityRoles.ROLE_NCKH_STAFF)

                        // Ghi định mức tiêu chí — chỉ NCKH staff
                        .requestMatchers(HttpMethod.POST, "/nckh/tieu-chi-dinh-muc/**")
                        .hasAnyAuthority(
                                SecurityRoles.NCKH_STAFF,
                                SecurityRoles.ROLE_NCKH_STAFF)
                        .requestMatchers(HttpMethod.PUT, "/nckh/tieu-chi-dinh-muc/**")
                        .hasAnyAuthority(
                                SecurityRoles.NCKH_STAFF,
                                SecurityRoles.ROLE_NCKH_STAFF)
                        .requestMatchers(HttpMethod.DELETE, "/nckh/tieu-chi-dinh-muc/**")
                        .hasAnyAuthority(
                                SecurityRoles.NCKH_STAFF,
                                SecurityRoles.ROLE_NCKH_STAFF)

                        // Còn lại: bắt buộc JWT
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList(
                "http://localhost:5173",
                "https://rfc5lt36-5173.asse.devtunnels.ms",
                "https://nckh-management.vercel.app"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setExposedHeaders(Arrays.asList(
                "X-Import-Success", "X-Import-Error", "X-Import-Total", "Content-Disposition"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
