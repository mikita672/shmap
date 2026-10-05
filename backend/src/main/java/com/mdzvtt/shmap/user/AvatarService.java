package com.mdzvtt.shmap.user;

import com.mdzvtt.shmap.exception.InvalidAvatarException;
import com.mdzvtt.shmap.storage.PresignedUpload;
import com.mdzvtt.shmap.storage.StorageProperties;
import com.mdzvtt.shmap.storage.StorageService;
import com.mdzvtt.shmap.user.dto.AvatarUploadRequest;
import com.mdzvtt.shmap.user.dto.AvatarUploadResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AvatarService {
        private static final Map<String, String> EXTENSIONS_BY_CONTENT_TYPE = Map.of(
                        "image/jpeg", "jpg",
                        "image/png", "png",
                        "image/webp", "webp");

        private final StorageService storageService;
        private final StorageProperties storageProperties;

        public AvatarUploadResponse createUploadUrl(Integer userId, AvatarUploadRequest request) {
                String extension = extensionFor(request.contentType());
                validateSize(request.contentLength());

                String key = keyPrefix(userId) + UUID.randomUUID() + "." + extension;
                PresignedUpload upload = storageService.presignUpload(
                                key,
                                request.contentType(),
                                request.contentLength(),
                                storageProperties.avatar().uploadUrlTtl());

                return new AvatarUploadResponse(upload.url(), key, upload.expiresAt());
        }

        private String extensionFor(String contentType) {
                String extension = EXTENSIONS_BY_CONTENT_TYPE.get(contentType);
                if (extension == null) {
                        throw new InvalidAvatarException("Avatar must be a JPEG, PNG or WebP image");
                }
                return extension;
        }

        private void validateSize(long sizeBytes) {
                long maxSizeBytes = storageProperties.avatar().maxSizeBytes();
                if (sizeBytes > maxSizeBytes) {
                        throw new InvalidAvatarException(
                                        "Avatar must be at most " + maxSizeBytes / (1024 * 1024) + " MB");
                }
        }

        private static String keyPrefix(Integer userId) {
                return "avatars/" + userId + "/";
        }
}
