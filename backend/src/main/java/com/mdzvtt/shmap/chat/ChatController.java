package com.mdzvtt.shmap.chat;

import com.mdzvtt.shmap.chat.dto.ChatResponse;
import com.mdzvtt.shmap.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/chats")
@RequiredArgsConstructor
public class ChatController {
    private final ChatService chatService;

    @PutMapping("/direct/{userId}")
    public ChatResponse openDirect(@AuthenticationPrincipal User user, @PathVariable Integer userId) {
        return chatService.openDirect(user.getId(), userId);
    }
}
