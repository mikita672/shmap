package com.mdzvtt.shmap.feed;

import com.mdzvtt.shmap.feed.dto.FeedMapResponse;
import com.mdzvtt.shmap.feed.dto.FeedPageResponse;
import com.mdzvtt.shmap.route.RouteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Limit;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FeedService {
    private static final int MAP_LIMIT = 200;

    private final RouteRepository routeRepository;
    private final RouteCardPages routeCardPages;

    @Transactional(readOnly = true, isolation = Isolation.REPEATABLE_READ)
    public FeedPageResponse getFeed(Integer viewerId, String cursor) {
        return routeCardPages.load(viewerId, cursor, (after, limit) -> after == null
                ? routeRepository.findFeedKeys(viewerId, limit)
                : routeRepository.findFeedKeysBefore(viewerId, after.completedAt(), after.routeId(), limit));
    }

    @Transactional(readOnly = true, isolation = Isolation.REPEATABLE_READ)
    public FeedMapResponse getMap(Integer viewerId) {
        List<Long> ids = routeRepository.findFeedKeys(viewerId, Limit.of(MAP_LIMIT)).stream()
                .map(key -> key.routeId())
                .toList();
        return new FeedMapResponse(routeCardPages.cards(viewerId, null, ids));
    }
}
