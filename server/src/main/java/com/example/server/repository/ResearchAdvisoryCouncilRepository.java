package com.example.server.repository;

import com.example.server.domain.ResearchAdvisoryCouncil;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ResearchAdvisoryCouncilRepository extends JpaRepository<ResearchAdvisoryCouncil, Integer> {
    // find by id event
    @Query(value = "select * from research_advisory_council where id_event=?",nativeQuery = true)
    ResearchAdvisoryCouncil findByIdEvent(Integer idEvent);
}