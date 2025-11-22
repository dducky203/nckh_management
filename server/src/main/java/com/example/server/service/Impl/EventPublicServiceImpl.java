package com.example.server.service.Impl;

import com.example.server.DTO.event.EventPublicDTO;
import com.example.server.DTO.event.EventRegistrationDTO;
import com.example.server.domain.*;
import com.example.server.repository.*;
import com.example.server.service.EventPublicService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
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
        LocalDate today = LocalDate.now();

        // Lấy TẤT CẢ events có isDelete = 1 (not deleted)
        List<Event> events = eventRepository.findAll().stream()
                .filter(e -> e.getIsDelete() != null && e.getIsDelete() == 1)
                .collect(Collectors.toList());

        // Lọc theo status string
        switch (status.toLowerCase()) {
            case "upcoming":
                // Lấy events đã được duyệt và chưa diễn ra
                events = events.stream()
                        .filter(e -> "upcoming".equals(e.getStatus()))
                        .filter(e -> e.getDateOfEvent() != null && e.getDateOfEvent().isAfter(today))
                        .sorted((e1, e2) -> e1.getDateOfEvent().compareTo(e2.getDateOfEvent()))
                        .collect(Collectors.toList());
                break;
            case "completed":
                // Lấy events đã diễn ra
                events = events.stream()
                        .filter(e -> "completed".equals(e.getStatus()))
                        .filter(e -> e.getDateOfEvent() != null && e.getDateOfEvent().isBefore(today))
                        .sorted((e1, e2) -> e2.getDateOfEvent().compareTo(e1.getDateOfEvent()))
                        .collect(Collectors.toList());
                break;
            case "pending":
                // Lấy events đang chờ duyệt
                events = events.stream()
                        .filter(e -> "pending".equals(e.getStatus()))
                        .collect(Collectors.toList());
                break;
            case "rejected":
                // Lấy events bị từ chối
                events = events.stream()
                        .filter(e -> "rejected".equals(e.getStatus()))
                        .collect(Collectors.toList());
                break;
            default:
                // "all" - không filter theo status
                break;
        }

        return events.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public EventPublicDTO getEventById(Integer eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sự kiện với ID: " + eventId));

        // Kiểm tra event có public không (chỉ upcoming hoặc completed)
        if (event.getStatus() == null ||
                (!"upcoming".equals(event.getStatus()) && !"completed".equals(event.getStatus())) ||
                event.getIsDelete() == null || event.getIsDelete() != 1) {
            throw new RuntimeException("Sự kiện không khả dụng");
        }

        return convertToDTO(event);
    }

    @Override
    public List<EventPublicDTO> searchAndFilterEvents(String status, String type, String searchTerm) {
        List<EventPublicDTO> events = getPublicEvents(status);

        // Filter by type
        if (type != null && !type.equals("all") && !type.isEmpty()) {
            events = events.stream()
                    .filter(e -> type.equalsIgnoreCase(e.getType()))
                    .collect(Collectors.toList());
        }

        // Filter by search term
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
        // Kiểm tra event tồn tại
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sự kiện"));

        // Kiểm tra event có public không (chỉ upcoming)
        if (event.getStatus() == null || !"upcoming".equals(event.getStatus()) ||
                event.getIsDelete() == null || event.getIsDelete() != 1) {
            throw new RuntimeException("Sự kiện không khả dụng");
        }

        // Kiểm tra event đã diễn ra chưa
        if (event.getDateOfEvent().isBefore(LocalDate.now())) {
            throw new RuntimeException("Sự kiện đã diễn ra, không thể đăng ký");
        }

        // Kiểm tra user tồn tại
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        // Kiểm tra đã đăng ký chưa
        List<Guest> existingGuests = guestRepository.findAll().stream()
                .filter(g -> g.getEvent() != null && g.getEvent().getId().equals(eventId))
                .filter(g -> g.getUser() != null && g.getUser().getId().equals(userId))
                .collect(Collectors.toList());

        if (!existingGuests.isEmpty()) {
            throw new RuntimeException("Bạn đã đăng ký sự kiện này rồi");
        }

        // Tạo guest mới với thông tin từ form
        Guest guest = new Guest();
        guest.setEvent(event);
        guest.setUser(user);
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
        if (userId == null)
            return false;

        List<Guest> guests = guestRepository.findAll().stream()
                .filter(g -> g.getEvent() != null && g.getEvent().getId().equals(eventId))
                .filter(g -> g.getUser() != null && g.getUser().getId().equals(userId))
                .collect(Collectors.toList());

        return !guests.isEmpty();
    }

    @Override
    public String unregisterEvent(Integer eventId, Integer userId) {
        List<Guest> guests = guestRepository.findAll().stream()
                .filter(g -> g.getEvent() != null && g.getEvent().getId().equals(eventId))
                .filter(g -> g.getUser() != null && g.getUser().getId().equals(userId))
                .collect(Collectors.toList());

        if (guests.isEmpty()) {
            throw new RuntimeException("Bạn chưa đăng ký sự kiện này");
        }

        guestRepository.deleteAll(guests);
        return "Hủy đăng ký thành công";
    }

    @Override
    public Map<String, Object> getPublicEventsWithPagination(String status, int page, int size) {
        // Lấy tất cả events theo status
        List<EventPublicDTO> allEvents = getPublicEvents(status);

        // Tính toán pagination
        int totalItems = allEvents.size();
        int totalPages = (int) Math.ceil((double) totalItems / size);
        int startIndex = page * size;
        int endIndex = Math.min(startIndex + size, totalItems);

        // Lấy events của trang hiện tại
        List<EventPublicDTO> paginatedEvents = allEvents.subList(
                Math.min(startIndex, totalItems),
                Math.min(endIndex, totalItems));

        // Tạo response
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
        // Tạo Event entity
        Event event = new Event();
        event.setEventName(eventData.getEventName());
        event.setDateOfEvent(eventData.getDateOfEvent());
        event.setStartTime(eventData.getStartTime());
        event.setEndTime(eventData.getEndTime());
        event.setCreator(eventData.getCreator() != null ? eventData.getCreator() : 1); // Default creator
        event.setStatus("pending"); // pending = chờ duyệt
        event.setIsDelete(1); // 1 = not deleted
        event.setBannerImg(eventData.getBannerImg()); // Lưu URL của banner image

        // Find room by location name or create default
        if (eventData.getLocation() != null && !eventData.getLocation().isEmpty()) {
            // Tìm room theo tên hoặc tạo mới nếu cần
            Room room = roomRepository.findAll().stream()
                    .filter(r -> r.getRoomName() != null && r.getRoomName().equalsIgnoreCase(eventData.getLocation()))
                    .findFirst()
                    .orElse(null);

            if (room != null) {
                event.setIdRoom(room);
            }
        }

        // Save Event
        Event savedEvent = eventRepository.save(event);

        // Tạo Conference hoặc Seminar tùy theo type
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

    // Helper method to convert Event to EventPublicDTO
    private EventPublicDTO convertToDTO(Event event) {
        EventPublicDTO dto = new EventPublicDTO();

        // Basic event info
        dto.setId(event.getId());
        dto.setEventName(event.getEventName());
        dto.setDateOfEvent(event.getDateOfEvent());
        dto.setStatus(event.getStatus());
        dto.setCreatedAt(event.getCreatedAt());
        dto.setUpdatedAt(event.getUpdatedAt());
        dto.setBannerImg(event.getBannerImg()); // Banner image URL

        // Get time details from Time table
        if (event.getStartTime() != null) {
            timeRepository.findById(event.getStartTime()).ifPresent(time -> {
                dto.setStartTime(event.getStartTime());
                dto.setStartTimeDetail(time.getTime().toString());
            });
        }
        if (event.getEndTime() != null) {
            timeRepository.findById(event.getEndTime()).ifPresent(time -> {
                dto.setEndTime(event.getEndTime());
                dto.setEndTimeDetail(time.getTime().toString());
            });
        }

        // Get room/location info
        if (event.getIdRoom() != null) {
            Room room = event.getIdRoom();
            String location = room.getRoomName() != null ? room.getRoomName() : "";
            if (room.getAddress() != null && !room.getAddress().isEmpty()) {
                if (!location.isEmpty()) {
                    location += ", ";
                }
                location += room.getAddress();
            }
            dto.setLocation(location);
        }

        // Get organizer/creator info
        if (event.getCreator() != null) {
            User creator = userRepository.findById(event.getCreator()).orElse(null);
            if (creator != null) {
                dto.setOrganizer(creator.getName());
                // Set contact email from creator if available
                if (creator.getIdResume() != null) {
                    dto.setContactEmail(creator.getIdResume().getEmail());
                    dto.setContactPhone(creator.getIdResume().getPhone());
                }
            }
        }

        // Get image and description from Conference
        Conference conference = conferenceRepository.findByIdEvent(event.getId());
        if (conference != null) {
            dto.setImage(conference.getImage());
            dto.setDescription(conference.getPaperTitle());
            dto.setArticleLink(conference.getArticleLink());
            dto.setType("conference");
        }

        // Get image and description from Seminar
        Seminar seminar = seminarRepository.findByIdEvent(event.getId());
        if (seminar != null) {
            dto.setImage(seminar.getSeminarPhoto());
            dto.setDescription(seminar.getMainAuthor());
            dto.setArticleLink(seminar.getArticleLink());
            dto.setType("seminar");
        }

        // Get type from TypeOfCriterion (if linked)
        if (event.getIdOperatingStandard2() != null) {
            // Có thể mở rộng logic để lấy type từ operating_standard_2
        }

        // Ưu tiên dùng bannerImg nếu có, nếu không thì dùng image từ Conference/Seminar
        if (dto.getBannerImg() != null && !dto.getBannerImg().isEmpty()) {
            dto.setImage(dto.getBannerImg());
        } else if (dto.getImage() == null || dto.getImage().isEmpty()) {
            dto.setImage("/file/default-event.jpg");
        }

        if (dto.getType() == null) {
            dto.setType("other");
        }
        if (dto.getContactEmail() == null) {
            dto.setContactEmail("contact@vnua.edu.vn");
        }
        if (dto.getContactPhone() == null) {
            dto.setContactPhone("0243.827.6346");
        }
        dto.setMaxParticipants(100);

        return dto;
    }

    @Override
    public String approveEvent(Integer eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sự kiện với ID: " + eventId));

        // Kiểm tra ngày để set status phù hợp
        LocalDate today = LocalDate.now();
        if (event.getDateOfEvent() != null && event.getDateOfEvent().isBefore(today)) {
            event.setStatus("completed"); // Sự kiện đã qua
        } else {
            event.setStatus("upcoming"); // Sự kiện sắp diễn ra hoặc đang diễn ra
        }
        eventRepository.save(event);

        return "Phê duyệt sự kiện thành công";
    }

    @Override
    public String rejectEvent(Integer eventId, String reason) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sự kiện với ID: " + eventId));

        // Cập nhật status = rejected
        event.setStatus("rejected");
        eventRepository.save(event);

        // Có thể lưu lý do từ chối vào bảng khác nếu cần
        return "Từ chối sự kiện thành công. Lý do: " + reason;
    }

    @Override
    public String deleteEvent(Integer eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sự kiện với ID: " + eventId));

        // Soft delete: set isDelete = 0
        event.setIsDelete(0);
        eventRepository.save(event);

        return "Xóa sự kiện thành công";
    }
}
