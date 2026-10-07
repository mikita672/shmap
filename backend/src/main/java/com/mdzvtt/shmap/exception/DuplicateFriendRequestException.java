package com.mdzvtt.shmap.exception;

import org.springframework.http.HttpStatus;

public class DuplicateFriendRequestException extends AppException {
    public DuplicateFriendRequestException(String message) {
        super(ErrorCode.FRIEND_REQUEST_ALREADY_SENT, HttpStatus.CONFLICT, message);
    }

    public DuplicateFriendRequestException() {
        this("You have already sent a friend request to this user");
    }
}
