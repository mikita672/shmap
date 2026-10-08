package com.mdzvtt.shmap.friend;

sealed interface FriendSearch {
    record All() implements FriendSearch {
    }

    record Text(String text) implements FriendSearch {
    }

    static FriendSearch parse(String query) {
        if (query == null || query.isBlank()) {
            return new All();
        }
        return new Text(query.strip());
    }
}
