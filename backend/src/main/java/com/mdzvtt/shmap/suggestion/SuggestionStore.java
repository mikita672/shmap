package com.mdzvtt.shmap.suggestion;

import com.mdzvtt.shmap.exception.RouteNotFoundException;
import com.mdzvtt.shmap.exception.RouteSuggestionsNotFoundException;
import com.mdzvtt.shmap.place.dto.PlaceResponse;
import com.mdzvtt.shmap.route.Route;
import com.mdzvtt.shmap.route.RouteRepository;
import com.mdzvtt.shmap.storage.StorageService;
import com.mdzvtt.shmap.suggestion.dto.RouteSuggestionResponse;
import com.mdzvtt.shmap.suggestion.dto.RouteSuggestionsResponse;
import com.mdzvtt.shmap.user.User;
import com.mdzvtt.shmap.user.dto.UserSummaryResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SuggestionStore {
    private final RouteRepository routeRepository;
    private final RouteSuggestionSetRepository suggestionSetRepository;
    private final StorageService storageService;

    @Transactional(readOnly = true)
    public RouteSuggestionsResponse get(Integer userId, Long routeId) {
        Route route = routeRepository.findForMember(routeId, userId).orElseThrow(RouteNotFoundException::new);
        RouteSuggestionSet set = suggestionSetRepository.findByRouteId(routeId)
                .orElseThrow(RouteSuggestionsNotFoundException::new);
        return toResponse(set, osmIdsOn(route));
    }

    private RouteSuggestionsResponse toResponse(RouteSuggestionSet set, Set<String> osmIdsOnRoute) {
        return new RouteSuggestionsResponse(
                toSummary(set.getSuggestedBy()),
                set.getSuggestedAt(),
                set.getNote(),
                set.getModel(),
                set.getSuggestions().stream()
                        .filter(suggestion -> !osmIdsOnRoute.contains(suggestion.getPlace().osmId()))
                        .map(suggestion -> new RouteSuggestionResponse(
                                suggestion.getId(),
                                PlaceResponse.from(suggestion.getPlace()),
                                suggestion.getCategory(),
                                suggestion.getReason()))
                        .toList());
    }

    private static Set<String> osmIdsOn(Route route) {
        return route.getStops().stream()
                .map(stop -> stop.getPlace().osmId())
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());
    }

    private UserSummaryResponse toSummary(User user) {
        return UserSummaryResponse.from(user, storageService.publicUrl(user.getAvatarKey()));
    }
}
