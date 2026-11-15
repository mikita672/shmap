package com.mdzvtt.shmap.exception;

import org.springframework.http.HttpStatus;

public class NoPlacesFoundException extends AppException {
    public NoPlacesFoundException() {
        super(ErrorCode.NO_PLACES_FOUND, HttpStatus.CONFLICT, "No places nearby match these picks");
    }
}
