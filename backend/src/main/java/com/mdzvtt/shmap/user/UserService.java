package com.mdzvtt.shmap.user;

import com.mdzvtt.shmap.exception.UserNotFoundException;
import com.mdzvtt.shmap.user.dto.ProfileResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public ProfileResponse getProfile(Integer userId) {
        return ProfileResponse.from(findUser(userId));
    }

    private User findUser(Integer userId) {
        return userRepository.findById(userId).orElseThrow(UserNotFoundException::new);
    }
}
