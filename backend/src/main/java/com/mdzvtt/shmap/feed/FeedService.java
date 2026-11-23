package com.mdzvtt.shmap.feed;

import com.mdzvtt.shmap.feed.dto.FeedPageResponse;
import com.mdzvtt.shmap.route.RouteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class FeedService {
    private final RouteRepository routeRepository;
    private final RouteCardPages routeCardPages;

    @Transactional(readOnly = true, isolation = Isolation.REPEATABLE_READ)
    public FeedPageResponse getFeed(Integer viewerId, String cursor) {
        return routeCardPages.load(viewerId, cursor, (after, limit) -> after == null
                ? routeRepository.findFeedKeys(viewerId, limit)
                : routeRepository.findFeedKeysBefore(viewerId, after.completedAt(), after.routeId(), limit));
    }
}
