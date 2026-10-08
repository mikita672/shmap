package com.mdzvtt.shmap.friend;

import com.mdzvtt.shmap.user.User;
import jakarta.persistence.CheckConstraint;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Entity
@Table(name = "friendship", uniqueConstraints = @UniqueConstraint(name = "uk_friendship_user_friend", columnNames = {
        "user_id",
        "friend_id" }), check = @CheckConstraint(name = "ck_friendship_not_self", constraint = "user_id <> friend_id"))
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Friendship {
    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "friend_id")
    private User friend;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    private Instant favoritedAt;

    public Friendship(User user, User friend) {
        this.user = user;
        this.friend = friend;
    }

    public boolean isFavorite() {
        return favoritedAt != null;
    }

    public void markFavorite() {
        if (favoritedAt == null) {
            favoritedAt = Instant.now();
        }
    }
}
