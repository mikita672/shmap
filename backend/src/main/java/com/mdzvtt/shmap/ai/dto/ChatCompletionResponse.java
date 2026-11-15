package com.mdzvtt.shmap.ai.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public record ChatCompletionResponse(String model, List<Choice> choices, Usage usage) {

    public record Choice(Message message, @JsonProperty("finish_reason") String finishReason) {
    }

    public record Message(String content) {
    }

    public record Usage(
            @JsonProperty("prompt_tokens") Integer promptTokens,
            @JsonProperty("completion_tokens") Integer completionTokens,
            @JsonProperty("total_tokens") Integer totalTokens) {
    }
}
