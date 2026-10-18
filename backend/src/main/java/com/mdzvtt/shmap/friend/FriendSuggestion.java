package com.mdzvtt.shmap.friend;

import com.mdzvtt.shmap.user.User;

public record FriendSuggestion(User user, Long mutualFriendsCount) {
}
