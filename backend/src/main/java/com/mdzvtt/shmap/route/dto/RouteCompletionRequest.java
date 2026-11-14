package com.mdzvtt.shmap.route.dto;

import com.mdzvtt.shmap.route.RouteVisibility;
import com.mdzvtt.shmap.validation.NotInFuture;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.Set;

public record RouteCompletionRequest(
                @NotNull(message = "Date is required") @NotInFuture LocalDate finishedOn,
                @NotEmpty(message = "Pick at least one person who took part") Set<@NotNull(message = "Participant id must not be null") Integer> participantIds,
                @NotNull(message = "Visibility is required") RouteVisibility visibility) {
}
