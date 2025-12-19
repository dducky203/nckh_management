package com.example.server.repository;

import com.example.server.domain.ResearchGroupDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResearchGroupDocumentRepository extends JpaRepository<ResearchGroupDocument, Integer> {
    
    List<ResearchGroupDocument> findByResearchGroupId(Integer researchGroupId);
    
    void deleteByResearchGroupId(Integer researchGroupId);
}

