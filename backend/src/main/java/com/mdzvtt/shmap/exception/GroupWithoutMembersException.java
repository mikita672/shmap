package com.mdzvtt.shmap.exception;

import org.springframework.http.HttpStatus;

public class GroupWithoutMembersException extends AppException {
    public GroupWithoutMembersException(String message) {
        super(ErrorCode.VALIDATION_FAILED, HttpStatus.BAD_REQUEST, message, "memberIds");
    }

    public GroupWithoutMembersException() {
        this("A group needs at least one other member");
    }
}
