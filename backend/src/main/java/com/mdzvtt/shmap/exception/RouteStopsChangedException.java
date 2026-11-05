package com.mdzvtt.shmap.exception;

import org.springframework.http.HttpStatus;

public class RouteStopsChangedException extends AppException {
    public RouteStopsChangedException() {
        super(ErrorCode.ROUTE_STOPS_CHANGED, HttpStatus.CONFLICT,
                "The stops changed. Reload the route and try again");
    }
}
