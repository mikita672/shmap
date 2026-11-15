package com.mdzvtt.shmap.suggestion.dto;

import com.mdzvtt.shmap.user.dto.UserSummaryResponse;

import java.time.Instant;
import java.util.List;

public record RouteSuggestionsResponse(
                UserSummaryResponse suggestedBy,
                Instant suggestedAt,
                String note,
                String model,
                List<RouteSuggestionResponse> suggestions) {
}
