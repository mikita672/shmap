package com.mdzvtt.shmap.suggestion;

import com.mdzvtt.shmap.directions.Waypoint;
import com.mdzvtt.shmap.exception.NoRouteInterestsException;
import com.mdzvtt.shmap.exception.RouteFullException;
import com.mdzvtt.shmap.exception.RouteNotFoundException;
import com.mdzvtt.shmap.exception.RouteSuggestionsNotFoundException;
import com.mdzvtt.shmap.exception.SuggestionAreaRequiredException;
import com.mdzvtt.shmap.place.PlaceCategory;
import com.mdzvtt.shmap.place.dto.PlaceResponse;
import com.mdzvtt.shmap.route.Route;
import com.mdzvtt.shmap.route.RouteInterest;
import com.mdzvtt.shmap.route.RouteInterestRepository;
import com.mdzvtt.shmap.route.RouteRepository;
import com.mdzvtt.shmap.route.RouteService;
import com.mdzvtt.shmap.storage.StorageService;
import com.mdzvtt.shmap.suggestion.dto.NearRequest;
import com.mdzvtt.shmap.suggestion.dto.RouteSuggestionResponse;
import com.mdzvtt.shmap.suggestion.dto.RouteSuggestionsResponse;
import com.mdzvtt.shmap.user.User;
import com.mdzvtt.shmap.user.UserRepository;
import com.mdzvtt.shmap.user.dto.UserSummaryResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.EnumSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.TreeMap;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SuggestionStore {
    private final RouteRepository routeRepository;
    private final RouteService routeService;
    private final RouteInterestRepository routeInterestRepository;
    private final RouteSuggestionSetRepository suggestionSetRepository;
    private final UserRepository userRepository;
    private final StorageService storageService;

    @Transactional(readOnly = true)
    public RouteSuggestionsResponse get(Integer userId, Long routeId) {
        Route route = routeRepository.findForMember(routeId, userId).orElseThrow(RouteNotFoundException::new);
        RouteSuggestionSet set = suggestionSetRepository.findByRouteId(routeId)
                .orElseThrow(RouteSuggestionsNotFoundException::new);
        return toResponse(set, osmIdsOn(route));
    }

    @Transactional(readOnly = true)
    public SuggestionInput prepare(Integer userId, Long routeId, NearRequest near) {
        Route route = routeService.findEditable(userId, routeId);
        route.requirePlanned();
        if (route.getStops().size() >= Route.MAX_STOPS) {
            throw new RouteFullException(Route.MAX_STOPS);
        }
        List<Set<PlaceCategory>> memberPicks = memberPicks(routeId);
        if (memberPicks.isEmpty()) {
            throw new NoRouteInterestsException();
        }
        return new SuggestionInput(
                route.getTravelMode(),
                route.getStops().stream().map(stop -> stop.getPlace().name()).toList(),
                osmIdsOn(route),
                memberPicks,
                searchArea(route, near));
    }

    @Transactional
    public RouteSuggestionsResponse save(Integer userId, Long routeId, String note, Picks picks) {
        Route route = routeService.lockEditable(userId, routeId);
        route.requirePlanned();
        suggestionSetRepository.deleteByRouteId(routeId);
        RouteSuggestionSet set = suggestionSetRepository.saveAndFlush(new RouteSuggestionSet(
                route,
                userRepository.getReferenceById(userId),
                note,
                picks.model(),
                picks.picks().stream()
                        .map(pick -> new RouteSuggestion(pick.candidate().place(), pick.candidate().category(),
                                pick.reason()))
                        .toList()));
        routeService.announceChanged(route);
        return toResponse(set, osmIdsOn(route));
    }

    private List<Set<PlaceCategory>> memberPicks(Long routeId) {
        Map<Integer, Set<PlaceCategory>> byUser = routeInterestRepository.findForCurrentMembers(routeId).stream()
                .collect(Collectors.groupingBy(
                        interest -> interest.getUser().getId(),
                        TreeMap::new,
                        Collectors.mapping(RouteInterest::getCategory,
                                Collectors.toCollection(() -> EnumSet.noneOf(PlaceCategory.class)))));
        return List.copyOf(byUser.values());
    }

    private static SearchArea searchArea(Route route, NearRequest near) {
        if (!route.getStops().isEmpty()) {
            return SearchArea.around(route.getStops().stream()
                    .map(stop -> new Waypoint(stop.getPlace().latitude(), stop.getPlace().longitude()))
                    .toList(), route.getTravelMode());
        }
        if (near == null) {
            throw new SuggestionAreaRequiredException();
        }
        return SearchArea.near(near.latitude(), near.longitude(), route.getTravelMode());
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
