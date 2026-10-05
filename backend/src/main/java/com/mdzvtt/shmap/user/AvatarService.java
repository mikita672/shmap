package com.mdzvtt.shmap.user;

import com.mdzvtt.shmap.exception.AvatarUploadNotFoundException;
import com.mdzvtt.shmap.exception.InvalidAvatarException;
import com.mdzvtt.shmap.exception.UserNotFoundException;
import com.mdzvtt.shmap.storage.PresignedUpload;
import com.mdzvtt.shmap.storage.StorageProperties;
import com.mdzvtt.shmap.storage.StorageService;
import com.mdzvtt.shmap.storage.StoredObject;
import com.mdzvtt.shmap.user.dto.AvatarUploadRequest;
import com.mdzvtt.shmap.user.dto.AvatarUploadResponse;
import com.mdzvtt.shmap.user.dto.ProfileResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.UUID;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
@Slf4j
public class AvatarService {
        private static final Map<String, String> EXTENSIONS_BY_CONTENT_TYPE = Map.of(
                        "image/jpeg", "jpg",
                        "image/png", "png",
                        "image/webp", "webp");

        private final StorageService storageService;
        private final StorageProperties storageProperties;
        private final UserRepository userRepository;
        private final UserService userService;

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

        public ProfileResponse confirm(Integer userId, String key) {
                if (!isOwnAvatarKey(userId, key)) {
                        throw new AvatarUploadNotFoundException();
                }

                StoredObject stored = storageService.findObject(key)
                                .orElseThrow(AvatarUploadNotFoundException::new);
                try {
                        extensionFor(stored.contentType());
                        validateSize(stored.size());
                } catch (InvalidAvatarException ex) {
                        deleteQuietly(key);
                        throw ex;
                }

                User user = findUser(userId);
                String oldKey = user.getAvatarKey();
                if (key.equals(oldKey)) {
                        return userService.toProfileResponse(user);
                }

                user.setAvatarKey(key);
                userRepository.save(user);

                if (oldKey != null) {
                        deleteQuietly(oldKey);
                }
                return userService.toProfileResponse(user);
        }

        public ProfileResponse remove(Integer userId) {
                User user = findUser(userId);
                String oldKey = user.getAvatarKey();
                if (oldKey == null) {
                        return userService.toProfileResponse(user);
                }

                user.setAvatarKey(null);
                userRepository.save(user);

                deleteQuietly(oldKey);
                return userService.toProfileResponse(user);
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

        private boolean isOwnAvatarKey(Integer userId, String key) {
                String ownKeyPattern = Pattern.quote(keyPrefix(userId)) + "[0-9a-f-]{36}\\.(jpg|png|webp)";
                return key.matches(ownKeyPattern);
        }

        private void deleteQuietly(String key) {
                try {
                        storageService.delete(key);
                } catch (RuntimeException ex) {
                        log.warn("Failed to delete avatar object {}: {}", key, ex.getMessage());
                }
        }

        private User findUser(Integer userId) {
                return userRepository.findById(userId).orElseThrow(UserNotFoundException::new);
        }

        private static String keyPrefix(Integer userId) {
                return "avatars/" + userId + "/";
        }
}
