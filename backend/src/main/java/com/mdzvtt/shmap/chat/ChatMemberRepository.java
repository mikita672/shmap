package com.mdzvtt.shmap.chat;

import com.mdzvtt.shmap.friend.FriendshipRepository;
import com.mdzvtt.shmap.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ChatMemberRepository extends JpaRepository<ChatMember, Long> {
    @Query("""
            select u from ChatMember m
            join m.user u
            where m.chat.id = :chatId
              and u.id <> :userId
            """ + FriendshipRepository.A_TO_Z)
    List<User> findOtherMembers(Long chatId, Integer userId);
}
