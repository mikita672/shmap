package com.mdzvtt.shmap.chat;

import com.mdzvtt.shmap.user.User;
import jakarta.persistence.CheckConstraint;
import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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

@Entity
@Table(name = "chat_message", indexes = @Index(name = "idx_chat_message_chat_id", columnList = "chat_id, id desc"), check = @CheckConstraint(name = "ck_chat_message_content", constraint = """
        (type = 'TEXT' and text is not null
            and place_name is null and place_latitude is null and place_longitude is null)
        or (type = 'PLACE' and text is null
            and place_name is not null and place_latitude is not null and place_longitude is not null)
        """))
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ChatMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "chat_id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Chat chat;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "sender_id")
    private User sender;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @ColumnDefault("'TEXT'")
    private ChatMessageType type;

    @Column(length = 2000)
    private String text;

    @Embedded
    @EmbeddedColumnNaming("place_%s")
    private MessagePlace place;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    private ChatMessage(Chat chat, User sender, ChatMessageType type, String text, MessagePlace place) {
        this.chat = chat;
        this.sender = sender;
        this.type = type;
        this.text = text;
        this.place = place;
    }

    public static ChatMessage text(Chat chat, User sender, String text) {
        return new ChatMessage(chat, sender, ChatMessageType.TEXT, text, null);
    }

    public static ChatMessage place(Chat chat, User sender, MessagePlace place) {
        return new ChatMessage(chat, sender, ChatMessageType.PLACE, null, place);
    }
}
