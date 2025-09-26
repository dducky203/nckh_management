package com.example.server.repository;

import com.example.server.domain.Event;
import com.example.server.domain.Guest;
import com.example.server.domain.User;
import com.example.server.projection.IGuest;
import com.example.server.utils.SQL;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GuestRepository extends JpaRepository<Guest, Integer> {
    // guest by event id
    @Query(value = SQL.GUEST_BY_EVENT_ID,nativeQuery = true)
    List<Guest> findByEventId(Integer eventId);

    // count guest
    @Query(value = SQL.COUNT_GUEST,nativeQuery = true)
    IGuest countGuest(Integer eventId);

    Guest findByEventAndUser(Event event, User user);
    
    boolean existsByUserId(Integer userId);

    Guest findByUserIdAndEventId(Integer userId, Integer eventId);

    boolean existsByUserIdAndEventId(Integer userId, Integer eventId);


    List<Guest> findByUserId(Integer userId);
}
