package com.example.server.DTO;

import com.example.server.domain.Event;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class EventBannerDTO {
    // Getters
    private Event eventId;
    private String image;
    private LocalDateTime dateTimeOfEvent;

    // Constructor
    public EventBannerDTO(Event eventId, String image,LocalDateTime dateTimeOfEvent) {
        this.eventId = eventId;
        this.image = image;
        this.dateTimeOfEvent = dateTimeOfEvent;
    }

}
