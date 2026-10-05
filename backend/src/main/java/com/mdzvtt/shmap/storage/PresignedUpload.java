package com.mdzvtt.shmap.storage;

import java.time.Instant;

public record PresignedUpload(String url, Instant expiresAt) {
}
