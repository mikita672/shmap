package com.mdzvtt.shmap.friend;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface FriendRequestRepository extends JpaRepository<FriendRequest, Long> {
    boolean existsBySenderIdAndReceiverId(Integer senderId, Integer receiverId);

    @EntityGraph(attributePaths = "sender")
    List<FriendRequest> findByReceiverIdOrderByCreatedAtDesc(Integer receiverId);

    @EntityGraph(attributePaths = "receiver")
    List<FriendRequest> findBySenderIdOrderByCreatedAtDesc(Integer senderId);

    long countByReceiverId(Integer receiverId);

    Optional<FriendRequest> findByIdAndSenderId(Long id, Integer senderId);

    Optional<FriendRequest> findByIdAndReceiverId(Long id, Integer receiverId);

    void deleteBySenderIdAndReceiverId(Integer senderId, Integer receiverId);

    @Query("""
            select new com.mdzvtt.shmap.friend.FriendRequestIds(r.id, r.sender.id, r.receiver.id)
            from FriendRequest r
            where (r.sender.id = :userId and r.receiver.id in :otherUserIds)
               or (r.receiver.id = :userId and r.sender.id in :otherUserIds)
            """)
    List<FriendRequestIds> findIdsBetween(Integer userId, Collection<Integer> otherUserIds);
}
