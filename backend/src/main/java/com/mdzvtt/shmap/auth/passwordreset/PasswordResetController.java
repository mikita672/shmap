package com.mdzvtt.shmap.auth.passwordreset;

import java.time.LocalDateTime;
import java.security.SecureRandom;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mdzvtt.shmap.auth.passwordreset.PasswordResetDTOs.ForgotPasswordRequest;
import com.mdzvtt.shmap.auth.passwordreset.PasswordResetDTOs.MessageResponse;
import com.mdzvtt.shmap.auth.passwordreset.PasswordResetDTOs.ResetPasswordRequest;
import com.mdzvtt.shmap.auth.passwordreset.PasswordResetDTOs.VerifyOtpRequest;
import com.mdzvtt.shmap.exception.InvalidOtpException;
import com.mdzvtt.shmap.exception.OtpExpiredException;
import com.mdzvtt.shmap.exception.OtpMaxAttemptsException;
import com.mdzvtt.shmap.user.User;
import com.mdzvtt.shmap.user.UserRepository;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
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
    public ResponseEntity<MessageResponse> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        Optional<User> userOptional = userRepository.findByEmail(request.getEmail());

        if (userOptional.isEmpty()) {
            return ResponseEntity.ok(MessageResponse.of("Verification code sent to your email"));
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
            return ResponseEntity.ok(MessageResponse.of("Verification code sent to your email"));
        } catch (Exception e) {
            String redacted = request.getEmail().replaceAll("(^[^@]{0,2})[^@]*", "$1***");
            log.error("Email delivery failed for {}", redacted);
            return ResponseEntity.ok(MessageResponse.of("Verification code sent to your email"));
        }
    }

    @Transactional
    @PostMapping("/verify-otp")
    public ResponseEntity<MessageResponse> verifyOtp(@Valid @RequestBody VerifyOtpRequest request) {
        Optional<User> userOptional = userRepository.findByEmail(request.getEmail());

        if (userOptional.isEmpty()) {
            throw new InvalidOtpException("Invalid verification code");
        }

        Optional<PasswordResetToken> tokenOptional = tokenRepository.findByUserForUpdate(userOptional.get());
        if (tokenOptional.isEmpty()) {
            throw new InvalidOtpException("Invalid verification code");
        }

        PasswordResetToken token = tokenOptional.get();
        if (token.getFailedAttempts() >= 5) {
            tokenRepository.delete(token);
            throw new OtpMaxAttemptsException("Too many failed attempts. Please request a new verification code.");
        }

        if (!passwordEncoder.matches(request.getOtp(), token.getOtp())) {
            token.setFailedAttempts(token.getFailedAttempts() + 1);
            tokenRepository.save(token);
            throw new InvalidOtpException("Invalid verification code");
        }

        if (token.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new OtpExpiredException("Verification code has expired. Please request a new one.");
        }

        return ResponseEntity.ok(MessageResponse.of("Verification code verified successfully"));
    }

    @Transactional
    @PostMapping("/reset-password")
    public ResponseEntity<MessageResponse> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        Optional<User> userOptional = userRepository.findByEmail(request.getEmail());

        if (userOptional.isEmpty()) {
            throw new InvalidOtpException("Invalid verification code");
        }

        User user = userOptional.get();
        Optional<PasswordResetToken> tokenOptional = tokenRepository.findByUserForUpdate(user);

        if (tokenOptional.isEmpty()) {
            throw new InvalidOtpException("Invalid verification code");
        }

        PasswordResetToken token = tokenOptional.get();
        if (token.getFailedAttempts() >= 5) {
            tokenRepository.delete(token);
            throw new OtpMaxAttemptsException("Too many failed attempts. Please request a new verification code.");
        }

        if (!passwordEncoder.matches(request.getOtp(), token.getOtp())) {
            token.setFailedAttempts(token.getFailedAttempts() + 1);
            tokenRepository.save(token);
            throw new InvalidOtpException("Invalid verification code");
        }

        if (token.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new OtpExpiredException("Verification code has expired. Please request a new one.");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        tokenRepository.deleteByUser(user);

        return ResponseEntity.ok(MessageResponse.of("Password successfully reset"));
    }
}

