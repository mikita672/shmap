package com.mdzvtt.shmap.friend;

import org.springframework.data.domain.Limit;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FriendActivityRepository extends JpaRepository<FriendActivity, Long> {
    @EntityGraph(attributePaths = "friend")
    List<FriendActivity> findByUserIdOrderByCreatedAtDesc(Integer userId, Limit limit);
}
