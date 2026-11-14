package com.mdzvtt.shmap.route;

import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface RouteRepository extends JpaRepository<Route, Long> {
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select r from Route r where r.id = :id")
    Optional<Route> findByIdForUpdate(Long id);

    @Query("""
            select new com.mdzvtt.shmap.route.RouteListRow(
                r.id, r.name, r.travelMode, size(r.stops),
                r.path.distanceMeters, r.path.durationSeconds, r.completion.finishedOn,
                u, r.createdAt, r.updatedAt)
            from Route r
            join r.createdBy u
            where r.chat.id = :chatId
            order by r.updatedAt desc, r.id desc
            """)
    List<RouteListRow> findSummaries(Long chatId);

    @EntityGraph(attributePaths = { "createdBy", "stops", "stops.addedBy" })
    @Query("""
            select r from Route r
            join ChatMember m on m.chat = r.chat
            where r.id = :routeId
              and m.user.id = :userId
            """)
    Optional<Route> findForMember(Long routeId, Integer userId);

    @EntityGraph(attributePaths = { "createdBy", "stops", "stops.addedBy" })
    @Query("select r from Route r where r.id = :routeId and " + RouteQueries.VISIBLE_TO_VIEWER)
    Optional<Route> findVisibleTo(Long routeId, Integer viewerId);
}
