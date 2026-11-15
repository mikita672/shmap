package com.mdzvtt.shmap.place.photon;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.service.registry.ImportHttpServices;

@Configuration
@ImportHttpServices(group = "photon", types = PhotonApi.class)
public class PhotonConfig {
}
