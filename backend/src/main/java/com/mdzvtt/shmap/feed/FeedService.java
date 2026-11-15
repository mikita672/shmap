package com.mdzvtt.shmap.feed;

import com.mdzvtt.shmap.feed.dto.FeedPageResponse;
import com.mdzvtt.shmap.feed.dto.FeedRouteResponse;
import com.mdzvtt.shmap.feed.dto.RoutePointResponse;
import com.mdzvtt.shmap.friend.Friendship;
import com.mdzvtt.shmap.friend.FriendshipRepository;
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

import java.text.Collator;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FeedService {
    private static final int PAGE_SIZE = 20;
    private static final Locale NAME_LOCALE = Locale.forLanguageTag("pl");

    private final RouteRepository routeRepository;
    private final FriendshipRepository friendshipRepository;
    private final StorageService storageService;

    @Transactional(readOnly = true)
    public FeedPageResponse getFeed(Integer viewerId) {
        List<Long> ids = routeRepository.findFeedIds(viewerId, Limit.of(PAGE_SIZE));
        if (ids.isEmpty()) {
            return new FeedPageResponse(List.of(), null);
        }
        Map<Long, Route> routesById = routeRepository.findWithParticipantsAndStopsByIdIn(ids).stream()
                .collect(Collectors.toMap(Route::getId, Function.identity()));
        Comparator<User> participantOrder = participantOrder(viewerId, routesById.values());
        List<FeedRouteResponse> routes = ids.stream()
                .map(routesById::get)
                .filter(Objects::nonNull)
                .map(route -> toResponse(route, participantOrder))
                .toList();
        return new FeedPageResponse(routes, null);
    }

    private Comparator<User> participantOrder(Integer viewerId, Iterable<Route> routes) {
        Set<Integer> participantIds = new HashSet<>();
        routes.forEach(route -> route.getParticipants().forEach(user -> participantIds.add(user.getId())));
        Map<Integer, Friendship> friendshipsByFriendId = friendshipRepository
                .findAllByUserIdAndFriendIdIn(viewerId, participantIds).stream()
                .collect(Collectors.toMap(friendship -> friendship.getFriend().getId(), Function.identity()));

        Collator collator = Collator.getInstance(NAME_LOCALE);
        collator.setStrength(Collator.SECONDARY);
        Comparator<String> byText = Comparator.nullsLast(collator::compare);

        return Comparator.<User>comparingInt(user -> rank(user, viewerId, friendshipsByFriendId))
                .thenComparing(User::getFirstName, byText)
                .thenComparing(User::getLastName, byText)
                .thenComparing(User::getPublicUsername, byText)
                .thenComparing(User::getId);
    }

    private int rank(User user, Integer viewerId, Map<Integer, Friendship> friendshipsByFriendId) {
        Friendship friendship = friendshipsByFriendId.get(user.getId());
        if (friendship != null && !friendship.isMuted()) {
            return friendship.isFavorite() ? 0 : 1;
        }
        return user.getId().equals(viewerId) ? 2 : 3;
    }

    private FeedRouteResponse toResponse(Route route, Comparator<User> participantOrder) {
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
                        .sorted(participantOrder)
                        .map(this::toSummary)
                        .toList());
    }

    private UserSummaryResponse toSummary(User user) {
        return UserSummaryResponse.from(user, storageService.publicUrl(user.getAvatarKey()));
    }
}
