package com.mdzvtt.shmap.suggestion;

import com.mdzvtt.shmap.ai.AiUnavailableException;
import com.mdzvtt.shmap.ai.StructuredChat;
import com.mdzvtt.shmap.ai.StructuredReply;
import com.mdzvtt.shmap.directions.TravelMode;
import com.mdzvtt.shmap.exception.SuggestionsUnavailableException;
import com.mdzvtt.shmap.place.PlaceCategory;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import tools.jackson.core.JacksonException;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.json.JsonMapper;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Slf4j
@Component
@RequiredArgsConstructor
public class PlacePicker {
    public static final int MAX_PICKS = 8;
    public static final int MAX_REASON_LENGTH = 200;

    private final StructuredChat chat;
    private final PlaceSuggestionsSchema schema;
    private final SuggestionPrompt prompt;
    private final JsonMapper jsonMapper;

    public Picks pick(TravelMode travelMode, List<String> stopNames, List<Set<PlaceCategory>> memberPicks,
            String note, List<Candidate> candidates) {
        Map<String, Candidate> byId = new LinkedHashMap<>();
        candidates.forEach(candidate -> byId.put(candidate.id(), candidate));

        StructuredReply reply;
        try {
            reply = chat.complete(
                    prompt.systemMessage(),
                    prompt.userMessage(travelMode, stopNames, memberPicks, note, candidates),
                    PlaceSuggestionsSchema.NAME,
                    schema.requestCopy(List.copyOf(byId.keySet())));
        } catch (AiUnavailableException e) {
            throw new SuggestionsUnavailableException(e.getRetryAfterSeconds());
        }

        Reply parsed = parse(reply);
        List<Pick> picks = new ArrayList<>();
        Set<String> used = new HashSet<>();
        int unknown = 0;
        for (Reply.Item item : parsed.suggestions()) {
            Candidate candidate = byId.get(item.candidateId());
            if (candidate == null) {
                unknown++;
            } else if (used.add(candidate.id()) && picks.size() < MAX_PICKS) {
                picks.add(new Pick(candidate, shorten(item.reason())));
            }
        }
        if (unknown > 0) {
            log.warn("{} picked {} ids that are not candidates", reply.model(), unknown);
        }
        if (picks.isEmpty()) {
            log.warn("{} returned no usable picks", reply.model());
            throw new SuggestionsUnavailableException();
        }
        return new Picks(reply.model(), picks);
    }

    private Reply parse(StructuredReply reply) {
        try {
            JsonNode json = jsonMapper.readTree(reply.content());
            List<String> errors = schema.validate(json);
            if (!errors.isEmpty()) {
                log.warn("{} reply does not match the schema: {}", reply.model(), errors);
                throw new SuggestionsUnavailableException();
            }
            return jsonMapper.treeToValue(json, Reply.class);
        } catch (JacksonException e) {
            log.warn("{} reply is not valid JSON: {}", reply.model(), e.getOriginalMessage());
            throw new SuggestionsUnavailableException();
        }
    }

    private static String shorten(String reason) {
        String stripped = reason.strip();
        return stripped.length() > MAX_REASON_LENGTH ? stripped.substring(0, MAX_REASON_LENGTH - 1) + "…" : stripped;
    }

    record Reply(List<Item> suggestions) {
        record Item(String candidateId, String reason) {
        }
    }
}
