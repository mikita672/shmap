package com.mdzvtt.shmap.exception;

import org.springframework.http.HttpStatus;

public class InvalidCurrentPasswordException extends AppException {
    public InvalidCurrentPasswordException(String message) {
        super(ErrorCode.INVALID_CURRENT_PASSWORD, HttpStatus.BAD_REQUEST, message, "currentPassword");
    }

    public InvalidCurrentPasswordException() {
        this("Current password is incorrect");
    }
}
