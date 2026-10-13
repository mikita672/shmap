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
@Table(name = "suggestion_dismissal", uniqueConstraints = @UniqueConstraint(name = "uk_suggestion_dismissal_user_dismissed", columnNames = {
        "user_id",
        "dismissed_id" }), check = @CheckConstraint(name = "ck_suggestion_dismissal_not_self", constraint = "user_id <> dismissed_id"))
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class SuggestionDismissal {
    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "dismissed_id")
    private User dismissed;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    public SuggestionDismissal(User user, User dismissed) {
        this.user = user;
        this.dismissed = dismissed;
    }
}
