package com.mdzvtt.shmap.directions.openrouteservice;

public record OrsErrorResponse(Error error) {

    public record Error(Integer code, String message) {
    }
}
