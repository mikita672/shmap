package com.mdzvtt.shmap.exception;

import org.springframework.http.HttpStatus;

public class RouteFinishedException extends AppException {
    public RouteFinishedException() {
        super(ErrorCode.ROUTE_FINISHED, HttpStatus.CONFLICT,
                "This route is marked as done. Mark it as not done to change the plan");
    }
}
