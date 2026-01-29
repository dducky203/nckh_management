package com.example.server.repository;

import com.example.server.domain.Event;

import com.example.server.utils.SQL;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Integer> {
    // show all ,order by create date 'desc'
    @Query(value = SQL.SHOW_ALL_EVENT, nativeQuery = true)
    List<Event> showALlEvent();

    // show all ,order by create date 'desc'
    @Query(value = SQL.SHOW_ALL_EVENT_STATUS_2, nativeQuery = true)
    List<Event> showALlEventStatus2();

    // find by idEvent
    @Query(value = SQL.FIND_BY_ID_EVENT, nativeQuery = true)
    Event findByIdEvent(int idEvent);

    // filter by name
    @Query(value = SQL.FILTER_BY_NAME, nativeQuery = true)
    List<Event> findByName(Integer idOperatingStandard2);

    // filter by id criteria
    @Query(value = SQL.FILTER_EV_BY_CRITERIA, nativeQuery = true)
    List<Event> findByCriteria(Integer idCriteria);

    // show event -> id user
    @Query(value = SQL.SHOW_EVENT_TO_USER, nativeQuery = true)
    List<Event> findToIdUser(Integer idUser);

    // month and count ev by year
    @Query(value = SQL.COUNT_EVENT_PER_MONTH, nativeQuery = true)
    List<Object[]> countEventsPerMonth(@Param("year") int year);

    // show ev by month/year
    @Query(value = SQL.SHOW_EV_BY_MONTH, nativeQuery = true)
    List<Event> findByMonth(int month, int year);

    //get top 5 upcoming events
    @Query(value = SQL.GET_TOP5_EV, nativeQuery = true)
    List<Event> getTop5Events();


    // get ev by user have power 5 ( thu ki NCM)
    @Query(value = "select * from event where status=1 or status IS NULL", nativeQuery = true)
    List<Event> getEventsByStatus1();

    // get event by idOS2 and year(dateOfEvent)
    @Query(value = SQL.GET_EVENT_BY_OS2_AND_YEAR, nativeQuery = true)
    List<Event> getEvByOS2AndYear(int os2, int year);

    @Query(value = "SELECT * FROM event  WHERE YEAR(event.date_of_event) = :year", nativeQuery = true)
    List<Event> findAllByYear(@Param("year") int year);

    @Query("""
                SELECT e FROM Event e
                WHERE e.isDelete = 1
                 AND (:typeId IS NULL OR e.typeId.id = :typeId)
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
    List<Event> findByStatusAndType(
            @Param("status") String status,
            @Param("typeId") Integer typeId
    );


}