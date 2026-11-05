package com.mdzvtt.shmap.route.dto;

import com.mdzvtt.shmap.route.PathStatus;
import com.mdzvtt.shmap.route.RoutePath;

public record RoutePathResponse(
        PathStatus status,
        Integer distanceMeters,
        Integer durationSeconds,
        String polyline) {

    public static RoutePathResponse from(PathStatus status, RoutePath path) {
        if (path == null) {
            return new RoutePathResponse(status, null, null, null);
        }
        return new RoutePathResponse(status, path.distanceMeters(), path.durationSeconds(), path.polyline());
    }
}
