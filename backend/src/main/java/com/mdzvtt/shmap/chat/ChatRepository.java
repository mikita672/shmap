package com.mdzvtt.shmap.chat;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
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

    @Query("""
            select c from ChatMember mine
            join mine.chat c
            left join fetch c.directUserLow
            left join fetch c.directUserHigh
            where mine.user.id = :userId
            order by mine.joinedAt desc, c.id desc
            """)
    List<Chat> findMyChats(Integer userId);
}
