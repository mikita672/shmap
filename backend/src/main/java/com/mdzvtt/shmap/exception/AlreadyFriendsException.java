package com.mdzvtt.shmap.exception;

import org.springframework.http.HttpStatus;

public class AlreadyFriendsException extends AppException {
    public AlreadyFriendsException(String message) {
        super(ErrorCode.ALREADY_FRIENDS, HttpStatus.CONFLICT, message);
    }

    public AlreadyFriendsException() {
        this("You are already friends with this user");
    }
}
