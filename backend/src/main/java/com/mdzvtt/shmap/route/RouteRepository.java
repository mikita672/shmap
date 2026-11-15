package com.mdzvtt.shmap.route;

import com.mdzvtt.shmap.feed.FeedCursor;
import jakarta.persistence.LockModeType;
import org.springframework.data.domain.Limit;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;

import java.time.Instant;
import java.util.Collection;
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

    String FEED_KEYS = "select new com.mdzvtt.shmap.feed.FeedCursor(r.completion.completedAt, r.id)"
            + " from Route r where r.completion.completedAt is not null and " + RouteQueries.IN_FRIENDS_FEED;

    String NEWEST_DONE_FIRST = " order by r.completion.completedAt desc, r.id desc";

    @Query(FEED_KEYS + NEWEST_DONE_FIRST)
    List<FeedCursor> findFeedKeys(Integer viewerId, Limit limit);

    @Query(FEED_KEYS + " and (r.completion.completedAt, r.id) < (:completedAt, :routeId)" + NEWEST_DONE_FIRST)
    List<FeedCursor> findFeedKeysBefore(Integer viewerId, Instant completedAt, Long routeId, Limit limit);

    @EntityGraph(attributePaths = { "participants", "stops" })
    List<Route> findWithParticipantsAndStopsByIdIn(Collection<Long> ids);
}
