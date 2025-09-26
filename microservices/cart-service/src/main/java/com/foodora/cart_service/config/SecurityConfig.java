package com.foodora.cart_service.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.util.matcher.DispatcherTypeRequestMatcher;

import jakarta.servlet.DispatcherType;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // Disable CSRF for testing
            .authorizeHttpRequests(auth -> auth

                // Allow Swagger/OpenAPI endpoints
                .requestMatchers(
                    "/v3/api-docs/**",
                    "/swagger-ui/**",
                    "/swagger-ui.html",
                    "/swagger-resources/**",
                    "/webjars/**"
                ).permitAll()

                // Allow all API endpoints temporarily
                .requestMatchers("/api/**").permitAll()

                // Allow error pages, etc.
                .requestMatchers(new DispatcherTypeRequestMatcher(DispatcherType.FORWARD)).permitAll()
                .requestMatchers(new DispatcherTypeRequestMatcher(DispatcherType.ERROR)).permitAll()

                // Deny everything else
                .anyRequest().denyAll()
            );

        return http.build();
    }
}
