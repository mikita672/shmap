package com.mdzvtt.shmap.exception;

import org.springframework.http.HttpStatus;

public class OtpMaxAttemptsException extends AppException {
    public OtpMaxAttemptsException(String message) {
        super(ErrorCode.OTP_MAX_ATTEMPTS_EXCEEDED, HttpStatus.TOO_MANY_REQUESTS, message, "otp");
    }

    public OtpMaxAttemptsException() {
        this("Too many failed attempts. Please request a new verification code.");
    }
}
