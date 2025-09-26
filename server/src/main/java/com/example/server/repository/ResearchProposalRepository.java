package com.example.server.repository;

import com.example.server.domain.ResearchProposal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ResearchProposalRepository extends JpaRepository<ResearchProposal, Integer> {
    // find by id event
    @Query(value = "select *from research_proposal where id_event=?",nativeQuery = true)
    ResearchProposal findByIdEvent(Integer idEvent);
}