package com.mdzvtt.shmap.auth.passwordreset;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import com.mdzvtt.shmap.user.User;
import jakarta.persistence.LockModeType;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    Optional<PasswordResetToken> findByUser(User user);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT t FROM PasswordResetToken t WHERE t.user = :user")
    Optional<PasswordResetToken> findByUserForUpdate(User user);

    @org.springframework.transaction.annotation.Transactional
    void deleteByUser(User user);
}