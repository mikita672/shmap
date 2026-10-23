package com.mdzvtt.shmap.chat;

import com.mdzvtt.shmap.friend.FriendshipRepository;
import com.mdzvtt.shmap.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Set;

public interface ChatMemberRepository extends JpaRepository<ChatMember, Long> {
  @Query("""
      select u from ChatMember m
      join m.user u
      where m.chat.id = :chatId
        and u.id <> :userId
      """ + FriendshipRepository.A_TO_Z)
  List<User> findOtherMembers(Long chatId, Integer userId);

  @Query("select m.user.id from ChatMember m where m.chat.id = :chatId")
  Set<Integer> findUserIdsByChatId(Long chatId);

  @Modifying
  @Query("delete from ChatMember m where m.chat.id = :chatId and m.user.id = :userId")
  int deleteByChatIdAndUserId(Long chatId, Integer userId);
}
