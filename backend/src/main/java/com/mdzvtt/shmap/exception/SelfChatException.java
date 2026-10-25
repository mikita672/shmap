package com.mdzvtt.shmap.exception;

import org.springframework.http.HttpStatus;

public class SelfChatException extends AppException {
    public SelfChatException(String message) {
        super(ErrorCode.CHAT_WITH_SELF, HttpStatus.BAD_REQUEST, message);
    }

    public SelfChatException() {
        this("You can't chat with yourself");
    }
}
