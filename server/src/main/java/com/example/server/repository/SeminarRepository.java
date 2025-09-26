package com.example.server.repository;

import com.example.server.domain.Seminar;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface SeminarRepository extends JpaRepository<Seminar, Integer> {
    // find by id event
    @Query(value = "select * from seminar where id_event=?",nativeQuery = true)
    Seminar findByIdEvent(Integer idEvent);
}