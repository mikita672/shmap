package com.mdzvtt.shmap.route;

import com.mdzvtt.shmap.chat.Chat;
import com.mdzvtt.shmap.user.User;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "route", indexes = @Index(name = "idx_route_chat", columnList = "chat_id"))
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Route {
    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "chat_id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Chat chat;

    @Column(nullable = false, length = 50)
    private String name;

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

    public Route(Chat chat, String name, User createdBy) {
        this.chat = chat;
        this.name = name;
        this.createdBy = createdBy;
        this.updatedAt = Instant.now();
    }
}
