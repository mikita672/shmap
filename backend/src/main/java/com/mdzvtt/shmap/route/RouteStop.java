package com.mdzvtt.shmap.route;

import com.mdzvtt.shmap.place.PlaceSnapshot;
import com.mdzvtt.shmap.user.User;
import jakarta.persistence.CheckConstraint;
import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.EmbeddedColumnNaming;

import java.time.Instant;

@Entity
@Table(name = "route_stop", indexes = @Index(name = "idx_route_stop_route", columnList = "route_id, position"), check = @CheckConstraint(name = "ck_route_stop_place", constraint = "place_name is not null and place_latitude is not null and place_longitude is not null"))
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class RouteStop {
    @Id
    @GeneratedValue
    private Long id;

    @Embedded
    @EmbeddedColumnNaming("place_%s")
    private PlaceSnapshot place;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "added_by_id")
    private User addedBy;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    public RouteStop(PlaceSnapshot place, User addedBy) {
        this.place = place;
        this.addedBy = addedBy;
    }
}
