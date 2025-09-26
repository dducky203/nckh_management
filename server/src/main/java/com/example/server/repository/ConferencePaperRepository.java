package com.example.server.repository;

import com.example.server.domain.ConferencePaper;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ConferencePaperRepository extends JpaRepository<ConferencePaper, Integer> {
    // find by id event
    @Query(value = "select * from conference_paper where id_event=?",nativeQuery = true)
    ConferencePaper findByIdEvent(Integer idEvent);

}