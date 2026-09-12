package com.mdzvtt.shmap.exception;

import org.springframework.http.HttpStatus;

public class InvalidOtpException extends AppException {
    public InvalidOtpException(String message) {
        super(ErrorCode.INVALID_OTP, HttpStatus.BAD_REQUEST, message, "otp");
    }

    public InvalidOtpException() {
        this("Invalid verification code");
    }
}
