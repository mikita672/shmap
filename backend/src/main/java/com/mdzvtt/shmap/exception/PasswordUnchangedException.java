package com.mdzvtt.shmap.exception;

import org.springframework.http.HttpStatus;

public class PasswordUnchangedException extends AppException {
    public PasswordUnchangedException(String message) {
        super(ErrorCode.PASSWORD_UNCHANGED, HttpStatus.BAD_REQUEST, message, "newPassword");
    }

    public PasswordUnchangedException() {
        this("New password must be different from the current password");
    }
}
