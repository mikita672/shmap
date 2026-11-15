package com.mdzvtt.shmap.route;

import com.mdzvtt.shmap.place.PlaceCategory;
import com.mdzvtt.shmap.user.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Entity
@Table(name = "route_interest", uniqueConstraints = @UniqueConstraint(name = "uk_route_interest", columnNames = {
        "route_id",
        "user_id",
        "category" }))
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class RouteInterest {
    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "route_id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Route route;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PlaceCategory category;

    public RouteInterest(Route route, User user, PlaceCategory category) {
        this.route = route;
        this.user = user;
        this.category = category;
    }
}
