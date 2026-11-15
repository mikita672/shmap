package com.mdzvtt.shmap.exception;

import org.springframework.http.HttpStatus;

public class SuggestionAreaRequiredException extends AppException {
    public SuggestionAreaRequiredException() {
        super(ErrorCode.VALIDATION_FAILED, HttpStatus.BAD_REQUEST,
                "A point on the map is required for a route without stops", "near");
    }
}
