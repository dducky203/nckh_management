package com.example.server.repository;

import com.example.server.domain.ExpertPresentation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ExpertPresentationRepository extends JpaRepository<ExpertPresentation, Integer> {
    // find by id event
    @Query(value = "select * from expert_presentation where id_event=?",nativeQuery = true)
    ExpertPresentation findByIdEvent(Integer idEvent);
}