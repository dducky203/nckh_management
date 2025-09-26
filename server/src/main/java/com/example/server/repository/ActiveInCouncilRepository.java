package com.example.server.repository;

import com.example.server.domain.ActiveInCouncil;
import com.example.server.domain.Conference;
import com.example.server.utils.SQL;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ActiveInCouncilRepository extends JpaRepository<ActiveInCouncil, Integer> {
    @Query(value = "select * from active_in_council where id_event=?",nativeQuery = true )
    ActiveInCouncil findByIdEvent(Integer idEvent);
}
