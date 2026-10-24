package com.mdzvtt.shmap.realtime;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

import java.time.Duration;

@Validated
@ConfigurationProperties("app.realtime")
public record RealtimeProperties(
        @NotNull Duration streamTimeout,
        @NotNull Duration heartbeatInterval,
        @Positive int maxStreamsPerUser) {
}
