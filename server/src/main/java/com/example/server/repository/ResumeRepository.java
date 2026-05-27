package com.example.server.repository;

import com.example.server.domain.Admin;
import com.example.server.domain.Resume;
import com.example.server.utils.SQL;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface ResumeRepository extends JpaRepository<Resume, Integer> {
    Resume findResumeById(Integer id);

    // Check if email exists
    boolean existsByEmail(String email);

    // Check if phone exists
    boolean existsByPhone(String phone);

    // Check if email exists excluding current user
    @Query("SELECT CASE WHEN COUNT(r) > 0 THEN true ELSE false END FROM Resume r " +
            "LEFT JOIN User u ON u.idResume.id = r.id " +
            "WHERE r.email = :email AND u.id != :userId")
    boolean existsByEmailExcludingUser(String email, Integer userId);

    // Check if phone exists excluding current user
    @Query("SELECT CASE WHEN COUNT(r) > 0 THEN true ELSE false END FROM Resume r " +
            "LEFT JOIN User u ON u.idResume.id = r.id " +
            "WHERE r.phone = :phone AND u.id != :userId")
    boolean existsByPhoneExcludingUser(String phone, Integer userId);
}