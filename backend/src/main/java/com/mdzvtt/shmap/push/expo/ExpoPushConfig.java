package com.mdzvtt.shmap.push.expo;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.web.client.support.RestClientHttpServiceGroupConfigurer;
import org.springframework.web.service.registry.ImportHttpServices;

@Configuration
@EnableConfigurationProperties(ExpoPushProperties.class)
@ImportHttpServices(group = ExpoPushConfig.GROUP, types = ExpoPushApi.class)
public class ExpoPushConfig {
    static final String GROUP = "expo";

    @Bean
    public RestClientHttpServiceGroupConfigurer expoPushAuthorization(ExpoPushProperties properties) {
        return groups -> groups.filterByName(GROUP).forEachClient((group, client) -> {
            String accessToken = properties.accessToken();
            if (accessToken != null && !accessToken.isBlank()) {
                client.defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken);
            }
        });
    }
}
