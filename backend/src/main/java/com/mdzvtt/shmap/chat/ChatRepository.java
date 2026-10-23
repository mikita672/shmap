package com.mdzvtt.shmap.chat;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ChatRepository extends JpaRepository<Chat, Long> {
    Optional<Chat> findByDirectUserLowIdAndDirectUserHighId(Integer lowId, Integer highId);
}
