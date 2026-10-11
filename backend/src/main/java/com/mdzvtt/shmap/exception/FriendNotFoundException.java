package com.mdzvtt.shmap.exception;

import org.springframework.http.HttpStatus;

public class FriendNotFoundException extends AppException {
    public FriendNotFoundException(String message) {
        super(ErrorCode.FRIEND_NOT_FOUND, HttpStatus.NOT_FOUND, message);
    }

    public FriendNotFoundException() {
        this("Friend not found");
    }
}
