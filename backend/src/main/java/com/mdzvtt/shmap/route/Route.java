package com.mdzvtt.shmap.route;

import com.mdzvtt.shmap.chat.Chat;
import com.mdzvtt.shmap.directions.RoutingRequest;
import com.mdzvtt.shmap.directions.RoutingResult;
import com.mdzvtt.shmap.directions.TravelMode;
import com.mdzvtt.shmap.directions.Waypoint;
import com.mdzvtt.shmap.exception.RouteFullException;
import com.mdzvtt.shmap.exception.RouteStopNotFoundException;
import com.mdzvtt.shmap.exception.RouteStopsChangedException;
import com.mdzvtt.shmap.user.User;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderColumn;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.EmbeddedColumnNaming;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

@Entity
@Table(name = "route", indexes = @Index(name = "idx_route_chat", columnList = "chat_id"))
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Route {
    public static final int MAX_STOPS = 25;

    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "chat_id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Chat chat;

    @Column(nullable = false, length = 50)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @ColumnDefault("'WALKING'")
    private TravelMode travelMode;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @ColumnDefault("'PENDING'")
    private PathStatus pathStatus;

    @Embedded
    @EmbeddedColumnNaming("path_%s")
    private RoutePath path;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "created_by_id")
    private User createdBy;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @Column(nullable = false)
    private Instant updatedAt;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "route_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @OrderColumn(name = "position")
    private List<RouteStop> stops = new ArrayList<>();

    public Route(Chat chat, String name, User createdBy, TravelMode travelMode) {
        this.chat = chat;
        this.name = name;
        this.travelMode = travelMode;
        this.pathStatus = PathStatus.NONE;
        this.createdBy = createdBy;
        this.updatedAt = Instant.now();
    }

    public void rename(String name) {
        this.name = name;
        touch();
    }

    public void addStop(RouteStop stop) {
        if (stops.size() >= MAX_STOPS) {
            throw new RouteFullException(MAX_STOPS);
        }
        stops.add(stop);
        markPathStale();
        touch();
    }

    public void removeStop(Long stopId) {
        if (!stops.removeIf(stop -> stop.getId().equals(stopId))) {
            throw new RouteStopNotFoundException();
        }
        markPathStale();
        touch();
    }

    public void reorderStops(List<Long> stopIds) {
        Map<Long, Integer> newIndex = new HashMap<>();
        for (int i = 0; i < stopIds.size(); i++) {
            newIndex.put(stopIds.get(i), i);
        }
        boolean sameStops = newIndex.size() == stopIds.size()
                && stopIds.size() == stops.size()
                && stops.stream().allMatch(stop -> newIndex.containsKey(stop.getId()));
        if (!sameStops) {
            throw new RouteStopsChangedException();
        }
        stops.sort(Comparator.comparing(stop -> newIndex.get(stop.getId())));
        markPathStale();
        touch();
    }

    public RoutingRequest routingRequest() {
        return new RoutingRequest(travelMode, stops.stream()
                .map(stop -> new Waypoint(stop.getPlace().latitude(), stop.getPlace().longitude()))
                .toList());
    }

    public Optional<RoutingRequest> pathToBuild() {
        return pathStatus == PathStatus.PENDING ? Optional.of(routingRequest()) : Optional.empty();
    }

    public Optional<RoutingRequest> pathToRetry() {
        if (!needsPath()) {
            return Optional.empty();
        }
        if (stops.size() < 2) {
            path = null;
            pathStatus = PathStatus.NONE;
            return Optional.empty();
        }
        return Optional.of(routingRequest());
    }

    public boolean applyPath(RoutingRequest builtFor, RoutingResult result) {
        if (!needsPath() || !routingRequest().equals(builtFor)) {
            return false;
        }
        PathStatus oldStatus = pathStatus;
        RoutePath oldPath = path;
        switch (result) {
            case RoutingResult.Found found -> {
                pathStatus = PathStatus.READY;
                path = new RoutePath(found.polyline(), found.distanceMeters(), found.durationSeconds());
            }
            case RoutingResult.NoRoute noRoute -> {
                pathStatus = PathStatus.NO_ROUTE;
                path = null;
            }
            case RoutingResult.Unavailable unavailable -> {
                pathStatus = PathStatus.UNAVAILABLE;
                path = null;
            }
        }
        return pathStatus != oldStatus || !Objects.equals(path, oldPath);
    }

    private boolean needsPath() {
        return pathStatus == PathStatus.PENDING || pathStatus == PathStatus.UNAVAILABLE;
    }

    private void touch() {
        updatedAt = Instant.now();
    }

    private void markPathStale() {
        path = null;
        pathStatus = stops.size() < 2 ? PathStatus.NONE : PathStatus.PENDING;
    }
}
