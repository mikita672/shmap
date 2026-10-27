package com.mdzvtt.shmap.exception;

import org.springframework.http.HttpStatus;

public class ChatMessageNotFoundException extends AppException {
    public ChatMessageNotFoundException() {
        super(ErrorCode.CHAT_MESSAGE_NOT_FOUND, HttpStatus.NOT_FOUND, "Message not found in this chat");
    }
}
