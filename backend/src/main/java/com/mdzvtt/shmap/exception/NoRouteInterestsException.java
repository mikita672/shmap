package com.mdzvtt.shmap.exception;

import org.springframework.http.HttpStatus;

public class NoRouteInterestsException extends AppException {
    public NoRouteInterestsException() {
        super(ErrorCode.NO_ROUTE_INTERESTS, HttpStatus.CONFLICT,
                "Pick what you'd like to visit on this route first");
    }
}
