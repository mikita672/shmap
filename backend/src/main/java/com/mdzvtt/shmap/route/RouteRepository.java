package com.mdzvtt.shmap.route;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface RouteRepository extends JpaRepository<Route, Long> {
    @Query("""
            select new com.mdzvtt.shmap.route.RouteListRow(r, u, size(r.stops))
            from Route r
            join r.createdBy u
            where r.chat.id = :chatId
            order by r.updatedAt desc, r.id desc
            """)
    List<RouteListRow> findSummaries(Long chatId);
}
