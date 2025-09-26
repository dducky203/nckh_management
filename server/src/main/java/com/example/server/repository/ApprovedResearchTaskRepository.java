package com.example.server.repository;

import com.example.server.domain.ApprovedResearchTask;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ApprovedResearchTaskRepository extends JpaRepository<ApprovedResearchTask, Integer> {
    // find by id event
    @Query(value = "select * from approved_research_task where id_event=?",nativeQuery = true)
    ApprovedResearchTask findByIdEvent(Integer idEvent);

}