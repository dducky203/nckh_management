package com.example.server.repository;

import com.example.server.domain.Resume;
import com.example.server.domain.User;
import com.example.server.utils.SQL;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

        // Phân trang và sắp xếp
        @NotNull
        Page<User> findAll(@NotNull Pageable pageable);


        User findByIdResume(Resume idResume);

        // find by id
        @Query(value = SQL.FIND_USER_BY_ID, nativeQuery = true)
        User findByIdUser(Integer idUser);

        // Optional<User> findByUsername(String username);
        User findByUsername(String username);


        @Query(value = "SELECT u.* FROM user u " +
                        "LEFT JOIN resume r ON u.id_resume = r.id " +
                        "WHERE (:username IS NOT NULL AND u.username = :username) " +
                        "OR (:username IS NOT NULL AND r.email = :username)", nativeQuery = true)
        User checkLogin(@Param("username") String username);


        // Universal filter method
        @Query("SELECT u FROM User u LEFT JOIN u.idResume r WHERE " +
                        "(:search IS NULL OR " +
                        "LOWER(u.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
                        "LOWER(u.username) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
                        "LOWER(r.email) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
                        "(:power IS NULL OR u.power = :power) AND " +
                        "(:inActive IS NULL OR u.inActive = :inActive) AND " +
                        "(:isDeleted IS NULL OR u.isDeleted = :isDeleted)")
        Page<User> findWithFilters(@Param("search") String search,
                        @Param("power") Integer power,
                        @Param("inActive") Boolean inActive,
                        @Param("isDeleted") Boolean isDeleted,
                        Pageable pageable);

        @Query("SELECT u FROM User u LEFT JOIN u.idResume r WHERE " +
            "(LOWER(u.username) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(r.email) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(u.name) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
            "AND (:mode = 'ALL' " +
            "     OR (:mode = 'STUDENT' AND u.idTitle.name = 'Sinh viên') " +
            "     OR (:mode = 'OTHERS' AND u.idTitle.name != 'Sinh viên'))")
        Page<User> searchUsers(
                    @Param("keyword") String keyword,
                    @Param("mode") String mode,
                    Pageable pageable);

    @Query("SELECT u FROM User u LEFT JOIN u.idTitle t WHERE " +
            "(u.isDeleted = false OR u.isDeleted IS NULL) AND " +
            "(t IS NULL OR t.name <> 'Sinh viên') " +
            "ORDER BY u.name ASC, u.username ASC")
    List<User> findUsersForPlanStatistics();


    @Query("SELECT u FROM User u LEFT JOIN u.idTitle t WHERE " +
            "(u.isDeleted = false OR u.isDeleted IS NULL) AND " +
            "(t IS NULL OR t.name <> 'Sinh viên') AND " +
            "NOT EXISTS (SELECT 1 FROM UserPlanYear p WHERE p.userId = u.id AND p.academicYear = :year) " +
            "ORDER BY u.name ASC, u.username ASC")
    List<User> findUsersWithoutPlanForYear(@Param("year") Integer year);

}