package com.example.server.repository;

import com.example.server.domain.InternationalPaper;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface InternationalPaperRepository extends JpaRepository<InternationalPaper, Integer> {
    // find by id event
    @Query(value = "select * from international_paper where id_event=?",nativeQuery = true)
    InternationalPaper findByIdEvent(Integer idEvent);

}