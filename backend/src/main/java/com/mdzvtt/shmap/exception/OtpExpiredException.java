package com.mdzvtt.shmap.exception;

import org.springframework.http.HttpStatus;

public class OtpExpiredException extends AppException {
    public OtpExpiredException(String message) {
        super(ErrorCode.OTP_EXPIRED, HttpStatus.BAD_REQUEST, message, "otp");
    }

    public OtpExpiredException() {
        this("Verification code has expired. Please request a new one.");
    }
}
