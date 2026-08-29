package com.mdzvtt.shmap.auth;

import java.util.Map;

import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;

import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;

@Service
public class GoogleAuthService {
    private final OkHttpClient httpClient;
    private final ObjectMapper objectMapper;
    private final String GOOGLE_CLIENT_ID = ""; // TODO: add key

    public GoogleAuthService(OkHttpClient httpClient, ObjectMapper objectMapper) {
        this.httpClient = httpClient;
        this.objectMapper = objectMapper;
    }

    public String verifyAndLogin(String idTokenString) throws Exception {
        Request request = new Request.Builder()
                .url("http://oauth2.googleapis.com/tokeninfo?id_token=" + idTokenString)
                .build();

        try (Response response = httpClient.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                throw new IllegalArgumentException("Invalid Google token");
            }

            Map<String, Object> payload = objectMapper.readValue(response.body().string(), Map.class);

            if (!GOOGLE_CLIENT_ID.equals(payload.get("aud"))) {
                throw new IllegalArgumentException("Audience mismatch");
            }

            String email = (String) payload.get("email");
            String name = (String) payload.get("name");
            String picture = (String) payload.get("picture");

            // TODO: Creation of the user in DB

            // TODO: Generate and return JWT

            return generateCustomJwt(email);
        }

    }

    private String generateCustomJwt(String email) {
        return "your.generated.jwt";
    }
}
