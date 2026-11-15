package com.mdzvtt.shmap.suggestion;

import com.mdzvtt.shmap.suggestion.dto.RouteSuggestionsResponse;
import com.mdzvtt.shmap.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class SuggestionController {
    private final SuggestionStore suggestionStore;

    @GetMapping("/routes/{routeId}/suggestions")
    public RouteSuggestionsResponse getSuggestions(@AuthenticationPrincipal User user, @PathVariable Long routeId) {
        return suggestionStore.get(user.getId(), routeId);
    }
}
