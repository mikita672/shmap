package com.mdzvtt.shmap.push.expo;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.service.annotation.PostExchange;

import java.util.List;

@HttpExchange(accept = "application/json", contentType = "application/json")
public interface ExpoPushApi {
    @PostExchange("/--/api/v2/push/send")
    ExpoPushResponse send(@RequestBody List<ExpoPushMessage> messages);
}
