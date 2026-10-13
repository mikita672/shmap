package com.mdzvtt.shmap.block;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserBlockRepository extends JpaRepository<UserBlock, Long> {
    boolean existsByBlockerIdAndBlockedId(Integer blockerId, Integer blockedId);

    @EntityGraph(attributePaths = "blocked")
    List<UserBlock> findByBlockerIdOrderByCreatedAtDesc(Integer blockerId);

    default boolean existsBetween(Integer userId, Integer otherUserId) {
        return existsByBlockerIdAndBlockedId(userId, otherUserId)
                || existsByBlockerIdAndBlockedId(otherUserId, userId);
    }
}
