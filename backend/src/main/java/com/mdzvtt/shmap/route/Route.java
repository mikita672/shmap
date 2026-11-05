package com.mdzvtt.shmap.route;

import com.mdzvtt.shmap.chat.Chat;
import com.mdzvtt.shmap.directions.TravelMode;
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
        touch();
    }

    public void removeStop(Long stopId) {
        if (!stops.removeIf(stop -> stop.getId().equals(stopId))) {
            throw new RouteStopNotFoundException();
        }
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
        touch();
    }

    private void touch() {
        updatedAt = Instant.now();
    }
}
