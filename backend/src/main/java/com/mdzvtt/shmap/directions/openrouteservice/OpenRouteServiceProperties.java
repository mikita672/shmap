package com.mdzvtt.shmap.directions.openrouteservice;

import jakarta.validation.constraints.NotBlank;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@Validated
@ConfigurationProperties("directions.openrouteservice")
public record OpenRouteServiceProperties(@NotBlank String apiKey) {
}
