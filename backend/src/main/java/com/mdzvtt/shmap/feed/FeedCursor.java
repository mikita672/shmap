package com.mdzvtt.shmap.feed;

import com.mdzvtt.shmap.exception.InvalidCursorException;

import java.nio.charset.StandardCharsets;
import java.time.DateTimeException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Base64;

public record FeedCursor(Instant completedAt, Long routeId) {
    private static final Base64.Encoder ENCODER = Base64.getUrlEncoder().withoutPadding();
    private static final Base64.Decoder DECODER = Base64.getUrlDecoder();

    public String encode() {
        long micros = ChronoUnit.MICROS.between(Instant.EPOCH, completedAt);
        return ENCODER.encodeToString((micros + ":" + routeId).getBytes(StandardCharsets.UTF_8));
    }

    public static FeedCursor decode(String value) {
        try {
            String[] parts = new String(DECODER.decode(value), StandardCharsets.UTF_8).split(":", -1);
            if (parts.length != 2) {
                throw new InvalidCursorException();
            }
            Instant completedAt = Instant.EPOCH.plus(Long.parseLong(parts[0]), ChronoUnit.MICROS);
            return new FeedCursor(completedAt, Long.parseLong(parts[1]));
        } catch (IllegalArgumentException | DateTimeException | ArithmeticException e) {
            throw new InvalidCursorException();
        }
    }
}
