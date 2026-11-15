package com.mdzvtt.shmap.exception;

import org.springframework.http.HttpStatus;

public class RouteSuggestionsNotFoundException extends AppException {
    public RouteSuggestionsNotFoundException() {
        super(ErrorCode.ROUTE_SUGGESTIONS_NOT_FOUND, HttpStatus.NOT_FOUND, "This route has no suggestions yet");
    }
}
