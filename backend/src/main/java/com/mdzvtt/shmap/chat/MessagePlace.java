package com.mdzvtt.shmap.chat;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

@Embeddable
public record MessagePlace(
                @Column(length = 32) String osmId,
                @Column(length = 200) String name,
                @Column(length = 300) String address,
                @Column(length = 50) String osmKey,
                @Column(length = 50) String osmValue,
                Double latitude,
                Double longitude) {
}
