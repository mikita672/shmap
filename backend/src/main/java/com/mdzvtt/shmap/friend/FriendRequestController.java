package com.mdzvtt.shmap.friend;

import com.mdzvtt.shmap.friend.dto.SendFriendRequestRequest;
import com.mdzvtt.shmap.friend.dto.SendFriendRequestResponse;
import com.mdzvtt.shmap.user.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
