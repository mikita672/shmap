package com.mdzvtt.shmap.friend;

import org.springframework.data.domain.Limit;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface FriendActivityRepository extends JpaRepository<FriendActivity, Long> {
    @EntityGraph(attributePaths = "friend")
    List<FriendActivity> findByUserIdOrderByCreatedAtDesc(Integer userId, Limit limit);

    @Modifying
    @Query("""
            delete from FriendActivity a
            where (a.user.id = :userId and a.friend.id = :friendId)
               or (a.user.id = :friendId and a.friend.id = :userId)
            """)
    void deleteBetween(Integer userId, Integer friendId);
}
