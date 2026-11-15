package com.mdzvtt.shmap.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class SuggestionLimitException extends AppException implements RetryAfter {
    private final Long retryAfterSeconds;

    private SuggestionLimitException(String message, long retryAfterSeconds) {
        super(ErrorCode.SUGGESTION_LIMIT_REACHED, HttpStatus.TOO_MANY_REQUESTS, message);
        this.retryAfterSeconds = retryAfterSeconds;
    }

    public static SuggestionLimitException forUser(int limit, long retryAfterSeconds) {
        return new SuggestionLimitException(
                "You can ask for suggestions " + limit + " times a day. Try again tomorrow", retryAfterSeconds);
    }

    public static SuggestionLimitException forEveryone(long retryAfterSeconds) {
        return new SuggestionLimitException("Suggestions are used up for today. Try again tomorrow",
                retryAfterSeconds);
    }
}
