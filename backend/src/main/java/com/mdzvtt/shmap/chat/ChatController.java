package com.mdzvtt.shmap.chat;

import com.mdzvtt.shmap.chat.dto.AddChatMembersRequest;
import com.mdzvtt.shmap.chat.dto.ChatMessageResponse;
import com.mdzvtt.shmap.chat.dto.ChatResponse;
import com.mdzvtt.shmap.chat.dto.ChatSummaryResponse;
import com.mdzvtt.shmap.chat.dto.ChatUnreadCountResponse;
import com.mdzvtt.shmap.chat.dto.CreateGroupChatRequest;
import com.mdzvtt.shmap.chat.dto.MarkChatReadRequest;
import com.mdzvtt.shmap.chat.dto.SendChatMessageRequest;
import com.mdzvtt.shmap.user.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/chats")
@RequiredArgsConstructor
public class ChatController {
    private final ChatService chatService;

    @GetMapping
    public List<ChatSummaryResponse> getChats(@AuthenticationPrincipal User user) {
        return chatService.getChats(user.getId());
    }

    @GetMapping("/unread/count")
    public ChatUnreadCountResponse countUnread(@AuthenticationPrincipal User user) {
        return chatService.countUnread(user.getId());
    }

    @PutMapping("/direct/{userId}")
    public ChatResponse openDirect(@AuthenticationPrincipal User user, @PathVariable Integer userId) {
        return chatService.openDirect(user.getId(), userId);
    }

    @PostMapping("/groups")
    @ResponseStatus(HttpStatus.CREATED)
    public ChatResponse createGroup(@AuthenticationPrincipal User user,
            @Valid @RequestBody CreateGroupChatRequest request) {
        return chatService.createGroup(user.getId(), request.name(), request.memberIds());
    }

    @GetMapping("/{chatId}")
    public ChatResponse getChat(@AuthenticationPrincipal User user, @PathVariable Long chatId) {
        return chatService.getChat(user.getId(), chatId);
    }

    @PostMapping("/{chatId}/members")
    public ChatResponse addMembers(@AuthenticationPrincipal User user, @PathVariable Long chatId,
            @Valid @RequestBody AddChatMembersRequest request) {
        return chatService.addMembers(user.getId(), chatId, request.userIds());
    }

    @DeleteMapping("/{chatId}/members/me")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void leave(@AuthenticationPrincipal User user, @PathVariable Long chatId) {
        chatService.leave(user.getId(), chatId);
    }

    @PutMapping("/{chatId}/read")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void markRead(@AuthenticationPrincipal User user, @PathVariable Long chatId,
            @Valid @RequestBody MarkChatReadRequest request) {
        chatService.markRead(user.getId(), chatId, request.messageId());
    }

    @GetMapping("/{chatId}/messages")
    public List<ChatMessageResponse> getMessages(@AuthenticationPrincipal User user, @PathVariable Long chatId,
            @RequestParam(required = false) Long before) {
        return chatService.getMessages(user.getId(), chatId, before);
    }

    @PostMapping("/{chatId}/messages")
    @ResponseStatus(HttpStatus.CREATED)
    public ChatMessageResponse send(@AuthenticationPrincipal User user, @PathVariable Long chatId,
            @Valid @RequestBody SendChatMessageRequest request) {
        return chatService.sendText(user.getId(), chatId, request.text());
    }
}
