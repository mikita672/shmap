package com.mdzvtt.shmap.chat;

import com.mdzvtt.shmap.user.User;
import jakarta.persistence.CheckConstraint;
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
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Entity
@Table(name = "chat", uniqueConstraints = @UniqueConstraint(name = "uk_chat_direct_pair", columnNames = {
        "direct_user_low_id",
        "direct_user_high_id" }), check = @CheckConstraint(name = "ck_chat_direct_pair_order", constraint = "direct_user_low_id < direct_user_high_id"))
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Chat {
    @Id
    @GeneratedValue
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ChatType type;

    @Column(length = 50)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "direct_user_low_id")
    private User directUserLow;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "direct_user_high_id")
    private User directUserHigh;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    public static Chat direct(User a, User b) {
        Chat chat = new Chat();
        chat.type = ChatType.DIRECT;
        boolean aFirst = a.getId() < b.getId();
        chat.directUserLow = aFirst ? a : b;
        chat.directUserHigh = aFirst ? b : a;
        return chat;
    }

    public static Chat group(String name) {
        Chat chat = new Chat();
        chat.type = ChatType.GROUP;
        chat.name = name;
        return chat;
    }

    public Integer otherUserId(Integer userId) {
        Integer lowId = directUserLow.getId();
        return lowId.equals(userId) ? directUserHigh.getId() : lowId;
    }
}
