package com.mdzvtt.shmap.storage;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.PresignedPutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;

import java.time.Duration;

@Service
@RequiredArgsConstructor
public class StorageService {
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
}
