package com.mdzvtt.shmap.ai.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ChatCompletionRequest(
                String model,
                List<ChatMessage> messages,
                @JsonProperty("response_format") ResponseFormat responseFormat,
                @JsonProperty("reasoning_effort") String reasoningEffort,
                Double temperature) {
}
