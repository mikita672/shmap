package com.mdzvtt.shmap.directions;

public sealed interface RoutingResult {

    record Found(String polyline, int distanceMeters, int durationSeconds) implements RoutingResult {
    }

    record NoRoute() implements RoutingResult {
    }

    record Unavailable() implements RoutingResult {
    }
}
