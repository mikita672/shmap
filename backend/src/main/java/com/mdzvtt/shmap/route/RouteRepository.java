package com.mdzvtt.shmap.route;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface RouteRepository extends JpaRepository<Route, Long> {
    @Query("""
            select new com.mdzvtt.shmap.route.RouteListRow(r, u, size(r.stops))
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
}
