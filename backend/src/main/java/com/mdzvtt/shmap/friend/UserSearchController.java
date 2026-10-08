package com.mdzvtt.shmap.friend;

import com.mdzvtt.shmap.friend.dto.UserSearchResultResponse;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users/search")
@RequiredArgsConstructor
public class UserSearchController {
    private final UserSearchService userSearchService;

    @GetMapping
    public List<UserSearchResultResponse> search(
            @RequestParam(required = false) @Size(max = 100, message = "Search query must be at most 100 characters") String q) {
        return userSearchService.search(q);
    }
}
