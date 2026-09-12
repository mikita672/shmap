package com.mdzvtt.shmap.exception;

import org.springframework.http.HttpStatus;

public class DuplicateEmailException extends AppException {
    public DuplicateEmailException(String message) {
        super(ErrorCode.EMAIL_ALREADY_EXISTS, HttpStatus.CONFLICT, message, "email");
    }

    public DuplicateEmailException() {
        this("An account with this email already exists");
    }
}
