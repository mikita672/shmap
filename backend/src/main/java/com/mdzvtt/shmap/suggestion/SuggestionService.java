package com.mdzvtt.shmap.suggestion;

import com.mdzvtt.shmap.exception.NoPlacesFoundException;
import com.mdzvtt.shmap.suggestion.dto.RouteSuggestionsResponse;
import com.mdzvtt.shmap.suggestion.dto.SuggestRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SuggestionService {
    private final SuggestionStore store;
    private final CandidateFinder candidateFinder;
    private final SuggestionLimiter limiter;
    private final PlacePicker placePicker;

    public RouteSuggestionsResponse suggest(Integer userId, Long routeId, SuggestRequest request) {
        SuggestionInput input = store.prepare(userId, routeId, request.near());
        List<Candidate> candidates = candidateFinder.find(input.area(), input.allPicks(), input.osmIdsOnRoute());
        if (candidates.isEmpty()) {
            throw new NoPlacesFoundException();
        }
        limiter.count(userId);
        Picks picks = placePicker.pick(input.travelMode(), input.stopNames(), input.memberPicks(), request.note(),
                candidates);
        return store.save(userId, routeId, request.note(), picks);
    }
}
