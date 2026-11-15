package com.mdzvtt.shmap.suggestion;

import com.mdzvtt.shmap.directions.TravelMode;
import com.mdzvtt.shmap.place.PlaceCategory;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class SuggestionPrompt {
    private static final String LOCATION = "ai/place-suggestions-prompt.md";

    private final String systemMessage;

    public SuggestionPrompt() throws IOException {
        systemMessage = new ClassPathResource(LOCATION).getContentAsString(StandardCharsets.UTF_8).strip();
    }

    public String systemMessage() {
        return systemMessage;
    }

    public String userMessage(TravelMode travelMode, List<String> stopNames, List<Set<PlaceCategory>> memberPicks,
            String note, List<Candidate> candidates) {
        StringBuilder message = new StringBuilder();
        message.append("Travel mode: ").append(travelMode.name().toLowerCase(Locale.ROOT)).append('\n');

        message.append("Already on the route:");
        if (stopNames.isEmpty()) {
            message.append(" nothing yet");
        }
        for (int i = 0; i < stopNames.size(); i++) {
            message.append(i == 0 ? " " : "; ").append(i + 1).append(". ").append(clean(stopNames.get(i)));
        }
        message.append('\n');

        message.append("Members' picks:\n");
        for (int i = 0; i < memberPicks.size(); i++) {
            message.append("- ").append(memberLabel(i)).append(": ")
                    .append(memberPicks.get(i).stream().map(Enum::name).collect(Collectors.joining(", ")))
                    .append('\n');
        }

        if (note != null && !note.isBlank()) {
            message.append("Note from the person asking: \"").append(clean(note)).append("\"\n");
        }

        message.append("Candidates (id | name | category | distance):\n");
        for (Candidate candidate : candidates) {
            message.append(candidate.id()).append(" | ")
                    .append(clean(candidate.place().name())).append(" | ")
                    .append(candidate.category().name()).append(" | ")
                    .append(distance(candidate.distanceMeters())).append('\n');
        }
        return message.toString();
    }

    private static String memberLabel(int index) {
        return index < 26 ? "Member " + (char) ('A' + index) : "Member " + (index + 1);
    }

    private static String distance(int meters) {
        if (meters < 1000) {
            return meters + " m";
        }
        return String.format(Locale.ROOT, "%.1f km", meters / 1000.0);
    }

    private static String clean(String text) {
        return text.replaceAll("[|\"\\s]+", " ").strip();
    }
}
