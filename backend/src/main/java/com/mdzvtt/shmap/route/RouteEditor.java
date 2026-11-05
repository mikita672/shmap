package com.mdzvtt.shmap.route;

import com.mdzvtt.shmap.directions.RoutingEngine;
import com.mdzvtt.shmap.directions.RoutingRequest;
import com.mdzvtt.shmap.place.PlaceSnapshot;
import com.mdzvtt.shmap.route.dto.RouteResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RouteEditor {
    private final RouteService routeService;
    private final RoutingEngine routingEngine;

    public RouteResponse addStop(Integer userId, Long routeId, PlaceSnapshot place) {
        routeService.addStop(userId, routeId, place).ifPresent(request -> buildPath(routeId, request));
        return routeService.getRoute(userId, routeId);
    }

    public RouteResponse removeStop(Integer userId, Long routeId, Long stopId) {
        routeService.removeStop(userId, routeId, stopId).ifPresent(request -> buildPath(routeId, request));
        return routeService.getRoute(userId, routeId);
    }

    public RouteResponse reorderStops(Integer userId, Long routeId, List<Long> stopIds) {
        routeService.reorderStops(userId, routeId, stopIds).ifPresent(request -> buildPath(routeId, request));
        return routeService.getRoute(userId, routeId);
    }

    public RouteResponse retryPath(Integer userId, Long routeId) {
        routeService.pathToRetry(userId, routeId).ifPresent(request -> buildPath(routeId, request));
        return routeService.getRoute(userId, routeId);
    }

    private void buildPath(Long routeId, RoutingRequest request) {
        routeService.savePath(routeId, request, routingEngine.route(request));
    }
}
