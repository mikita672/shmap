package com.mdzvtt.shmap.friend;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FriendRequestRepository extends JpaRepository<FriendRequest, Long> {
    boolean existsBySenderIdAndReceiverId(Integer senderId, Integer receiverId);

    @EntityGraph(attributePaths = "sender")
    List<FriendRequest> findByReceiverIdOrderByCreatedAtDesc(Integer receiverId);

    @EntityGraph(attributePaths = "receiver")
    List<FriendRequest> findBySenderIdOrderByCreatedAtDesc(Integer senderId);

    long countByReceiverId(Integer receiverId);
}
