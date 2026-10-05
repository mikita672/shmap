package com.mdzvtt.shmap.storage;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.checksums.RequestChecksumCalculation;
import software.amazon.awssdk.core.checksums.ResponseChecksumValidation;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.S3Configuration;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;

import java.net.URI;

@Configuration
@EnableConfigurationProperties(StorageProperties.class)
public class StorageConfig {

        @Bean
        public S3Client s3Client(StorageProperties properties) {
                StorageProperties.S3 s3 = properties.s3();
                return S3Client.builder()
                                .endpointOverride(URI.create(s3.endpoint()))
                                .region(Region.of(s3.region()))
                                .credentialsProvider(credentials(s3))
                                .serviceConfiguration(S3Configuration.builder()
                                                .pathStyleAccessEnabled(true)
                                                .chunkedEncodingEnabled(false)
                                                .build())
                                .requestChecksumCalculation(RequestChecksumCalculation.WHEN_REQUIRED)
                                .responseChecksumValidation(ResponseChecksumValidation.WHEN_REQUIRED)
                                .build();
        }

        @Bean
        public S3Presigner s3Presigner(StorageProperties properties) {
                StorageProperties.S3 s3 = properties.s3();
                return S3Presigner.builder()
                                .endpointOverride(URI.create(s3.endpoint()))
                                .region(Region.of(s3.region()))
                                .credentialsProvider(credentials(s3))
                                .serviceConfiguration(S3Configuration.builder()
                                                .pathStyleAccessEnabled(true)
                                                .build())
                                .build();
        }

        private static StaticCredentialsProvider credentials(StorageProperties.S3 s3) {
                return StaticCredentialsProvider.create(
                                AwsBasicCredentials.create(s3.accessKeyId(), s3.secretAccessKey()));
        }
}
