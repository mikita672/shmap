package com.mdzvtt.shmap.friend;

public enum Relationship {
    NONE,
    REQUESTED,
    INCOMING,
    FRIENDS,
    SELF;

    static Relationship of(Integer viewerId, boolean friends, FriendRequestIds request) {
        if (friends) {
            return FRIENDS;
        }
        if (request == null) {
            return NONE;
        }
        return request.isSentBy(viewerId) ? REQUESTED : INCOMING;
    }
}
