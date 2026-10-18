package com.mdzvtt.shmap.exception;

import org.springframework.http.HttpStatus;

public class BlockNotFoundException extends AppException {
    public BlockNotFoundException(String message) {
        super(ErrorCode.BLOCK_NOT_FOUND, HttpStatus.NOT_FOUND, message);
    }

    public BlockNotFoundException() {
        this("Block not found");
    }
}
