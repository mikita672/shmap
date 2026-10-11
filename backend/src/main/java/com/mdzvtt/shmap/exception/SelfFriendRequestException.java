package com.mdzvtt.shmap.exception;

import org.springframework.http.HttpStatus;

public class SelfFriendRequestException extends AppException {
    public SelfFriendRequestException(String message) {
        super(ErrorCode.FRIEND_REQUEST_TO_SELF, HttpStatus.BAD_REQUEST, message);
    }

    public SelfFriendRequestException() {
        this("You can't send a friend request to yourself");
    }
}
