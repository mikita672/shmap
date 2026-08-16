package com.mdzvtt.shmap.auth.passwordreset;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

public class PasswordResetDTOs {
    @Data
    public static class ForgotPasswordRequest {
        private String email;
    }

    @Data
    public static class VerifyOtpRequest {
        private String email;
        private String otp;
    }

    @Data
    public static class ResetPasswordRequest {
        private String email;
        private String otp;
        @NotBlank(message = "Password is required")
        private String newPassword;
    }
}
