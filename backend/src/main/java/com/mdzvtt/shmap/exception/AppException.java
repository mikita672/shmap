package com.mdzvtt.shmap.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public abstract class AppException extends RuntimeException {
    private final ErrorCode errorCode;
    private final HttpStatus httpStatus;
    private final String field;

    protected AppException(ErrorCode errorCode, HttpStatus httpStatus, String message) {
        super(message);
        this.errorCode = errorCode;
        this.httpStatus = httpStatus;
        this.field = null;
    }

    protected AppException(ErrorCode errorCode, HttpStatus httpStatus, String message, String field) {
        super(message);
        this.errorCode = errorCode;
        this.httpStatus = httpStatus;
        this.field = field;
    }
}
