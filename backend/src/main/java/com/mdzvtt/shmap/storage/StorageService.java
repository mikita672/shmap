package com.mdzvtt.shmap.storage;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.HeadObjectRequest;
import software.amazon.awssdk.services.s3.model.HeadObjectResponse;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.S3Exception;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.PresignedPutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;

import java.time.Duration;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class StorageService {
        private final S3Client s3Client;
        private final S3Presigner presigner;
        private final StorageProperties properties;

        public PresignedUpload presignUpload(String key, String contentType, long contentLength, Duration ttl) {
                PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                                .bucket(properties.s3().bucket())
                                .key(key)
                                .contentType(contentType)
                                .contentLength(contentLength)
                                .build();

                PutObjectPresignRequest presignRequest = PutObjectPresignRequest.builder()
                                .signatureDuration(ttl)
                                .putObjectRequest(putObjectRequest)
                                .build();

                PresignedPutObjectRequest presigned = presigner.presignPutObject(presignRequest);
                return new PresignedUpload(presigned.url().toString(), presigned.expiration());
        }

        public Optional<StoredObject> findObject(String key) {
                HeadObjectRequest request = HeadObjectRequest.builder()
                                .bucket(properties.s3().bucket())
                                .key(key)
                                .build();

                try {
                        HeadObjectResponse response = s3Client.headObject(request);
                        return Optional.of(new StoredObject(response.contentLength(), response.contentType()));
                } catch (S3Exception ex) {
                        if (ex.statusCode() == HttpStatus.NOT_FOUND.value()) {
                                return Optional.empty();
                        }
                        throw ex;
                }
        }

        public byte[] readObject(String key) {
                GetObjectRequest request = GetObjectRequest.builder()
                                .bucket(properties.s3().bucket())
                                .key(key)
                                .build();

                return s3Client.getObjectAsBytes(request).asByteArray();
        }

        public void putObject(String key, byte[] content, String contentType) {
                PutObjectRequest request = PutObjectRequest.builder()
                                .bucket(properties.s3().bucket())
                                .key(key)
                                .contentType(contentType)
                                .build();

                s3Client.putObject(request, RequestBody.fromBytes(content));
        }

        public void delete(String key) {
                DeleteObjectRequest request = DeleteObjectRequest.builder()
                                .bucket(properties.s3().bucket())
                                .key(key)
                                .build();

                s3Client.deleteObject(request);
        }

        public String publicUrl(String key) {
                if (key == null) {
                        return null;
                }

                String baseUrl = StringUtils.trimTrailingCharacter(properties.s3().publicBaseUrl(), '/');
                return baseUrl + "/" + key;
        }
}
