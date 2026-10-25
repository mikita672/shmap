package com.mdzvtt.shmap.exception;

import org.springframework.http.HttpStatus;

public class NotFriendsException extends AppException {
    public NotFriendsException(String message) {
        super(ErrorCode.NOT_FRIENDS, HttpStatus.FORBIDDEN, message);
    }

    public NotFriendsException() {
        this("You can only chat with friends");
    }
}
