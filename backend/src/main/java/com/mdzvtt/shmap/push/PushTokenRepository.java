package com.mdzvtt.shmap.push;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.NativeQuery;
import org.springframework.data.repository.query.Param;

public interface PushTokenRepository extends JpaRepository<PushToken, Long> {
    @Modifying
    @NativeQuery("""
            insert into push_token (token, user_id, created_at, updated_at)
            values (:token, :userId, now(), now())
            on conflict (token) do update
            set user_id = excluded.user_id, updated_at = now()
            """)
    void upsert(@Param("token") String token, @Param("userId") Integer userId);
}
