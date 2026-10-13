package com.mdzvtt.shmap.friend;

import org.springframework.data.jpa.repository.JpaRepository;

public interface SuggestionDismissalRepository extends JpaRepository<SuggestionDismissal, Long> {
    boolean existsByUserIdAndDismissedId(Integer userId, Integer dismissedId);
}
