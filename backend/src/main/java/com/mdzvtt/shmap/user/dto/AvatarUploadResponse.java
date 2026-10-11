package com.mdzvtt.shmap.user.dto;

import java.time.Instant;

public record AvatarUploadResponse(String uploadUrl, String key, Instant expiresAt) {
}
