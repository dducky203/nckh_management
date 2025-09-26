package com.example.server.repository;

import com.example.server.domain.MinistryTask;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Collection;
import java.util.List;
import java.util.Set;

public interface MinistryTaskRepository extends JpaRepository<MinistryTask, Integer> {
    // find by id event
    @Query(value = "select * from ministry_task where id_event=?",nativeQuery = true)
    MinistryTask findByIdEvent(Integer idEvent);

    List<MinistryTask> findByIdEventIn(Set<Integer> allEventIds);

}