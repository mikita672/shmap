package com.mdzvtt.shmap.exception;

import org.springframework.http.HttpStatus;

public class NotChatMemberException extends AppException {
    public NotChatMemberException() {
        super(ErrorCode.NOT_CHAT_MEMBER, HttpStatus.BAD_REQUEST, "Only chat members can take part");
    }
}
