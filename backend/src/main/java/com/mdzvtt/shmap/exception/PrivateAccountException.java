package com.mdzvtt.shmap.exception;

import org.springframework.http.HttpStatus;

public class PrivateAccountException extends AppException {
    public PrivateAccountException(String message) {
        super(ErrorCode.PRIVATE_ACCOUNT, HttpStatus.FORBIDDEN, message);
    }

    public PrivateAccountException() {
        this("This account is private");
    }
}
