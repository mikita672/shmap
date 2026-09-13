package com.mdzvtt.shmap.configuration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mdzvtt.shmap.exception.ApiErrorResponse;
import com.mdzvtt.shmap.exception.ErrorCode;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.Instant;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {
        private final JwtAuthenticationFilter jwtAuthenticationFilter;
        private final AuthenticationProvider authenticationProvider;
        private final LogoutHandler logoutHandler;
        private final ObjectMapper objectMapper;

        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
                http
                                .csrf(csrf -> csrf.disable())
                                .authorizeHttpRequests(auth -> auth
                                                .requestMatchers(
                                                                "/api/v1/auth/**",
                                                                "/swagger-ui/**",
                                                                "/swagger-ui.html",
                                                                "/v3/api-docs/**",
                                                                "/v3/api-docs.yaml")
                                                .permitAll()
                                                .anyRequest()
                                                .authenticated())
                                .sessionManagement(session -> session
                                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                                .authenticationProvider(authenticationProvider)
                                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                                .exceptionHandling(exceptions -> exceptions
                                                .authenticationEntryPoint((request, response, authException) -> {
                                                        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                                                        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                                                        ApiErrorResponse errorResponse = ApiErrorResponse.builder()
                                                                        .timestamp(Instant.now())
                                                                        .status(HttpServletResponse.SC_UNAUTHORIZED)
                                                                        .code(ErrorCode.UNAUTHORIZED)
                                                                        .message("Full authentication is required to access this resource")
                                                                        .error("Full authentication is required to access this resource")
                                                                        .path(request.getRequestURI())
                                                                        .build();
                                                        objectMapper.writeValue(response.getOutputStream(), errorResponse);
                                                }))
                                .logout(logout -> logout
                                                .logoutUrl("/api/v1/auth/logout")
                                                .addLogoutHandler(logoutHandler)
                                                .logoutSuccessHandler((request, response,
                                                                authentication) -> SecurityContextHolder
                                                                                .clearContext()));

                return http.build();
        }
}

