package com.mdzvtt.shmap.storage;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

import java.time.Duration;

@Validated
@ConfigurationProperties("storage")
public record StorageProperties(
                @Valid @NotNull S3 s3,
                @Valid @NotNull Avatar avatar) {

        public record S3(
                        @NotBlank String endpoint,
                        @NotBlank String region,
                        @NotBlank String bucket,
                        @NotBlank String accessKeyId,
                        @NotBlank String secretAccessKey,
                        @NotBlank String publicBaseUrl) {
        }

        public record Avatar(
                        @Positive long maxSizeBytes,
                        @NotNull Duration uploadUrlTtl) {
        }
}
