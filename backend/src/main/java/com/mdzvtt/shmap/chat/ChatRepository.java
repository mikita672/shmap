package com.mdzvtt.shmap.chat;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface ChatRepository extends JpaRepository<Chat, Long> {
    Optional<Chat> findByDirectUserLowIdAndDirectUserHighId(Integer lowId, Integer highId);

    @Query("""
            select c from Chat c
            join ChatMember m on m.chat = c
            where c.id = :chatId
              and m.user.id = :userId
            """)
    Optional<Chat> findForMember(Long chatId, Integer userId);
}
