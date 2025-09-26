package com.example.server.repository;

import com.example.server.domain.OverviewPaper;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface OverviewPaperRepository extends JpaRepository<OverviewPaper, Integer> {
    // find by id event
    @Query(value = "select * from overview_paper where id_event=?",nativeQuery = true)
    OverviewPaper findByIdEvent(Integer idEvent);
}