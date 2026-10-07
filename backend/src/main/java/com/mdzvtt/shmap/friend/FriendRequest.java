package com.mdzvtt.shmap.friend;

import com.mdzvtt.shmap.user.User;
import jakarta.persistence.CheckConstraint;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
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
@Table(name = "friend_request", uniqueConstraints = @UniqueConstraint(name = "uk_friend_request_sender_receiver", columnNames = {
        "sender_id",
        "receiver_id" }), indexes = @Index(name = "idx_friend_request_receiver", columnList = "receiver_id"), check = @CheckConstraint(name = "ck_friend_request_not_self", constraint = "sender_id <> receiver_id"))
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class FriendRequest {
    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "sender_id")
    private User sender;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "receiver_id")
    private User receiver;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    public FriendRequest(User sender, User receiver) {
        this.sender = sender;
        this.receiver = receiver;
    }
}
