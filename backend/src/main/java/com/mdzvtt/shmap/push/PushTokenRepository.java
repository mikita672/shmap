package com.mdzvtt.shmap.push;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.NativeQuery;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;

public interface PushTokenRepository extends JpaRepository<PushToken, Long> {
    @Modifying
    @NativeQuery("""
            insert into push_token (token, user_id, created_at, updated_at)
            values (:token, :userId, now(), now())
            on conflict (token) do update
            set user_id = excluded.user_id, updated_at = now()
            """)
    void upsert(@Param("token") String token, @Param("userId") Integer userId);

    @Modifying
    @Query("delete from PushToken t where t.user.id = :userId and t.token <> :token")
    void deleteOtherTokens(@Param("userId") Integer userId, @Param("token") String token);

    @Modifying
    @Query("delete from PushToken t where t.user.id = :userId")
    void deleteAllByUserId(@Param("userId") Integer userId);

    @Modifying
    @Query("delete from PushToken t where t.token in :tokens")
    void deleteByTokenIn(@Param("tokens") Collection<String> tokens);

    @Query("select t.token from PushToken t where t.user.id in :userIds")
    List<String> findTokensByUserIdIn(@Param("userIds") Collection<Integer> userIds);
}
