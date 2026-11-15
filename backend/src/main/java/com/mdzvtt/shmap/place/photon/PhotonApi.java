package com.mdzvtt.shmap.place.photon;

import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;

@HttpExchange(accept = "application/json")
public interface PhotonApi {
    @GetExchange("/api")
    PhotonResponse search(@RequestParam String include, @RequestParam String bbox, @RequestParam int limit,
            @RequestParam String lang);
}
