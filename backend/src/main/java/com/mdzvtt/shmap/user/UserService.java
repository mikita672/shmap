package com.mdzvtt.shmap.user;

import com.mdzvtt.shmap.exception.DuplicateUsernameException;
import com.mdzvtt.shmap.exception.UserNotFoundException;
import com.mdzvtt.shmap.user.dto.ProfileResponse;
import com.mdzvtt.shmap.user.dto.UpdateProfileRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public ProfileResponse getProfile(Integer userId) {
        return ProfileResponse.from(findUser(userId));
    }

    @Transactional
    public ProfileResponse updateProfile(Integer userId, UpdateProfileRequest request) {
        User user = findUser(userId);

        if (request.username() != null && userRepository.existsByUsernameAndIdNot(request.username(), userId)) {
            throw new DuplicateUsernameException();
        }

        Optional.ofNullable(request.firstName()).ifPresent(user::setFirstName);
        Optional.ofNullable(request.lastName()).ifPresent(user::setLastName);
        Optional.ofNullable(request.username()).ifPresent(user::setUsername);
        Optional.ofNullable(request.bio()).ifPresent(user::setBio);

        return ProfileResponse.from(user);
    }

    private User findUser(Integer userId) {
        return userRepository.findById(userId).orElseThrow(UserNotFoundException::new);
    }
}
