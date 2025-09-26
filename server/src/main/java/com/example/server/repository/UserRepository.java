package com.example.server.repository;

import com.example.server.domain.User;
import com.example.server.utils.SQL;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

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

    User findByUsername(String username);

    @Query(value = "SELECT u.* FROM User u JOIN Ncm n ON u.id = n.id_user\n" +
            "           WHERE n.id_group = :groupId",nativeQuery = true)
    List<User> findByNcmGroupId(@Param("groupId") int groupId);

}