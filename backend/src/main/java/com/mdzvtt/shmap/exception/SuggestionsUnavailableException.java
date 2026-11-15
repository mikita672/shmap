package com.mdzvtt.shmap.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class SuggestionsUnavailableException extends AppException implements RetryAfter {
    private final Long retryAfterSeconds;

    public SuggestionsUnavailableException() {
        this(null);
    }

    public SuggestionsUnavailableException(Long retryAfterSeconds) {
        super(ErrorCode.SUGGESTIONS_UNAVAILABLE, HttpStatus.SERVICE_UNAVAILABLE,
                "Suggestions are unavailable right now. Try again later");
        this.retryAfterSeconds = retryAfterSeconds;
    }
}
