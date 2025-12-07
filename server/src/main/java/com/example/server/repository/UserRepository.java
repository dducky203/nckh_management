package com.example.server.repository;

import com.example.server.domain.User;
import com.example.server.utils.SQL;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {

        // Phân trang và sắp xếp
        @NotNull
        Page<User> findAll(Pageable pageable);



        // find by id
        @Query(value = SQL.FIND_USER_BY_ID, nativeQuery = true)
        User findByIdUser(Integer idUser);

//        Optional<User> findByUsername(String username);
        User findByUsername(String username);



    @Query(value = "SELECT u.* FROM user u " +
            "LEFT JOIN resume r ON u.id_resume = r.id " +
            "WHERE (:username IS NOT NULL AND u.username = :username) " +
            "OR (:email IS NOT NULL AND r.email = :email)",
            nativeQuery = true)
    Optional<User> findByUsernameOrEmail(@Param("username") String username,
                                         @Param("email") String email);

    @Query(value = "SELECT u.* FROM user u " +
            "LEFT JOIN resume r ON u.id_resume = r.id " +
            "WHERE (:username IS NOT NULL AND u.username = :username) " +
            "OR (:username IS NOT NULL AND r.email = :username)",
            nativeQuery = true)
    User checkLogin(@Param("username") String username);


    @Query(value = "SELECT u.* FROM User u JOIN Ncm n ON u.id = n.id_user\n" +
                        "           WHERE n.id_group = :groupId", nativeQuery = true)
        List<User> findByNcmGroupId(@Param("groupId") int groupId);

        @Modifying
        @Query(value = "UPDATE user SET password = :newPassword", nativeQuery = true)
        int updateAllPasswords(@Param("newPassword") String newPassword);

        // Search và Filter methods
        @Query("SELECT u FROM User u WHERE u.power = :power")
        Page<User> findByPower(@Param("power") Integer power, Pageable pageable);

        @Query("SELECT u FROM User u LEFT JOIN u.idResume r WHERE " +
                        "LOWER(u.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
                        "LOWER(u.username) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
                        "LOWER(r.email) LIKE LOWER(CONCAT('%', :search, '%'))")
        Page<User> findBySearch(@Param("search") String search, Pageable pageable);

        @Query("SELECT u FROM User u LEFT JOIN u.idResume r WHERE " +
                        "(LOWER(u.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
                        "LOWER(u.username) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
                        "LOWER(r.email) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
                        "u.power = :power")
        Page<User> findBySearchAndPower(@Param("search") String search, @Param("power") Integer power,
                        Pageable pageable);

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

        // Search users by username or email
        @Query("SELECT u FROM User u LEFT JOIN u.idResume r WHERE " +
                        "LOWER(u.username) LIKE LOWER(CONCAT('%', :username, '%')) OR " +
                        "LOWER(r.email) LIKE LOWER(CONCAT('%', :email, '%'))")
        Page<User> findByUsernameContainingIgnoreCaseOrEmailContainingIgnoreCase(
                        @Param("username") String username, 
                        @Param("email") String email, 
                        Pageable pageable);

}