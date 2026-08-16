package com.mdzvtt.shmap.auth.passwordreset;

import java.time.LocalDateTime;
import java.security.SecureRandom;

import java.util.Optional;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mdzvtt.shmap.auth.passwordreset.PasswordResetDTOs.ForgotPasswordRequest;
import com.mdzvtt.shmap.auth.passwordreset.PasswordResetDTOs.ResetPasswordRequest;
import com.mdzvtt.shmap.auth.passwordreset.PasswordResetDTOs.VerifyOtpRequest;
import com.mdzvtt.shmap.user.User;
import com.mdzvtt.shmap.user.UserRepository;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class PasswordResetController {
    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        Optional<User> userOptional = userRepository.findByEmail(request.getEmail());

        if (userOptional.isEmpty()) {
            return ResponseEntity.ok("OTP send to your email");
        }

        User user = userOptional.get();

        tokenRepository.deleteByUser(user);

        String otp = String.format("%06d", SECURE_RANDOM.nextInt(1_000_000));

        PasswordResetToken token = new PasswordResetToken();
        token.setUser(user);
        token.setOtp(passwordEncoder.encode(otp));
        token.setExpiryDate(LocalDateTime.now().plusMinutes(15));
        tokenRepository.save(token);

        try {
            emailService.sendOtpEmail(user.getEmail(), otp);

            return ResponseEntity.ok("OTP send to your email");
        } catch (Exception e) {
            System.err.println("Email delivery failed for " + request.getEmail() + ": " + e.getMessage());
            return ResponseEntity.ok("OTP send to your email");
        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<String> verifyOtp(@RequestBody VerifyOtpRequest request) {
        Optional<User> userOptional = userRepository.findByEmail(request.getEmail());

        if (userOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("Invalid OTP");
        }

        Optional<PasswordResetToken> tokenOptional = tokenRepository.findByUser(userOptional.get());
        if (tokenOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("Invalid OTP");
        }

        PasswordResetToken token = tokenOptional.get();
        if (token.getFailedAttempts() >= 5) {
            tokenRepository.delete(token);
            return ResponseEntity.badRequest().body("Too many failed attempts. Please request a new OTP.");
        }

        if (!passwordEncoder.matches(request.getOtp(), token.getOtp())) {
            token.setFailedAttempts(token.getFailedAttempts() + 1);
            tokenRepository.save(token);
            return ResponseEntity.badRequest().body("Invalid OTP");
        }

        if (token.getExpiryDate().isBefore(LocalDateTime.now())) {
            return ResponseEntity.badRequest().body("OTP has expired");
        }

        return ResponseEntity.ok("OTP verified successfull");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        Optional<User> userOptional = userRepository.findByEmail(request.getEmail());

        if (userOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("Invalid OTP");
        }

        User user = userOptional.get();
        Optional<PasswordResetToken> tokenOptional = tokenRepository.findByUser(user);

        if (tokenOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("Invalid OTP");
        }

        PasswordResetToken token = tokenOptional.get();
        if (token.getFailedAttempts() >= 5) {
            tokenRepository.delete(token);
            return ResponseEntity.badRequest().body("Too many failed attempts. Please request a new OTP.");
        }

        if (!passwordEncoder.matches(request.getOtp(), token.getOtp())) {
            token.setFailedAttempts(token.getFailedAttempts() + 1);
            tokenRepository.save(token);
            return ResponseEntity.badRequest().body("Invalid OTP");
        }

        if (token.getExpiryDate().isBefore(LocalDateTime.now())) {
            return ResponseEntity.badRequest().body("OTP has expired");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        tokenRepository.deleteByUser(user);

        return ResponseEntity.ok("Password successfully reset");
    }
}
