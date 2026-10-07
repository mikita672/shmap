package com.mdzvtt.shmap.exception;

import org.springframework.http.HttpStatus;

public class FriendRequestNotFoundException extends AppException {
    public FriendRequestNotFoundException(String message) {
        super(ErrorCode.FRIEND_REQUEST_NOT_FOUND, HttpStatus.NOT_FOUND, message);
    }

    public FriendRequestNotFoundException() {
        this("Friend request not found");
    }
}
