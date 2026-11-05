package com.mdzvtt.shmap.route;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import org.hibernate.Length;

@Embeddable
public record RoutePath(
                @Column(length = Length.LONG32) String polyline,
                Integer distanceMeters,
                Integer durationSeconds) {
}
