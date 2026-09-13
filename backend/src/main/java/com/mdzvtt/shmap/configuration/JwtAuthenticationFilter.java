package com.mdzvtt.shmap.configuration;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import io.jsonwebtoken.JwtException;

import java.io.IOException;

import com.mdzvtt.shmap.token.TokenRepository;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mdzvtt.shmap.exception.ApiErrorResponse;
import com.mdzvtt.shmap.exception.ErrorCode;
import org.springframework.http.MediaType;

import java.time.Instant;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;
    private final TokenRepository tokenRepository;
    private final ObjectMapper objectMapper;

    @Override
    protected boolean shouldNotFilter(@NonNull HttpServletRequest request) {
        return request.getRequestURI().startsWith("/api/v1/auth/");
    }

    @Override
    protected boolean shouldNotFilterErrorDispatch() {
        return false;
    }

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain) throws ServletException, IOException {
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);

            return;
        }

        try {
            jwt = authHeader.substring(7);
            userEmail = jwtService.extractUserEmail(jwt);

            if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);

                if (jwtService.isTokenValid(jwt, userDetails)) {
                    var storedToken = tokenRepository.findByToken(jwt).orElse(null);
                    boolean isTokenActive = storedToken != null && !storedToken.isExpired() && !storedToken.isRevoked();

                    if (isTokenActive) {
                        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null, userDetails.getAuthorities());
                        authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(authToken);
                    }
                }
            }
        } catch (JwtException | UsernameNotFoundException e) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            ApiErrorResponse errorResponse = ApiErrorResponse.builder()
                    .timestamp(Instant.now())
                    .status(HttpServletResponse.SC_UNAUTHORIZED)
                    .code(ErrorCode.UNAUTHORIZED)
                    .message("Invalid or expired token")
                    .error("Invalid or expired token")
                    .path(request.getRequestURI())
                    .build();
            objectMapper.writeValue(response.getOutputStream(), errorResponse);
            return;
        }

        filterChain.doFilter(request, response);
    }
}
