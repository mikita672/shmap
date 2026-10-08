package com.mdzvtt.shmap.user;

import jakarta.persistence.LockModeType;
import org.springframework.data.domain.Limit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
        String A_TO_Z = """
                        order by lower(u.firstName), lower(u.lastName), lower(u.username), u.id
                        """;

        Optional<User> findByEmail(String email);

        Optional<User> findByUsername(String username);

        boolean existsByUsername(String username);

        boolean existsByUsernameAndIdNot(String username, Integer id);

        boolean existsByEmailAndIdNot(String email, Integer id);

        @Lock(LockModeType.PESSIMISTIC_WRITE)
        @Query("select u from User u where u.id in :ids order by u.id")
        List<User> findAllByIdForUpdate(Collection<Integer> ids);

        @Query("""
                        select u from User u
                        where concat(u.firstName, ' ', u.lastName) ilike %:#{escape(#text)}% escape :#{escapeCharacter()}
                           or u.username ilike %:#{escape(#text)}% escape :#{escapeCharacter()}
                        """
                        + A_TO_Z)
        List<User> search(String text, Limit limit);

        @Query("""
                        select u from User u
                        where u.username ilike :#{escape(#prefix)}% escape :#{escapeCharacter()}
                        """ + A_TO_Z)
        List<User> searchByUsername(String prefix, Limit limit);
}
