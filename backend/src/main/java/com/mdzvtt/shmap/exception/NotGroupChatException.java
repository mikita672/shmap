package com.mdzvtt.shmap.exception;

import org.springframework.http.HttpStatus;

public class NotGroupChatException extends AppException {
    public NotGroupChatException(String message) {
        super(ErrorCode.NOT_GROUP_CHAT, HttpStatus.BAD_REQUEST, message);
    }

    public NotGroupChatException() {
        this("This is not a group chat");
    }
}
