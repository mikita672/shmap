package com.mdzvtt.shmap.route;

import com.mdzvtt.shmap.directions.RoutingEngine;
import com.mdzvtt.shmap.directions.RoutingRequest;
import com.mdzvtt.shmap.route.dto.RouteResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RouteEditor {
    private final RouteService routeService;
    private final RoutingEngine routingEngine;

    public RouteResponse retryPath(Integer userId, Long routeId) {
        routeService.pathToRetry(userId, routeId).ifPresent(request -> buildPath(routeId, request));
        return routeService.getRoute(userId, routeId);
    }

    private void buildPath(Long routeId, RoutingRequest request) {
        routeService.savePath(routeId, request, routingEngine.route(request));
    }
}
