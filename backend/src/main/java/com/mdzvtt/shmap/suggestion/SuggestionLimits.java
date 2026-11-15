package com.mdzvtt.shmap.suggestion;

import jakarta.validation.constraints.Positive;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@Validated
@ConfigurationProperties("ai.limits")
public record SuggestionLimits(@Positive int perUserDaily, @Positive int globalDaily) {
}
