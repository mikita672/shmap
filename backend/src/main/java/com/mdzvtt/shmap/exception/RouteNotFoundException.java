package com.mdzvtt.shmap.exception;

import org.springframework.http.HttpStatus;

public class RouteNotFoundException extends AppException {
    public RouteNotFoundException() {
        super(ErrorCode.ROUTE_NOT_FOUND, HttpStatus.NOT_FOUND, "Route not found");
    }
}
