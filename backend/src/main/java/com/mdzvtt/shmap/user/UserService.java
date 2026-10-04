package com.mdzvtt.shmap.user;

import com.mdzvtt.shmap.auth.AuthenticationResponse;
import com.mdzvtt.shmap.auth.AuthenticationService;
import com.mdzvtt.shmap.exception.DuplicateEmailException;
import com.mdzvtt.shmap.exception.DuplicateUsernameException;
import com.mdzvtt.shmap.exception.InvalidCurrentPasswordException;
import com.mdzvtt.shmap.exception.PasswordUnchangedException;
import com.mdzvtt.shmap.exception.UserNotFoundException;
import com.mdzvtt.shmap.user.dto.AccountResponse;
import com.mdzvtt.shmap.user.dto.ChangeEmailRequest;
import com.mdzvtt.shmap.user.dto.ChangePasswordRequest;
import com.mdzvtt.shmap.user.dto.EmailResponse;
import com.mdzvtt.shmap.user.dto.ProfileResponse;
import com.mdzvtt.shmap.user.dto.UpdateProfileRequest;
import com.mdzvtt.shmap.user.dto.UsernameAvailabilityResponse;
import com.mdzvtt.shmap.user.dto.UsernameResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final AuthenticationService authenticationService;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public ProfileResponse getProfile(Integer userId) {
        return ProfileResponse.from(findUser(userId));
    }

    @Transactional(readOnly = true)
    public UsernameResponse getUsername(Integer userId) {
        return UsernameResponse.from(findUser(userId));
    }

    @Transactional(readOnly = true)
    public EmailResponse getEmail(Integer userId) {
        return EmailResponse.from(findUser(userId));
    }

    @Transactional(readOnly = true)
    public AccountResponse getAccount(Integer userId) {
        return AccountResponse.from(findUser(userId));
    }

    @Transactional(readOnly = true)
    public UsernameAvailabilityResponse checkUsernameAvailability(String username) {
        return new UsernameAvailabilityResponse(username, !userRepository.existsByUsername(username));
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

    @Transactional
    public AuthenticationResponse changeEmail(Integer userId, ChangeEmailRequest request) {
        User user = findUser(userId);

        if (userRepository.existsByEmailAndIdNot(request.email(), userId)) {
            throw new DuplicateEmailException();
        }

        // TODO: require OTP confirmation sent to the new address
        user.setEmail(request.email());

        return authenticationService.issueTokens(user);
    }

    @Transactional
    public AuthenticationResponse changePassword(Integer userId, ChangePasswordRequest request) {
        User user = findUser(userId);

        if (!passwordEncoder.matches(request.currentPassword(), user.getPassword())) {
            throw new InvalidCurrentPasswordException();
        }

        if (request.newPassword().equals(request.currentPassword())) {
            throw new PasswordUnchangedException();
        }

        user.setPassword(passwordEncoder.encode(request.newPassword()));

        return authenticationService.issueTokens(user);
    }

    private User findUser(Integer userId) {
        return userRepository.findById(userId).orElseThrow(UserNotFoundException::new);
    }
}
