package com.mdzvtt.shmap.directions.openrouteservice;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.service.annotation.PostExchange;

@HttpExchange(accept = "application/json", contentType = "application/json")
public interface OpenRouteServiceApi {
    @PostExchange("/v2/directions/{profile}")
    OrsDirectionsResponse directions(@PathVariable String profile, @RequestBody OrsDirectionsRequest request);
}
