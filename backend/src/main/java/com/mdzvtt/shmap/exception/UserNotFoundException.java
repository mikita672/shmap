package com.mdzvtt.shmap.exception;

import org.springframework.http.HttpStatus;

public class UserNotFoundException extends AppException {
    public UserNotFoundException(String message) {
        super(ErrorCode.USER_NOT_FOUND, HttpStatus.NOT_FOUND, message);
    }

    public UserNotFoundException() {
        this("User not found");
    }
}
