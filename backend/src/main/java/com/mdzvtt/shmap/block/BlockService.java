package com.mdzvtt.shmap.block;

import com.mdzvtt.shmap.exception.UserNotFoundException;
import com.mdzvtt.shmap.user.User;
import com.mdzvtt.shmap.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class BlockService {
    private final UserBlockRepository userBlockRepository;
    private final UserRepository userRepository;

    @Transactional
    public void block(Integer blockerId, Integer blockedId) {
        User blocked = userRepository.findById(blockedId).orElseThrow(UserNotFoundException::new);

        if (userBlockRepository.existsByBlockerIdAndBlockedId(blockerId, blockedId)) {
            return;
        }

        User blocker = userRepository.getReferenceById(blockerId);
        userBlockRepository.save(new UserBlock(blocker, blocked));
    }
}
