package com.mdzvtt.shmap.route;

import jakarta.persistence.Embeddable;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;

import java.time.LocalDate;

@Embeddable
public record RouteCompletion(
        LocalDate finishedOn,
        @Enumerated(EnumType.STRING) RouteVisibility visibility) {
}
