package com.mdzvtt.shmap.ai;

import com.mdzvtt.shmap.ai.dto.ChatCompletionRequest;
import com.mdzvtt.shmap.ai.dto.ChatCompletionResponse;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.service.annotation.PostExchange;

@HttpExchange(accept = "application/json", contentType = "application/json")
public interface ChatCompletionsApi {
    @PostExchange("/chat/completions")
    ChatCompletionResponse complete(@RequestBody ChatCompletionRequest request);
}
