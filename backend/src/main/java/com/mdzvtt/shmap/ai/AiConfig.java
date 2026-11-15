package com.mdzvtt.shmap.ai;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.web.client.support.RestClientHttpServiceGroupConfigurer;
import org.springframework.web.service.registry.ImportHttpServices;

@Configuration
@EnableConfigurationProperties(AiProperties.class)
@ImportHttpServices(group = AiConfig.GROUP, types = ChatCompletionsApi.class)
public class AiConfig {
    static final String GROUP = "ai";

    @Bean
    public RestClientHttpServiceGroupConfigurer aiAuthorization(AiProperties properties) {
        return groups -> groups.filterByName(GROUP)
                .forEachClient((group, client) -> client.defaultHeader(HttpHeaders.AUTHORIZATION,
                        "Bearer " + properties.apiKey()));
    }
}
