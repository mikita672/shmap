package com.mdzvtt.shmap.auth;

import com.mdzvtt.shmap.exception.GoogleAuthException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.io.IOException;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthenticationController {
    private final AuthenticationService service;
    private final GoogleAuthService googleAuthService;

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(
            @Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(service.register(request));
    }

    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(
            @Valid @RequestBody AuthenticationRequest request) {
        return ResponseEntity.ok(service.authenticate(request));
    }

    @PostMapping("/refresh-token")
    public void refreshToken(HttpServletRequest request,
            HttpServletResponse response) throws IOException {
        service.refreshToken(request, response);
    }

    @PostMapping("/verify-google")
    public ResponseEntity<AuthenticationResponse> googleAuthenticate(@RequestBody Map<String, String> request) {
        String idToken = request.get("idToken");

        if (idToken == null || idToken.trim().isEmpty()) {
            throw GoogleAuthException.invalidToken("Google ID token is required");
        }

        try {
            AuthenticationResponse response = googleAuthService.verifyAndLogin(idToken);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            log.warn("Google authentication failed: {}", e.getMessage());
            throw GoogleAuthException.invalidToken("Invalid Google authentication token");
        } catch (Exception e) {
            log.error("Google authentication error", e);
            throw GoogleAuthException.failed("Google authentication failed");
        }
    }
}

