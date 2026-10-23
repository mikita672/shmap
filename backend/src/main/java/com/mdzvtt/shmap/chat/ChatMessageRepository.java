package com.mdzvtt.shmap.chat;

import org.springframework.data.domain.Limit;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    @EntityGraph(attributePaths = "sender")
    List<ChatMessage> findByChatIdOrderByIdDesc(Long chatId, Limit limit);
}
