package com.mdzvtt.shmap.suggestion;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface RouteSuggestionSetRepository extends JpaRepository<RouteSuggestionSet, Long> {
    @EntityGraph(attributePaths = { "suggestedBy", "suggestions" })
    Optional<RouteSuggestionSet> findByRouteId(Long routeId);

    @Modifying
    @Query("delete from RouteSuggestionSet s where s.route.id = :routeId")
    int deleteByRouteId(Long routeId);
}
