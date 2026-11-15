package com.mdzvtt.shmap.push.expo;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties("push.expo")
public record ExpoPushProperties(String accessToken) {
}
