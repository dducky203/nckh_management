package com.example.server.repository;

import com.example.server.domain.StudentResearchGuidance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface StudentResearchGuidanceRepository extends JpaRepository<StudentResearchGuidance, Integer> {
    // find by id event
    @Query(value = "select * from student_research_guidance where id_event=?",nativeQuery = true)
    StudentResearchGuidance findByIdEvent(Integer idEvent);
}