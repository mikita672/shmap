package com.mdzvtt.shmap.friend;

import com.mdzvtt.shmap.user.User;
import jakarta.persistence.CheckConstraint;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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

import java.time.Instant;

@Entity
@Table(name = "friend_activity", indexes = @Index(name = "idx_friend_activity_user_created", columnList = "user_id, created_at desc"), check = @CheckConstraint(name = "ck_friend_activity_not_self", constraint = "user_id <> friend_id"))
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class FriendActivity {
    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "friend_id")
    private User friend;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FriendActivityType type;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    public FriendActivity(User user, User friend, FriendActivityType type) {
        this.user = user;
        this.friend = friend;
        this.type = type;
    }
}
