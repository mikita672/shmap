package com.mdzvtt.shmap.block;

import org.springframework.data.jpa.repository.JpaRepository;

public interface UserBlockRepository extends JpaRepository<UserBlock, Long> {
    boolean existsByBlockerIdAndBlockedId(Integer blockerId, Integer blockedId);

    default boolean existsBetween(Integer userId, Integer otherUserId) {
        return existsByBlockerIdAndBlockedId(userId, otherUserId)
                || existsByBlockerIdAndBlockedId(otherUserId, userId);
    }
}
