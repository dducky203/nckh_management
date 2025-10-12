package com.example.server.repository;

import com.example.server.domain.User;
import com.example.server.utils.SQL;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
//    // get user by username and password
//    @Query(value = SQL.GET_USER,nativeQuery = true)
//    User findByUsernameAndPassword(String username,String password);

    // get user by username and password
    @Query(value = "select * from user where username=? and password=?",nativeQuery = true)
    User findByUsernameAndPassword(String username,String password);

    // find by id
    @Query(value = SQL.FIND_USER_BY_ID, nativeQuery = true)
    User findByIdUser(Integer idUser);

    Optional<User> findByUsername(String username); // Trả về Optional<User>

    @Query(value = "SELECT u.* FROM user u " +
            "LEFT JOIN resume r ON u.username = r.code " +
            "WHERE (:username IS NULL OR u.username = :username) " +
            "OR (:username IS NULL OR r.email = :username)", nativeQuery = true)
    User findByUsernameOrEmail(@Param("username") String username);

    @Query(value = "SELECT u.* FROM User u JOIN Ncm n ON u.id = n.id_user\n" +
            "           WHERE n.id_group = :groupId",nativeQuery = true)
    List<User> findByNcmGroupId(@Param("groupId") int groupId);

    @Modifying
    @Query(value = "UPDATE user SET password = :newPassword", nativeQuery = true)
    int updateAllPasswords(@Param("newPassword") String newPassword);

}