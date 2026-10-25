package com.mdzvtt.shmap.chat;

import java.util.Set;

public record ChatChanged(Long chatId, Set<Integer> recipientIds) {
}
