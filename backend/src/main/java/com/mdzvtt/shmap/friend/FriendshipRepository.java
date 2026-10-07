package com.mdzvtt.shmap.friend;

import org.springframework.data.jpa.repository.JpaRepository;

public interface FriendshipRepository extends JpaRepository<Friendship, Long> {
    boolean existsByUserIdAndFriendId(Integer userId, Integer friendId);
}
