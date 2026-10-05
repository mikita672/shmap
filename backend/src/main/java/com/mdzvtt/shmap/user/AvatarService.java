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

import javax.imageio.ImageIO;
import javax.imageio.ImageReader;
import javax.imageio.stream.ImageInputStream;
import javax.imageio.stream.MemoryCacheImageInputStream;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.Iterator;
import java.util.List;
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
        private static final int MAX_DIMENSION_PX = 4096;
        private static final String UPLOAD_PREFIX = "uploads/";

        static {
                ImageIO.scanForPlugins();
        }

        private final StorageService storageService;
        private final StorageProperties storageProperties;
        private final UserRepository userRepository;
        private final UserService userService;

        public AvatarUploadResponse createUploadUrl(Integer userId, AvatarUploadRequest request) {
                String extension = extensionFor(request.contentType());
                validateSize(request.contentLength());

                String key = UPLOAD_PREFIX + keyPrefix(userId) + UUID.randomUUID() + "." + extension;
                PresignedUpload upload = storageService.presignUpload(
                                key,
                                request.contentType(),
                                request.contentLength(),
                                storageProperties.avatar().uploadUrlTtl());

                return new AvatarUploadResponse(upload.url(), key, upload.expiresAt());
        }

        public ProfileResponse confirm(Integer userId, String uploadKey) {
                if (!isOwnUploadKey(userId, uploadKey)) {
                        throw new AvatarUploadNotFoundException();
                }

                String avatarKey = uploadKey.substring(UPLOAD_PREFIX.length());
                User user = findUser(userId);
                String oldKey = user.getAvatarKey();
                if (avatarKey.equals(oldKey)) {
                        return userService.toProfileResponse(user);
                }

                StoredObject stored = storageService.findObject(uploadKey)
                                .orElseThrow(AvatarUploadNotFoundException::new);
                byte[] content;
                try {
                        extensionFor(stored.contentType());
                        validateSize(stored.size());
                        content = storageService.readObject(uploadKey);
                        validateImageContent(content, stored.contentType());
                } catch (InvalidAvatarException ex) {
                        deleteQuietly(uploadKey);
                        throw ex;
                }

                storageService.putObject(avatarKey, content, stored.contentType());
                user.setAvatarKey(avatarKey);
                userRepository.save(user);

                deleteQuietly(uploadKey);
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

        private void validateImageContent(byte[] bytes, String contentType) {
                try (ImageInputStream input = new MemoryCacheImageInputStream(new ByteArrayInputStream(bytes))) {
                        Iterator<ImageReader> readers = ImageIO.getImageReaders(input);
                        if (!readers.hasNext()) {
                                throw new InvalidAvatarException("Avatar is not a valid image");
                        }

                        ImageReader reader = readers.next();
                        try {
                                List<String> actualTypes = List.of(reader.getOriginatingProvider().getMIMETypes());
                                if (!actualTypes.contains(contentType)) {
                                        throw new InvalidAvatarException("Avatar content does not match its type");
                                }

                                reader.setInput(input, true, true);
                                if (reader.getWidth(0) > MAX_DIMENSION_PX || reader.getHeight(0) > MAX_DIMENSION_PX) {
                                        throw new InvalidAvatarException("Avatar must be at most "
                                                        + MAX_DIMENSION_PX + "x" + MAX_DIMENSION_PX + " pixels");
                                }
                                reader.read(0);
                        } finally {
                                reader.dispose();
                        }
                } catch (InvalidAvatarException ex) {
                        throw ex;
                } catch (IOException | RuntimeException ex) {
                        throw new InvalidAvatarException("Avatar is not a valid image");
                }
        }

        private boolean isOwnUploadKey(Integer userId, String key) {
                String ownKeyPattern = Pattern.quote(UPLOAD_PREFIX + keyPrefix(userId))
                                + "[0-9a-f-]{36}\\.(jpg|png|webp)";
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
