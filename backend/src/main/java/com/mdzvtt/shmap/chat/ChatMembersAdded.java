package com.mdzvtt.shmap.chat;

import java.util.Set;

public record ChatMembersAdded(Long chatId, Integer addedById, Set<Integer> addedUserIds) {
}
