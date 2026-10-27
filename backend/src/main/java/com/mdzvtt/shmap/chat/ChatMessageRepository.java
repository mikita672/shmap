package com.mdzvtt.shmap.chat;

import org.springframework.data.domain.Limit;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    @EntityGraph(attributePaths = "sender")
    List<ChatMessage> findByChatIdOrderByIdDesc(Long chatId, Limit limit);

    @EntityGraph(attributePaths = "sender")
    List<ChatMessage> findByChatIdAndIdLessThanOrderByIdDesc(Long chatId, Long before, Limit limit);

    boolean existsByIdAndChatId(Long id, Long chatId);

    @Query("select max(m.id) from ChatMessage m where m.chat.id = :chatId")
    Long findLatestId(Long chatId);

    @Query("""
            select count(m) from ChatMessage m
            join ChatMember mine on mine.chat = m.chat
            where mine.user.id = :userId
              and m.id > coalesce(mine.lastReadMessageId, 0L)
              and m.sender.id <> :userId
            """)
    long countUnread(Integer userId);
}
