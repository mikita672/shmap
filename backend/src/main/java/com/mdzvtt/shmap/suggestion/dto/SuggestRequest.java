package com.mdzvtt.shmap.suggestion.dto;

import com.mdzvtt.shmap.suggestion.RouteSuggestionSet;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Size;

public record SuggestRequest(
        @Size(max = RouteSuggestionSet.MAX_NOTE_LENGTH, message = "Note must be at most 200 characters") String note,

        @Valid NearRequest near) {

    public SuggestRequest {
        note = note == null || note.isBlank() ? null : note.strip();
    }
}
