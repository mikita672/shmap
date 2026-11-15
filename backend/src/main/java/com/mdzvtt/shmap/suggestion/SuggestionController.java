package com.mdzvtt.shmap.suggestion;

import com.mdzvtt.shmap.suggestion.dto.RouteSuggestionsResponse;
import com.mdzvtt.shmap.suggestion.dto.SuggestRequest;
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

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class SuggestionController {
    private final SuggestionStore suggestionStore;
    private final SuggestionService suggestionService;

    @GetMapping("/routes/{routeId}/suggestions")
    public RouteSuggestionsResponse getSuggestions(@AuthenticationPrincipal User user, @PathVariable Long routeId) {
        return suggestionStore.get(user.getId(), routeId);
    }

    @PostMapping("/routes/{routeId}/suggestions")
    @ResponseStatus(HttpStatus.CREATED)
    public RouteSuggestionsResponse suggest(@AuthenticationPrincipal User user, @PathVariable Long routeId,
            @Valid @RequestBody SuggestRequest request) {
        return suggestionService.suggest(user.getId(), routeId, request);
    }
}
