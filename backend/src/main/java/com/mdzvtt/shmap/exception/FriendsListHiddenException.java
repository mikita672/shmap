package com.mdzvtt.shmap.exception;

import org.springframework.http.HttpStatus;

public class FriendsListHiddenException extends AppException {
    public FriendsListHiddenException(String message) {
        super(ErrorCode.FRIENDS_LIST_HIDDEN, HttpStatus.FORBIDDEN, message);
    }

    public FriendsListHiddenException() {
        this("This user's friends list is hidden");
    }
}
