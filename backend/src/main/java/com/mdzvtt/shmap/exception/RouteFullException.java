package com.mdzvtt.shmap.exception;

import org.springframework.http.HttpStatus;

public class RouteFullException extends AppException {
    public RouteFullException(int maxStops) {
        super(ErrorCode.ROUTE_FULL, HttpStatus.CONFLICT, "A route can have at most " + maxStops + " stops");
    }
}
