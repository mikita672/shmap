package com.mdzvtt.shmap.block;

import com.mdzvtt.shmap.block.dto.BlockedUserResponse;
import com.mdzvtt.shmap.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/blocks")
@RequiredArgsConstructor
public class BlockController {
    private final BlockService blockService;

    @GetMapping
    public List<BlockedUserResponse> list(@AuthenticationPrincipal User user) {
        return blockService.getBlocked(user.getId());
    }

    @PutMapping("/{userId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void block(@AuthenticationPrincipal User user, @PathVariable Integer userId) {
        blockService.block(user.getId(), userId);
    }
}
