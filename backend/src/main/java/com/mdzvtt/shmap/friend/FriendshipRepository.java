package com.mdzvtt.shmap.friend;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.Set;

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
                        """
                        + FAVORITES_FIRST_THEN_A_TO_Z)
        List<Friendship> searchFriends(Integer userId, String text);

        @Query("""
                        select f from Friendship f
                        join fetch f.friend u
                        where f.user.id = :userId
                          and u.username ilike :#{escape(#prefix)}% escape :#{escapeCharacter()}
                        """ + FAVORITES_FIRST_THEN_A_TO_Z)
        List<Friendship> searchFriendsByUsername(Integer userId, String prefix);

        @Query("""
                        select f.friend.id from Friendship f
                        where f.user.id = :userId
                          and f.friend.id in :candidateIds
                        """)
        Set<Integer> findFriendIdsAmong(Integer userId, Collection<Integer> candidateIds);

        @Query("""
                        select new com.mdzvtt.shmap.friend.MutualFriendsCount(theirs.user.id, count(theirs))
                        from Friendship mine
                        join Friendship theirs on theirs.friend = mine.friend
                        where mine.user.id = :userId
                          and theirs.user.id in :candidateIds
                        group by theirs.user.id
                        """)
        List<MutualFriendsCount> countMutualFriends(Integer userId, Collection<Integer> candidateIds);

        @Modifying
        @Query("""
                        delete from Friendship f
                        where (f.user.id = :userId and f.friend.id = :friendId)
                           or (f.user.id = :friendId and f.friend.id = :userId)
                        """)
        int deleteBetween(Integer userId, Integer friendId);
}
