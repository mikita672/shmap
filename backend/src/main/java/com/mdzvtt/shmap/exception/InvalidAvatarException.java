package com.mdzvtt.shmap.exception;

import org.springframework.http.HttpStatus;

public class InvalidAvatarException extends AppException {
    public InvalidAvatarException(String message) {
        super(ErrorCode.INVALID_AVATAR, HttpStatus.BAD_REQUEST, message, "avatar");
    }
}
