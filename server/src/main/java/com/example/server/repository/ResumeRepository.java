package com.example.server.repository;

import com.example.server.domain.Admin;
import com.example.server.domain.Resume;
import com.example.server.utils.SQL;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ResumeRepository extends JpaRepository<Resume, Integer> {
    // find by idUSer for resume
    @Query(value = SQL.FIND_BY_IDUSER,nativeQuery = true)
    Resume findByIdUser(Integer idUser);

    // find by idAdmin for resume
//    @Query(value = SQL.FIND_BY_IDUSER,nativeQuery = true)
    Resume findByIdAdmin(Admin idAdmin);
}