package com.mdzvtt.shmap.place;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

@Embeddable
public record PlaceSnapshot(
        @Column(length = 32) String osmId,
        @Column(length = 200) String name,
        @Column(length = 300) String address,
        @Column(length = 50) String osmKey,
        @Column(length = 50) String osmValue,
        Double latitude,
        Double longitude) {
}
