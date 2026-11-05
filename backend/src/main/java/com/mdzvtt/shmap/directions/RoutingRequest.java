package com.mdzvtt.shmap.directions;

import java.util.List;

public record RoutingRequest(TravelMode travelMode, List<Waypoint> waypoints) {
}
