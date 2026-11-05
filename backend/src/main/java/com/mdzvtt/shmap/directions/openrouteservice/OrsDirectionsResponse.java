package com.mdzvtt.shmap.directions.openrouteservice;

import java.util.List;

public record OrsDirectionsResponse(List<Route> routes) {

    public record Route(Summary summary, String geometry) {
    }

    public record Summary(Double distance, Double duration) {
    }
}
