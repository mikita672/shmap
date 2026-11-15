package com.mdzvtt.shmap.ai;

import jakarta.validation.constraints.NotBlank;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@Validated
@ConfigurationProperties("ai")
public record AiProperties(
                @NotBlank String baseUrl,
                @NotBlank String model,
                @NotBlank String apiKey,
                String reasoningEffort) {
}
