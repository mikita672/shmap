package com.mdzvtt.shmap.ai;

import com.mdzvtt.shmap.ai.dto.ChatCompletionRequest;
import com.mdzvtt.shmap.ai.dto.ChatCompletionResponse;
import com.mdzvtt.shmap.ai.dto.ChatMessage;
import com.mdzvtt.shmap.ai.dto.ResponseFormat;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestClientResponseException;
import tools.jackson.databind.JsonNode;

import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class StructuredChat {
    private static final int MAX_LOGGED_BODY = 300;

    private final ChatCompletionsApi api;
    private final AiProperties properties;

    public StructuredReply complete(String system, String user, String schemaName, JsonNode schema) {
        ChatCompletionRequest request = new ChatCompletionRequest(
                properties.model(),
                List.of(ChatMessage.system(system), ChatMessage.user(user)),
                ResponseFormat.jsonSchema(schemaName, schema),
                blankToNull(properties.reasoningEffort()),
                null);

        long started = System.nanoTime();
        ChatCompletionResponse response;
        try {
            response = api.complete(request);
        } catch (HttpClientErrorException.TooManyRequests e) {
            Long retryAfter = retryAfterSeconds(e.getResponseHeaders());
            log.warn("{} is rate limited, retry after {} s", properties.model(), retryAfter);
            throw new AiUnavailableException("rate limited", retryAfter);
        } catch (RestClientResponseException e) {
            log.warn("{} answered {}: {}", properties.model(), e.getStatusCode(), shorten(e.getResponseBodyAsString()));
            throw new AiUnavailableException("answered " + e.getStatusCode());
        } catch (RestClientException e) {
            log.warn("{} call failed: {}", properties.model(), e.getMessage());
            throw new AiUnavailableException("call failed");
        }
        long millis = (System.nanoTime() - started) / 1_000_000;

        ChatCompletionResponse.Choice choice = response == null || response.choices() == null
                || response.choices().isEmpty() ? null : response.choices().getFirst();
        ChatCompletionResponse.Usage usage = response == null ? null : response.usage();
        String model = response != null && response.model() != null ? response.model() : properties.model();
        log.info("{} answered in {} ms: prompt {} + completion {} = {} tokens, finish {}", model, millis,
                usage == null ? null : usage.promptTokens(),
                usage == null ? null : usage.completionTokens(),
                usage == null ? null : usage.totalTokens(),
                choice == null ? null : choice.finishReason());

        if (choice == null || choice.message() == null || choice.message().content() == null
                || choice.message().content().isBlank()) {
            throw new AiUnavailableException("empty answer");
        }
        if ("length".equals(choice.finishReason())) {
            throw new AiUnavailableException("answer cut off");
        }
        return new StructuredReply(model, choice.message().content());
    }

    private static Long retryAfterSeconds(HttpHeaders headers) {
        String value = headers == null ? null : headers.getFirst(HttpHeaders.RETRY_AFTER);
        if (value == null) {
            return null;
        }
        try {
            return (long) Math.ceil(Double.parseDouble(value.strip()));
        } catch (NumberFormatException e) {
            return null;
        }
    }

    private static String shorten(String body) {
        if (body == null) {
            return null;
        }
        String oneLine = body.replaceAll("\\s+", " ").strip();
        return oneLine.length() > MAX_LOGGED_BODY ? oneLine.substring(0, MAX_LOGGED_BODY) + "…" : oneLine;
    }

    private static String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value.strip();
    }
}
