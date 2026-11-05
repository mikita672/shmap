package com.mdzvtt.shmap.route;

import com.mdzvtt.shmap.route.dto.AddRouteStopRequest;
import com.mdzvtt.shmap.route.dto.CreateRouteRequest;
import com.mdzvtt.shmap.route.dto.RouteResponse;
import com.mdzvtt.shmap.route.dto.RouteSummaryResponse;
import com.mdzvtt.shmap.user.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class RouteController {
    private final RouteService routeService;

    @GetMapping("/chats/{chatId}/routes")
    public List<RouteSummaryResponse> getRoutes(@AuthenticationPrincipal User user, @PathVariable Long chatId) {
        return routeService.getRoutes(user.getId(), chatId);
    }

    @GetMapping("/routes/{routeId}")
    public RouteResponse getRoute(@AuthenticationPrincipal User user, @PathVariable Long routeId) {
        return routeService.getRoute(user.getId(), routeId);
    }

    @PostMapping("/routes/{routeId}/stops")
    @ResponseStatus(HttpStatus.CREATED)
    public RouteResponse addStop(@AuthenticationPrincipal User user, @PathVariable Long routeId,
            @Valid @RequestBody AddRouteStopRequest request) {
        return routeService.addStop(user.getId(), routeId, request.place().toSnapshot());
    }

    @PostMapping("/chats/{chatId}/routes")
    @ResponseStatus(HttpStatus.CREATED)
    public RouteResponse create(@AuthenticationPrincipal User user, @PathVariable Long chatId,
            @Valid @RequestBody CreateRouteRequest request) {
        return routeService.create(user.getId(), chatId, request.name());
    }
}
