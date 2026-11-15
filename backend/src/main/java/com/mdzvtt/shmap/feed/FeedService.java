package com.mdzvtt.shmap.feed;

import com.mdzvtt.shmap.feed.dto.FeedPageResponse;
import com.mdzvtt.shmap.feed.dto.FeedRouteResponse;
import com.mdzvtt.shmap.feed.dto.RoutePointResponse;
import com.mdzvtt.shmap.route.Route;
import com.mdzvtt.shmap.route.RouteCompletion;
import com.mdzvtt.shmap.route.RouteRepository;
import com.mdzvtt.shmap.route.dto.RoutePathResponse;
import com.mdzvtt.shmap.storage.StorageService;
import com.mdzvtt.shmap.user.User;
import com.mdzvtt.shmap.user.dto.UserSummaryResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Limit;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FeedService {
    private static final int PAGE_SIZE = 20;

    private final RouteRepository routeRepository;
    private final StorageService storageService;

    @Transactional(readOnly = true)
    public FeedPageResponse getFeed(Integer viewerId) {
        List<Long> ids = routeRepository.findFeedIds(viewerId, Limit.of(PAGE_SIZE));
        if (ids.isEmpty()) {
            return new FeedPageResponse(List.of(), null);
        }
        Map<Long, Route> routesById = routeRepository.findWithParticipantsAndStopsByIdIn(ids).stream()
                .collect(Collectors.toMap(Route::getId, Function.identity()));
        List<FeedRouteResponse> routes = ids.stream()
                .map(routesById::get)
                .filter(Objects::nonNull)
                .map(this::toResponse)
                .toList();
        return new FeedPageResponse(routes, null);
    }

    private FeedRouteResponse toResponse(Route route) {
        RouteCompletion completion = route.getCompletion();
        return new FeedRouteResponse(
                route.getId(),
                route.getName(),
                route.getTravelMode(),
                RoutePathResponse.from(route.getPathStatus(), route.getPath()),
                route.getStops().stream()
                        .map(stop -> new RoutePointResponse(stop.getPlace().latitude(), stop.getPlace().longitude()))
                        .toList(),
                completion.finishedOn(),
                completion.completedAt(),
                route.getParticipants().stream()
                        .sorted(Comparator.comparing(User::getId))
                        .map(this::toSummary)
                        .toList());
    }

    private UserSummaryResponse toSummary(User user) {
        return UserSummaryResponse.from(user, storageService.publicUrl(user.getAvatarKey()));
    }
}
