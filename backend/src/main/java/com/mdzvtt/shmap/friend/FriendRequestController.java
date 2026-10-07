package com.mdzvtt.shmap.friend;

import com.mdzvtt.shmap.friend.dto.FriendRequestCountResponse;
import com.mdzvtt.shmap.friend.dto.FriendRequestResponse;
import com.mdzvtt.shmap.friend.dto.SendFriendRequestRequest;
import com.mdzvtt.shmap.friend.dto.SendFriendRequestResponse;
import com.mdzvtt.shmap.user.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/friend-requests")
@RequiredArgsConstructor
public class FriendRequestController {
    private final FriendRequestService friendRequestService;

    @PostMapping
    public ResponseEntity<SendFriendRequestResponse> send(@AuthenticationPrincipal User user,
            @Valid @RequestBody SendFriendRequestRequest request) {
        SendFriendRequestResponse response = friendRequestService.send(user.getId(), request.receiverId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/incoming")
    public List<FriendRequestResponse> incoming(@AuthenticationPrincipal User user) {
        return friendRequestService.getIncoming(user.getId());
    }

    @GetMapping("/incoming/count")
    public FriendRequestCountResponse incomingCount(@AuthenticationPrincipal User user) {
        return friendRequestService.countIncoming(user.getId());
    }

    @GetMapping("/sent")
    public List<FriendRequestResponse> sent(@AuthenticationPrincipal User user) {
        return friendRequestService.getSent(user.getId());
    }
}
