package com.mdzvtt.shmap.route;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface RouteInterestRepository extends JpaRepository<RouteInterest, Long> {
    @Query("""
            select i from RouteInterest i
            join fetch i.user u
            join ChatMember m on m.chat = i.route.chat and m.user = u
            where i.route.id = :routeId
            """)
    List<RouteInterest> findForCurrentMembers(Long routeId);

    @Modifying
    @Query("delete from RouteInterest i where i.route.id = :routeId and i.user.id = :userId")
    int deleteByRouteIdAndUserId(Long routeId, Integer userId);
}
