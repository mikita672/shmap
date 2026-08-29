package com.mdzvtt.shmap.auth;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mdzvtt.shmap.configuration.JwtService;
import com.mdzvtt.shmap.token.Token;
import com.mdzvtt.shmap.token.TokenRepository;
import com.mdzvtt.shmap.token.TokenType;
import com.mdzvtt.shmap.user.Role;
import com.mdzvtt.shmap.user.UserRepository;
import com.mdzvtt.shmap.user.User;

import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;

@Service
public class GoogleAuthService {
    private final OkHttpClient httpClient;
    private final ObjectMapper objectMapper;
    private final UserRepository userRepository;
    private final TokenRepository tokenRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.google.client-id:}")
    private String googleClientId;

    public GoogleAuthService(OkHttpClient httpClient, ObjectMapper objectMapper, UserRepository userRepository,
            TokenRepository tokenRepository, JwtService jwtService, PasswordEncoder passwordEncoder) {
        this.httpClient = httpClient;
        this.objectMapper = objectMapper;
        this.userRepository = userRepository;
        this.tokenRepository = tokenRepository;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
    }

    public AuthenticationResponse verifyAndLogin(String idTokenString) throws Exception {
        Request request = new Request.Builder()
                .url("http://oauth2.googleapis.com/tokeninfo?id_token=" + idTokenString)
                .build();

        try (Response response = httpClient.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                throw new IllegalArgumentException("Invalid Google token");
            }

            JsonNode payload = objectMapper.readTree(response.body().string());

            if (googleClientId != null && !googleClientId.isEmpty()
                    && !googleClientId.equals(payload.get("aud").asText())) {
                throw new IllegalArgumentException("Audience mismatch. Expected: " + googleClientId);
            }

            String email = payload.path("email").asText();
            String firstName = payload.path("given_name").asText(null);
            String lastName = payload.path("family_name").asText("");

            if (firstName == null) {
                String name = payload.path("name").asText(null);
                if (name != null) {
                    String[] parts = name.split(" ", 2);
                    firstName = parts[0];
                    lastName = parts.length > 1 ? parts[1] : "";
                } else {
                    firstName = "";
                    lastName = "";
                }
            }

            final String finalFirstName = firstName;
            final String finalLastName = lastName;

            User user = userRepository.findByEmail(email).orElseGet(() -> {
                User newUser = User.builder()
                        .firstName(finalFirstName)
                        .lastName(finalLastName)
                        .email(email)
                        .username(email)
                        .password(passwordEncoder.encode(UUID.randomUUID().toString()))
                        .role(Role.USER)
                        .build();

                return userRepository.save(newUser);
            });

            var jwtToken = jwtService.generateToken(user);
            var refreshToken = jwtService.generateRefreshToken(user);

            revokeAllUserTokens(user);
            saveUserToken(user, refreshToken, TokenType.REFRESH);

            return AuthenticationResponse.builder()
                    .accessToken(jwtToken)
                    .refreshToken(refreshToken)
                    .build();
        }
    }

    private void saveUserToken(User user, String jwtToken, TokenType tokenType) {
        var token = Token.builder()
                .user(user)
                .token(jwtToken)
                .tokenType(tokenType)
                .expired(false)
                .revoked(false)
                .build();

        tokenRepository.save(token);
    }

    private void revokeAllUserTokens(User user) {
        var validUserTokens = tokenRepository.findAllValidTokenByUser(user.getId());

        if (validUserTokens.isEmpty()) {
            return;
        }

        validUserTokens.forEach(token -> {
            token.setExpired(true);
            token.setRevoked(true);
        });

        tokenRepository.saveAll(validUserTokens);
    }
}
