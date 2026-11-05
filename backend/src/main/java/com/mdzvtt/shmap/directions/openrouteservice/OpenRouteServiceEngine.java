package com.mdzvtt.shmap.directions.openrouteservice;

import com.mdzvtt.shmap.directions.RoutingEngine;
import com.mdzvtt.shmap.directions.RoutingRequest;
import com.mdzvtt.shmap.directions.RoutingResult;
import com.mdzvtt.shmap.directions.TravelMode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClientException;

import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class OpenRouteServiceEngine implements RoutingEngine {
    private static final List<Integer> NEAREST_ROAD = List.of(-1);

    private final OpenRouteServiceApi api;

    @Override
    public RoutingResult route(RoutingRequest request) {
        try {
            OrsDirectionsResponse response = api.directions(profile(request.travelMode()), toOrs(request));
            return found(response);
        } catch (RestClientException e) {
            log.warn("openrouteservice call failed: {}", e.getMessage());
            return new RoutingResult.Unavailable();
        }
    }

    private static String profile(TravelMode travelMode) {
        return switch (travelMode) {
            case WALKING -> "foot-walking";
            case DRIVING -> "driving-car";
        };
    }

    private static OrsDirectionsRequest toOrs(RoutingRequest request) {
        List<List<Double>> coordinates = request.waypoints().stream()
                .map(waypoint -> List.of(waypoint.longitude(), waypoint.latitude()))
                .toList();
        return new OrsDirectionsRequest(coordinates, false, NEAREST_ROAD);
    }

    private static RoutingResult found(OrsDirectionsResponse response) {
        if (response == null || response.routes() == null || response.routes().isEmpty()) {
            log.warn("openrouteservice returned no routes");
            return new RoutingResult.Unavailable();
        }
        OrsDirectionsResponse.Route route = response.routes().getFirst();
        OrsDirectionsResponse.Summary summary = route.summary();
        return new RoutingResult.Found(
                route.geometry(),
                round(summary == null ? null : summary.distance()),
                round(summary == null ? null : summary.duration()));
    }

    private static int round(Double value) {
        return value == null ? 0 : (int) Math.round(value);
    }
}
