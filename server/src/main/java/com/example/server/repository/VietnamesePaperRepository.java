package com.example.server.repository;

import com.example.server.domain.VietnamesePaper;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface VietnamesePaperRepository extends JpaRepository<VietnamesePaper, Integer> {
    // find by id event
    @Query(value = "select * from vietnamese_paper where id_event=?",nativeQuery = true)
    VietnamesePaper findByIdEvent(Integer idEvent);
}