package com.mdzvtt.shmap.exception;

import org.springframework.http.HttpStatus;

public class AvatarUploadNotFoundException extends AppException {
    public AvatarUploadNotFoundException(String message) {
        super(ErrorCode.AVATAR_UPLOAD_NOT_FOUND, HttpStatus.BAD_REQUEST, message, "key");
    }

    public AvatarUploadNotFoundException() {
        this("Uploaded avatar not found");
    }
}
