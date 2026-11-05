package com.mdzvtt.shmap.directions.openrouteservice;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.web.client.support.RestClientHttpServiceGroupConfigurer;
import org.springframework.web.service.registry.ImportHttpServices;

@Configuration
@EnableConfigurationProperties(OpenRouteServiceProperties.class)
@ImportHttpServices(group = OpenRouteServiceConfig.GROUP, types = OpenRouteServiceApi.class)
public class OpenRouteServiceConfig {
    static final String GROUP = "openrouteservice";

    @Bean
    public RestClientHttpServiceGroupConfigurer openRouteServiceAuthorization(OpenRouteServiceProperties properties) {
        return groups -> groups.filterByName(GROUP)
                .forEachClient((group, client) -> client.defaultHeader(HttpHeaders.AUTHORIZATION, properties.apiKey()));
    }
}
