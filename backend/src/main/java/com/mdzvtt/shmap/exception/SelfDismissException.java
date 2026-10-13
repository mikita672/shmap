package com.mdzvtt.shmap.exception;

import org.springframework.http.HttpStatus;

public class SelfDismissException extends AppException {
    public SelfDismissException(String message) {
        super(ErrorCode.DISMISS_SELF, HttpStatus.BAD_REQUEST, message);
    }

    public SelfDismissException() {
        this("You can't dismiss yourself");
    }
}
