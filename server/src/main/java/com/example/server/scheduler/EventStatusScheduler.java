package com.example.server.scheduler;

import com.example.server.domain.Event;
import com.example.server.repository.EventRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;


@Slf4j
@Component
public class EventStatusScheduler {

    @Autowired
    private EventRepository eventRepository;

    @Scheduled(cron = "0 0 0 * * *")
    public void updateEventStatuses() {
        log.info("Starting scheduled task to update event statuses");

        LocalDate today = LocalDate.now();

        
        List<Event> upcomingEvents = eventRepository.findAll().stream()
                .filter(e -> "upcoming".equals(e.getStatus()))
                .filter(e -> e.getDateOfEvent() != null && e.getDateOfEvent().isBefore(today))
                .collect(Collectors.toList());

        if (!upcomingEvents.isEmpty()) {
            log.info("Found {} upcoming events that need to be marked as completed", upcomingEvents.size());

            // Update status to "completed"
            for (Event event : upcomingEvents) {
                event.setStatus("completed");
                log.info("Updated event ID {} '{}' from 'upcoming' to 'completed'",
                        event.getId(), event.getEventName());
            }

            eventRepository.saveAll(upcomingEvents);
            log.info("Successfully updated {} events to 'completed' status", upcomingEvents.size());
        } else {
            log.info("No upcoming events to update");
        }

       
        softDeleteOldRejectedEvents();
    }

    
    private void softDeleteOldRejectedEvents() {
        log.info("Starting cleanup of old rejected events");

        LocalDate sevenDaysAgo = LocalDate.now().minusDays(7);

       
        List<Event> oldRejectedEvents = eventRepository.findAll().stream()
                .filter(e -> "rejected".equals(e.getStatus()))
                .filter(e -> e.getIsDelete() != null && e.getIsDelete() == 1) // Not yet deleted
                .filter(e -> {
                    if (e.getUpdatedAt() == null) {
                        return false;
                    }
                    
                    LocalDate updatedDate = e.getUpdatedAt().toInstant()
                            .atZone(java.time.ZoneId.systemDefault())
                            .toLocalDate();
                    return updatedDate.isBefore(sevenDaysAgo);
                })
                .collect(Collectors.toList());

        if (!oldRejectedEvents.isEmpty()) {
            log.info("Found {} rejected events older than 7 days to be permanently deleted", oldRejectedEvents.size());

            
            for (Event event : oldRejectedEvents) {
                log.info("Permanently deleting rejected event ID {} '{}' (rejected on: {})",
                        event.getId(),
                        event.getEventName(),
                        event.getUpdatedAt());
            }

            eventRepository.deleteAll(oldRejectedEvents);
            log.info("Successfully permanently deleted {} old rejected events", oldRejectedEvents.size());
        } else {
            log.info("No old rejected events to delete");
        }
    }
}
