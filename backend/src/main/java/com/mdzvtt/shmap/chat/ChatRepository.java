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
            select new com.mdzvtt.shmap.chat.ChatListRow(c, low, high, last, sender)
            from ChatMember mine
            join mine.chat c
            left join c.directUserLow low
            left join c.directUserHigh high
            left join ChatMessage last on last.chat = c
                and last.id = (select max(m.id) from ChatMessage m where m.chat = c)
            left join last.sender sender
            where mine.user.id = :userId
            order by mine.joinedAt desc, c.id desc
            """)
    List<ChatListRow> findMyChats(Integer userId);
}
