package com.mdzvtt.shmap.exception;

import org.springframework.http.HttpStatus;

public class RouteStopNotFoundException extends AppException {
    public RouteStopNotFoundException() {
        super(ErrorCode.ROUTE_STOP_NOT_FOUND, HttpStatus.NOT_FOUND, "Stop not found on this route");
    }
}
