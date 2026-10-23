package com.mdzvtt.shmap.exception;

import org.springframework.http.HttpStatus;

public class ChatNotFoundException extends AppException {
    public ChatNotFoundException(String message) {
        super(ErrorCode.CHAT_NOT_FOUND, HttpStatus.NOT_FOUND, message);
    }

    public ChatNotFoundException() {
        this("Chat not found");
    }
}
