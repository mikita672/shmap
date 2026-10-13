package com.mdzvtt.shmap.friend;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FriendActivityRepository extends JpaRepository<FriendActivity, Long> {
    List<FriendActivity> findByUserIdOrderByCreatedAtDesc(Integer userId);
}
