package com.mdzvtt.shmap.chat;

import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ChatRepository extends JpaRepository<Chat, Long> {
  Optional<Chat> findByDirectUserLowIdAndDirectUserHighId(Integer lowId, Integer highId);

  @Lock(LockModeType.PESSIMISTIC_WRITE)
  @Query("select c from Chat c where c.id = :id")
  Optional<Chat> findByIdForUpdate(Long id);

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
        and (c.type = GROUP or last.id is not null)
      order by greatest(last.createdAt, mine.joinedAt) desc, c.id desc
      """)
  List<ChatListRow> findMyChats(Integer userId);
}
