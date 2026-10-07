package com.mdzvtt.shmap.friend.dto;

public record SendFriendRequestResponse(Outcome outcome, Long requestId) {

    public enum Outcome {
        REQUEST_SENT
    }

    public static SendFriendRequestResponse requestSent(Long requestId) {
        return new SendFriendRequestResponse(Outcome.REQUEST_SENT, requestId);
    }
}
