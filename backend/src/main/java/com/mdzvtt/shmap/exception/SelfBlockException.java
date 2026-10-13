package com.mdzvtt.shmap.exception;

import org.springframework.http.HttpStatus;

public class SelfBlockException extends AppException {
    public SelfBlockException(String message) {
        super(ErrorCode.BLOCK_SELF, HttpStatus.BAD_REQUEST, message);
    }

    public SelfBlockException() {
        this("You can't block yourself");
    }
}
