package com.mdzvtt.shmap.auth.passwordreset;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.mdzvtt.shmap.user.User;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    Optional<PasswordResetToken> findByUser(User user);

    @org.springframework.transaction.annotation.Transactional
    void deleteByUser(User user);
}