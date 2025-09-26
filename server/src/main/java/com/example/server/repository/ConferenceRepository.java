package com.example.server.repository;

import com.example.server.domain.Conference;
import com.example.server.utils.SQL;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ConferenceRepository extends JpaRepository<Conference, Integer> {
    // find conference by idEvent
    @Query(value = SQL.FIND_CONF_BY_IDEVENT,nativeQuery = true )
    Conference findByIdEvent(Integer idEvent);

}