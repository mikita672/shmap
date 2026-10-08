package com.mdzvtt.shmap.friend;

sealed interface FriendSearch {
    record All() implements FriendSearch {
    }

    record Text(String text) implements FriendSearch {
    }

    record UsernamePrefix(String prefix) implements FriendSearch {
    }

    static FriendSearch parse(String query) {
        String trimmed = query == null ? "" : query.strip();
        if (trimmed.startsWith("@")) {
            String prefix = trimmed.substring(1).strip();
            return prefix.isEmpty() ? new All() : new UsernamePrefix(prefix);
        }
        return trimmed.isEmpty() ? new All() : new Text(trimmed);
    }
}
