package com.mdzvtt.shmap.friend.dto;

public record SendFriendRequestResponse(Outcome outcome, Long requestId) {

    public enum Outcome {
        REQUEST_SENT,
        BECAME_FRIENDS
    }

    public static SendFriendRequestResponse requestSent(Long requestId) {
        return new SendFriendRequestResponse(Outcome.REQUEST_SENT, requestId);
    }

    public static SendFriendRequestResponse becameFriends() {
        return new SendFriendRequestResponse(Outcome.BECAME_FRIENDS, null);
    }
}
