package com.example.server.repository;

import com.example.server.domain.Admin;
import com.example.server.utils.SQL;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface AdminRepository extends JpaRepository<Admin, Integer> {
    // get admin by username and password
    @Query(value = SQL.GET_ADMIN,nativeQuery = true)
    Admin findAdminByUsernameAndPassword(String username,String password);

    Admin findByUsername(String username);

    Admin findById(int idAdmin);
}