package com.mdzvtt.shmap.exception;

import org.springframework.http.HttpStatus;

public class RouteTooFewStopsException extends AppException {
    public RouteTooFewStopsException(int minStops) {
        super(ErrorCode.ROUTE_TOO_FEW_STOPS, HttpStatus.CONFLICT,
                "Add at least " + minStops + " stops before marking the route as done");
    }
}
