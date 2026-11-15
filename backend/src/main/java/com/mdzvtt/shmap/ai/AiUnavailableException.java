package com.mdzvtt.shmap.ai;

import lombok.Getter;

@Getter
public class AiUnavailableException extends RuntimeException {
    private final Long retryAfterSeconds;

    public AiUnavailableException(String message) {
        this(message, null);
    }

    public AiUnavailableException(String message, Long retryAfterSeconds) {
        super(message);
        this.retryAfterSeconds = retryAfterSeconds;
    }
}
