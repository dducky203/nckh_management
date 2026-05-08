package com.example.server.service;

import com.example.server.DTO.event.EventGuestDTO;
import com.example.server.DTO.event.EventPublicDTO;
import com.example.server.DTO.event.EventRegistrationDTO;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public interface EventPublicService {

    
    List<EventPublicDTO> getPublicEvents(String status);

   
    Map<String, Object> getPublicEventsWithPagination(String status, int page, int size);

    EventPublicDTO getEventById(Integer eventId);

    List<EventPublicDTO> searchAndFilterEvents(String status, String type, String searchTerm);

    String registerEvent(Integer eventId, Integer userId, EventRegistrationDTO registrationData);

    boolean isUserRegistered(Integer eventId, Integer userId);

    String unregisterEvent(Integer eventId, Integer userId);

    List<EventGuestDTO> getEventRegistrations(Integer eventId, Integer userId);

    EventPublicDTO createEvent(EventPublicDTO eventData);

    EventPublicDTO updateEvent(Integer eventId, EventPublicDTO eventData);
 
    String approveEvent(Integer eventId);

    String rejectEvent(Integer eventId, String reason);

    String deleteEvent(Integer eventId);
}
