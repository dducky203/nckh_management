package com.example.server.service.Impl;

import com.example.server.DTO.event.EventPublicDTO;
import com.example.server.DTO.event.EventRegistrationDTO;
import com.example.server.domain.*;
import com.example.server.repository.*;
import com.example.server.service.EventPublicService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class EventPublicServiceImpl implements EventPublicService {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private ConferenceRepository conferenceRepository;

    @Autowired
    private SeminarRepository seminarRepository;

    @Autowired
    private TypeOfCriterionRepository typeOfCriterionRepository;

    @Autowired
    private GuestRepository guestRepository;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private TImeRepository timeRepository;

    @Override
    public List<EventPublicDTO> getPublicEvents(String status) {
        List<Event> events;
        
        switch (status.toLowerCase()) {
            case "upcoming":
                events = eventRepository.findAll().stream()
                    .filter(e -> e.getIsDelete() != null && e.getIsDelete() == 1)
                    .filter(e -> "upcoming".equals(e.getStatus()))
                    .filter(e -> e.getDateOfEvent() != null && e.getDateOfEvent().isAfter(LocalDate.now()))
                    .collect(Collectors.toList());
                break;
            case "completed":
                events = eventRepository.findAll().stream()
                    .filter(e -> e.getIsDelete() != null && e.getIsDelete() == 1)
                    .filter(e -> "completed".equals(e.getStatus()) || 
                            (e.getDateOfEvent() != null && e.getDateOfEvent().isBefore(LocalDate.now())))
                    .collect(Collectors.toList());
                break;
            case "pending":
                events = eventRepository.findAll().stream()
                    .filter(e -> e.getIsDelete() != null && e.getIsDelete() == 1)
                    .filter(e -> "pending".equals(e.getStatus()))
                    .collect(Collectors.toList());
                break;
            case "rejected":
                events = eventRepository.findAll().stream()
                    .filter(e -> e.getIsDelete() != null && e.getIsDelete() == 1)
                    .filter(e -> "rejected".equals(e.getStatus()))
                    .collect(Collectors.toList());
                break;
            default:
                events = eventRepository.findAll().stream()
                    .filter(e -> e.getIsDelete() != null && e.getIsDelete() == 1)
                    .collect(Collectors.toList());
                break;
        }
        
        return convertToDTOsBatch(events);
    }

    @Override
    public EventPublicDTO getEventById(Integer eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sự kiện với ID: " + eventId));

        if (event.getIsDelete() == null || event.getIsDelete() != 1) {
            throw new RuntimeException("Sự kiện không khả dụng");
        }

        return convertToDTO(event);
    }

    @Override
    public List<EventPublicDTO> searchAndFilterEvents(String status, String type, String searchTerm) {
        List<EventPublicDTO> events = getPublicEvents(status);

        if (type != null && !type.equals("all") && !type.isEmpty()) {
            events = events.stream()
                    .filter(e -> type.equalsIgnoreCase(e.getType()))
                    .collect(Collectors.toList());
        }

        if (searchTerm != null && !searchTerm.trim().isEmpty()) {
            String searchLower = searchTerm.toLowerCase();
            events = events.stream()
                    .filter(e -> (e.getEventName() != null && e.getEventName().toLowerCase().contains(searchLower)) ||
                            (e.getLocation() != null && e.getLocation().toLowerCase().contains(searchLower)) ||
                            (e.getOrganizer() != null && e.getOrganizer().toLowerCase().contains(searchLower)) ||
                            (e.getDescription() != null && e.getDescription().toLowerCase().contains(searchLower)))
                    .collect(Collectors.toList());
        }

        return events;
    }

    @Override
    public String registerEvent(Integer eventId, Integer userId, EventRegistrationDTO registrationData) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sự kiện"));

        if (!"upcoming".equals(event.getStatus()) || event.getIsDelete() != 1) {
            throw new RuntimeException("Sự kiện không khả dụng");
        }

        if (event.getDateOfEvent().isBefore(LocalDate.now())) {
            throw new RuntimeException("Sự kiện đã diễn ra, không thể đăng ký");
        }

        // Kiểm tra đã đăng ký chưa
        boolean alreadyRegistered = guestRepository.findAll().stream()
                .anyMatch(g -> g.getEvent() != null && g.getEvent().getId().equals(eventId) &&
                              g.getUser() != null && g.getUser().getId().equals(userId));

        if (alreadyRegistered) {
            throw new RuntimeException("Bạn đã đăng ký sự kiện này rồi");
        }

        Guest guest = new Guest();
        guest.setEvent(event);
        guest.setUser(userRepository.findById(userId).orElse(null));
        guest.setFullName(registrationData.getFullName());
        guest.setEmail(registrationData.getEmail());
        guest.setPhone(registrationData.getPhone());
        guest.setOrganization(registrationData.getOrganization());
        guest.setNote(registrationData.getNote());
        guestRepository.save(guest);

        return "Đăng ký sự kiện thành công";
    }

    @Override
    public boolean isUserRegistered(Integer eventId, Integer userId) {
        if (userId == null) return false;
        
        return guestRepository.findAll().stream()
                .anyMatch(g -> g.getEvent() != null && g.getEvent().getId().equals(eventId) &&
                              g.getUser() != null && g.getUser().getId().equals(userId));
    }

    @Override
    public String unregisterEvent(Integer eventId, Integer userId) {
        List<Guest> guests = guestRepository.findAll().stream()
                .filter(g -> g.getEvent() != null && g.getEvent().getId().equals(eventId) &&
                            g.getUser() != null && g.getUser().getId().equals(userId))
                .collect(Collectors.toList());

        if (guests.isEmpty()) {
            throw new RuntimeException("Bạn chưa đăng ký sự kiện này");
        }

        guestRepository.deleteAll(guests);
        return "Hủy đăng ký thành công";
    }
      

    @Override
    public Map<String, Object> getPublicEventsWithPagination(String status, int page, int size) {
        List<EventPublicDTO> allEvents = getPublicEvents(status);

        int totalItems = allEvents.size();
        int totalPages = (totalItems + size - 1) / size;
        int startIndex = page * size;
        int endIndex = Math.min(startIndex + size, totalItems);

        List<EventPublicDTO> paginatedEvents = startIndex < totalItems ? 
            allEvents.subList(startIndex, endIndex) : new ArrayList<>();

        Map<String, Object> response = new HashMap<>();
        response.put("events", paginatedEvents);
        response.put("currentPage", page);
        response.put("totalPages", totalPages);
        response.put("totalItems", totalItems);
        response.put("itemsPerPage", size);
        response.put("hasNext", page < totalPages - 1);
        response.put("hasPrevious", page > 0);

        return response;
    }

    @Override
    public EventPublicDTO createEvent(EventPublicDTO eventData) {
        Event event = new Event();
        event.setEventName(eventData.getEventName());
        event.setDateOfEvent(eventData.getDateOfEvent());
        event.setStartTime(eventData.getStartTime());
        event.setEndTime(eventData.getEndTime());
        event.setCreator(eventData.getCreator() != null ? eventData.getCreator() : 1);
        event.setStatus("pending");
        event.setIsDelete(1);
        event.setBannerImg(eventData.getBannerImg());

        // Set room nếu có roomId
        if (eventData.getRoomId() != null) {
            Room room = roomRepository.findById(eventData.getRoomId()).orElse(null);
            if (room != null) {
                event.setIdRoom(room);
            }
        }

        Event savedEvent = eventRepository.save(event);


        if ("conference".equalsIgnoreCase(eventData.getType())) {
            Conference conference = new Conference();
            conference.setIdEvent(savedEvent.getId());
            conference.setImage(eventData.getImage());
            conference.setPaperTitle(eventData.getDescription());
            conference.setArticleLink(eventData.getArticleLink());
            conferenceRepository.save(conference);
        } else {
            Seminar seminar = new Seminar();
            seminar.setIdEvent(savedEvent.getId());
            seminar.setSeminarPhoto(eventData.getImage());
            seminar.setMainAuthor(eventData.getDescription());
            seminar.setArticleLink(eventData.getArticleLink());
            seminarRepository.save(seminar);
        }

        return convertToDTO(savedEvent);
    }


    private List<EventPublicDTO> convertToDTOsBatch(List<Event> events) {
        if (events.isEmpty()) return new ArrayList<>();

        // Batch load conferences, seminars và rooms
        List<Integer> eventIds = events.stream().map(Event::getId).collect(Collectors.toList());
        
        Map<Integer, Conference> conferenceMap = conferenceRepository.findAll().stream()
                .filter(c -> eventIds.contains(c.getIdEvent()))
                .collect(Collectors.toMap(Conference::getIdEvent, c -> c));
        
        Map<Integer, Seminar> seminarMap = seminarRepository.findAll().stream()
                .filter(s -> eventIds.contains(s.getIdEvent()))
                .collect(Collectors.toMap(Seminar::getIdEvent, s -> s));

        // Batch load rooms
        Set<Integer> roomIds = events.stream()
                .filter(e -> e.getIdRoom() != null)
                .map(e -> e.getIdRoom().getId())
                .collect(Collectors.toSet());
        
        Map<Integer, Room> roomMap = roomRepository.findAll().stream()
                .filter(r -> roomIds.contains(r.getId()))
                .collect(Collectors.toMap(Room::getId, r -> r));

        return events.stream()
                .map(event -> convertToDTOBatch(event, conferenceMap, seminarMap, roomMap))
                .collect(Collectors.toList());
    }

    // Convert với batch data
    private EventPublicDTO convertToDTOBatch(Event event, Map<Integer, Conference> conferenceMap, Map<Integer, Seminar> seminarMap, Map<Integer, Room> roomMap) {
        EventPublicDTO dto = new EventPublicDTO();
        
        // Basic info
        dto.setId(event.getId());
        dto.setEventName(event.getEventName());
        dto.setDateOfEvent(event.getDateOfEvent());
        dto.setStatus(event.getStatus());
        dto.setCreatedAt(event.getCreatedAt());
        dto.setUpdatedAt(event.getUpdatedAt());
        dto.setBannerImg(event.getBannerImg());

        // Get room info
        String location = "VNUA"; // default
        if (event.getIdRoom() != null) {
            Room room = roomMap.get(event.getIdRoom().getId());
            if (room != null) {
                location = "";
                if (room.getRoomName() != null && !room.getRoomName().isEmpty()) {
                    location = room.getRoomName();
                }
                if (room.getAddress() != null && !room.getAddress().isEmpty()) {
                    if (!location.isEmpty()) {
                        location += ", ";
                    }
                    location += room.getAddress();
                }
                if (location.isEmpty()) {
                    location = "VNUA";
                }
            }
        }
        dto.setLocation(location);

        // Set other default values
        dto.setOrganizer("VNUA");
        dto.setContactEmail("contact@vnua.edu.vn");
        dto.setContactPhone("0243.827.6346");
        dto.setMaxParticipants(100);
        dto.setType("other");

        // Conference info
        Conference conference = conferenceMap.get(event.getId());
        if (conference != null) {
            dto.setImage(conference.getImage());
            dto.setDescription(conference.getPaperTitle());
            dto.setArticleLink(conference.getArticleLink());
            dto.setType("conference");
        }

        // Seminar info
        Seminar seminar = seminarMap.get(event.getId());
        if (seminar != null) {
            dto.setImage(seminar.getSeminarPhoto());
            dto.setDescription(seminar.getMainAuthor());
            dto.setArticleLink(seminar.getArticleLink());
            dto.setType("seminar");
        }

        // Fallback image
        if (dto.getImage() == null || dto.getImage().isEmpty()) {
            dto.setImage(dto.getBannerImg() != null ? dto.getBannerImg() : "/file/default-event.jpg");
        }

        return dto;
    }


    private EventPublicDTO convertToDTO(Event event) {
        EventPublicDTO dto = new EventPublicDTO();
        
        dto.setId(event.getId());
        dto.setEventName(event.getEventName());
        dto.setDateOfEvent(event.getDateOfEvent());
        dto.setStatus(event.getStatus());
        dto.setCreatedAt(event.getCreatedAt());
        dto.setUpdatedAt(event.getUpdatedAt());
        dto.setBannerImg(event.getBannerImg());

        // Get room info
        String location = "VNUA"; // default
        if (event.getIdRoom() != null) {
            Room room = event.getIdRoom();
            location = "";
            if (room.getRoomName() != null && !room.getRoomName().isEmpty()) {
                location = room.getRoomName();
            }
            if (room.getAddress() != null && !room.getAddress().isEmpty()) {
                if (!location.isEmpty()) {
                    location += ", ";
                }
                location += room.getAddress();
            }
            if (location.isEmpty()) {
                location = "VNUA";
            }
        }
        dto.setLocation(location);

        // Set other defaults
        dto.setOrganizer("VNUA");
        dto.setContactEmail("contact@vnua.edu.vn");
        dto.setContactPhone("0243.827.6346");
        dto.setMaxParticipants(100);
        dto.setType("other");
        dto.setImage("/file/default-event.jpg");

        // Check conference
        Conference conference = conferenceRepository.findByIdEvent(event.getId());
        if (conference != null) {
            dto.setImage(conference.getImage());
            dto.setDescription(conference.getPaperTitle());
            dto.setArticleLink(conference.getArticleLink());
            dto.setType("conference");
        }

        // Check seminar
        Seminar seminar = seminarRepository.findByIdEvent(event.getId());
        if (seminar != null) {
            dto.setImage(seminar.getSeminarPhoto());
            dto.setDescription(seminar.getMainAuthor());
            dto.setArticleLink(seminar.getArticleLink());
            dto.setType("seminar");
        }

        return dto;
    }

    @Override
    public String approveEvent(Integer eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sự kiện với ID: " + eventId));

        LocalDate today = LocalDate.now();
        if (event.getDateOfEvent() != null && event.getDateOfEvent().isBefore(today)) {
            event.setStatus("completed");
        } else {
            event.setStatus("upcoming");
        }
        eventRepository.save(event);

        return "Phê duyệt sự kiện thành công";
    }

    @Override
    public String rejectEvent(Integer eventId, String reason) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sự kiện với ID: " + eventId));

        event.setStatus("rejected");
        event.setReason(reason);
        eventRepository.save(event);

        return "Từ chối sự kiện thành công. Lý do: " + reason;
    }

    @Override
    public String deleteEvent(Integer eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sự kiện với ID: " + eventId));

        eventRepository.delete(event);

        return "Xóa sự kiện thành công";
    }
}
