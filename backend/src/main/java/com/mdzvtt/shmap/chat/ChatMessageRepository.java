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

    @Query("select max(m.id) from ChatMessage m where m.chat.id = :chatId")
    Long findLatestId(Long chatId);
}
