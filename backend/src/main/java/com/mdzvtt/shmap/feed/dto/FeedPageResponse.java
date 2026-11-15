package com.mdzvtt.shmap.feed.dto;

import java.util.List;

public record FeedPageResponse(List<FeedRouteResponse> routes, String nextCursor) {
}
