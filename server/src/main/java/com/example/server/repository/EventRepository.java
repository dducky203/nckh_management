package com.example.server.repository;

import com.example.server.domain.Event;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Integer> {

    @Query("""
                SELECT e FROM Event e
                WHERE e.isDelete = 1
                  AND (
                       (:status = 'upcoming'
                            AND e.status = 'upcoming'
                            AND e.dateOfEvent > CURRENT_DATE)
                    OR (:status = 'completed'
                            AND (e.status = 'completed'
                                 OR e.dateOfEvent < CURRENT_DATE))
                    OR (:status = 'pending'
                            AND e.status = 'pending')
                    OR (:status = 'rejected'
                            AND e.status = 'rejected')
                    OR (:status IS NULL
                            AND e.dateOfEvent = CURRENT_DATE)
                  )
            """)
    List<Event> findByStatus(@Param("status") String status);


}