package com.mdzvtt.shmap.friend;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface FriendshipRepository extends JpaRepository<Friendship, Long> {
        String FAVORITES_FIRST_THEN_A_TO_Z = """
                        order by case when f.favoritedAt is null then 1 else 0 end,
                                 lower(u.firstName), lower(u.lastName), lower(u.username), u.id
                        """;

        boolean existsByUserIdAndFriendId(Integer userId, Integer friendId);

        Optional<Friendship> findByUserIdAndFriendId(Integer userId, Integer friendId);

        @Query("""
                        select f from Friendship f
                        join fetch f.friend u
                        where f.user.id = :userId
                        """ + FAVORITES_FIRST_THEN_A_TO_Z)
        List<Friendship> findFriends(Integer userId);

        @Query("""
                        select f from Friendship f
                        join fetch f.friend u
                        where f.user.id = :userId
                          and (concat(u.firstName, ' ', u.lastName) ilike %:#{escape(#text)}% escape :#{escapeCharacter()}
                               or u.username ilike %:#{escape(#text)}% escape :#{escapeCharacter()})
                        """ + FAVORITES_FIRST_THEN_A_TO_Z)
        List<Friendship> searchFriends(Integer userId, String text);

        @Modifying
        @Query("""
                        delete from Friendship f
                        where (f.user.id = :userId and f.friend.id = :friendId)
                           or (f.user.id = :friendId and f.friend.id = :userId)
                        """)
        int deleteBetween(Integer userId, Integer friendId);
}
