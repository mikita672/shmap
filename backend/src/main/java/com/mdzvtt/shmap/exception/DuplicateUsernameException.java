package com.mdzvtt.shmap.exception;

import org.springframework.http.HttpStatus;

public class DuplicateUsernameException extends AppException {
    public DuplicateUsernameException(String message) {
        super(ErrorCode.USERNAME_ALREADY_EXISTS, HttpStatus.CONFLICT, message, "username");
    }

    public DuplicateUsernameException() {
        this("This username is already taken");
    }
}
