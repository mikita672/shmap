package com.mdzvtt.shmap.storage;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.s3.S3Client;
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
}
