package com.mdzvtt.shmap.auth.passwordreset;

import java.time.LocalDateTime;
import java.util.Random;

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

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class PasswordResetController {
    private final UserRepository userRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        Optional<User> userOptional = userRepository.findByEmail(request.getEmail());

        if (userOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }

        User user = userOptional.get();

        tokenRepository.deleteByUser(user);

        String otp = String.format("%06d", new Random().nextInt(999999));

        PasswordResetToken token = new PasswordResetToken();
        token.setUser(user);
        token.setOtp(otp);
        token.setExpiryDate(LocalDateTime.now().plusMinutes(15));
        tokenRepository.save(token);

        try {
            emailService.sendOtpEmail(user.getEmail(), otp);

            return ResponseEntity.ok("OTP send to your email");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to send email");
        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<String> verifyOtp(@RequestBody VerifyOtpRequest request) {
        Optional<User> userOptional = userRepository.findByEmail(request.getEmail());

        if (userOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }

        Optional<PasswordResetToken> tokenOptional = tokenRepository.findByUser(userOptional.get());
        if (tokenOptional.isEmpty() || !tokenOptional.get().getOtp().equals(request.getOtp())) {
            return ResponseEntity.badRequest().body("Invalid OTP");
        }

        if (tokenOptional.get().getExpiryDate().isBefore(LocalDateTime.now())) {
            return ResponseEntity.badRequest().body("OTP has expired");
        }

        return ResponseEntity.ok("OTP verified successfull");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody ResetPasswordRequest request) {
        Optional<User> userOptional = userRepository.findByEmail(request.getEmail());

        if (userOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }

        User user = userOptional.get();
        Optional<PasswordResetToken> tokenOptional = tokenRepository.findByUser(user);

        if (tokenOptional.isEmpty() || !tokenOptional.get().getOtp().equals(request.getOtp())) {
            return ResponseEntity.badRequest().body("Invalid OTP");
        }

        if (tokenOptional.get().getExpiryDate().isBefore(LocalDateTime.now())) {
            return ResponseEntity.badRequest().body("OTP has expired");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        tokenRepository.deleteByUser(user);

        return ResponseEntity.ok("Password successfully reset");
    }
}
