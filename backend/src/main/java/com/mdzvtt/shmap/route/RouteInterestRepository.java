package com.mdzvtt.shmap.route;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface RouteInterestRepository extends JpaRepository<RouteInterest, Long> {
    @Modifying
    @Query("delete from RouteInterest i where i.route.id = :routeId and i.user.id = :userId")
    int deleteByRouteIdAndUserId(Long routeId, Integer userId);
}
