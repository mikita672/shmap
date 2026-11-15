package com.mdzvtt.shmap.exception;

import org.springframework.http.HttpStatus;

public class InvalidCursorException extends AppException {
    public InvalidCursorException() {
        super(ErrorCode.VALIDATION_FAILED, HttpStatus.BAD_REQUEST, "Invalid cursor", "cursor");
    }
}
