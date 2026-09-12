package com.mdzvtt.shmap.exception;

import org.springframework.http.HttpStatus;

public class GoogleAuthException extends AppException {
    public GoogleAuthException(ErrorCode errorCode, HttpStatus httpStatus, String message) {
        super(errorCode, httpStatus, message);
    }

    public static GoogleAuthException invalidToken(String message) {
        return new GoogleAuthException(ErrorCode.INVALID_GOOGLE_TOKEN, HttpStatus.UNAUTHORIZED, message);
    }

    public static GoogleAuthException failed(String message) {
        return new GoogleAuthException(ErrorCode.GOOGLE_AUTH_FAILED, HttpStatus.INTERNAL_SERVER_ERROR, message);
    }
}
