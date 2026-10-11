package com.mdzvtt.shmap.friend;

public record FriendRequestIds(Long id, Integer senderId, Integer receiverId) {

    public boolean isSentBy(Integer userId) {
        return senderId.equals(userId);
    }

    public Integer otherUserId(Integer userId) {
        return isSentBy(userId) ? receiverId : senderId;
    }
}
