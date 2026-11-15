package com.mdzvtt.shmap.suggestion;

import com.mdzvtt.shmap.place.PlaceCategory;
import com.mdzvtt.shmap.place.PlaceSnapshot;
import jakarta.persistence.CheckConstraint;
import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.EmbeddedColumnNaming;

@Entity
@Table(name = "route_suggestion", indexes = @Index(name = "idx_route_suggestion_set", columnList = "set_id, position"), check = @CheckConstraint(name = "ck_route_suggestion_place", constraint = "place_name is not null and place_latitude is not null and place_longitude is not null"))
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class RouteSuggestion {
    @Id
    @GeneratedValue
    private Long id;

    @Embedded
    @EmbeddedColumnNaming("place_%s")
    private PlaceSnapshot place;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PlaceCategory category;

    @Column(nullable = false, length = PlacePicker.MAX_REASON_LENGTH)
    private String reason;

    public RouteSuggestion(PlaceSnapshot place, PlaceCategory category, String reason) {
        this.place = place;
        this.category = category;
        this.reason = reason;
    }
}
