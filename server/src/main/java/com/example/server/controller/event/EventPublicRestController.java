package com.example.server.controller.event;

import com.example.server.DTO.SuccessResponseDTO;
import com.example.server.DTO.event.EventPublicDTO;
import com.example.server.DTO.event.EventRegistrationDTO;
import com.example.server.DTO.typeOfCriteria.TypeOfCriteriaDto;
import com.example.server.service.CloudinaryService;
import com.example.server.service.EventPublicService;
import com.example.server.service.TypeOfCriterionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/events")
@CrossOrigin(origins = "*")
public class EventPublicRestController {

    @Autowired
    private EventPublicService eventPublicService;
    
    @Autowired
    private CloudinaryService cloudinaryService;

    @Autowired
    private TypeOfCriterionService typeOfCriterionService;

    @GetMapping("/get-types")
    public ResponseEntity<?> getEventTypes() {
        try {
            List<TypeOfCriteriaDto> allTypes = typeOfCriterionService.findAllTypeEvent();

            return ResponseEntity.ok(
                    new SuccessResponseDTO<>(allTypes, "Lấy danh sách loại sự kiện thành công"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Có lỗi xảy ra: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<?> getPublicEvents(
            @RequestParam(defaultValue = "upcoming") String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        try {
            Map<String, Object> response = eventPublicService.getPublicEventsWithPagination(status, page, size);
            return ResponseEntity.ok(
                    new SuccessResponseDTO<>(response, "Lấy danh sách sự kiện thành công"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Có lỗi xảy ra: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getEventById(@PathVariable Integer id) {
        try {
            EventPublicDTO event = eventPublicService.getEventById(id);
            return ResponseEntity.ok(
                    new SuccessResponseDTO<>(event, "Lấy chi tiết sự kiện thành công"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Có lỗi xảy ra: " + e.getMessage());
        }
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchEvents(
            @RequestParam(defaultValue = "upcoming") String status,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String search) {
        try {
            List<EventPublicDTO> events = eventPublicService.searchAndFilterEvents(
                    status,
                    type != null ? type : "all",
                    search != null ? search : "");
            return ResponseEntity.ok(
                    new SuccessResponseDTO<>(events, "Tìm kiếm sự kiện thành công"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Có lỗi xảy ra: " + e.getMessage());
        }
    }

    @GetMapping("/count")
    public ResponseEntity<?> countEvents(
            @RequestParam(defaultValue = "all") String status) {
        try {
            List<EventPublicDTO> events = eventPublicService.getPublicEvents(status);
            return ResponseEntity.ok(
                    new SuccessResponseDTO<>(events.size(), "Đếm số sự kiện thành công"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Có lỗi xảy ra: " + e.getMessage());
        }
    }

    @PostMapping("/{eventId}/register")
    public ResponseEntity<?> registerEvent(
            @PathVariable Integer eventId,
            @RequestParam Integer userId,
            @RequestBody EventRegistrationDTO registrationData) {
        try {
            String message = eventPublicService.registerEvent(eventId, userId, registrationData);
            return ResponseEntity.ok(
                    new SuccessResponseDTO<>(null, message));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Có lỗi xảy ra: " + e.getMessage());
        }
    }

    @GetMapping("/{eventId}/is-registered")
    public ResponseEntity<?> isUserRegistered(
            @PathVariable Integer eventId,
            @RequestParam Integer userId) {
        try {
            boolean isRegistered = eventPublicService.isUserRegistered(eventId, userId);
            return ResponseEntity.ok(
                    new SuccessResponseDTO<>(isRegistered, "Kiểm tra đăng ký thành công"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Có lỗi xảy ra: " + e.getMessage());
        }
    }

    @DeleteMapping("/{eventId}/register")
    public ResponseEntity<?> unregisterEvent(
            @PathVariable Integer eventId,
            @RequestParam Integer userId) {
        try {
            String message = eventPublicService.unregisterEvent(eventId, userId);
            return ResponseEntity.ok(
                    new SuccessResponseDTO<>(null, message));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Có lỗi xảy ra: " + e.getMessage());
        }
    }

    @PostMapping("/create")
    public ResponseEntity<?> createEvent(
            @RequestParam(value = "banner", required = false) MultipartFile bannerFile,
            @RequestParam("eventName") String eventName,
            @RequestParam("dateOfEvent") String dateOfEvent,
            @RequestParam("startTime") String startTime,
            @RequestParam("endTime") String endTime,
            @RequestParam(value = "roomId", required = false) Integer roomId,
            @RequestParam(value = "typeId", required = false) Integer typeId,
            @RequestParam("type") String type,
            @RequestParam("description") String description,
            @RequestParam("creator") Integer creator) {
        try {
            // Upload banner lên Cloudinary nếu có
            String bannerUrl = null;
            if (bannerFile != null && !bannerFile.isEmpty()) {
                bannerUrl = cloudinaryService.uploadFile(bannerFile, "events");
            }

            // Tạo EventPublicDTO
            LocalDate eventDate = LocalDate.parse(dateOfEvent);
            LocalTime startLocalTime = LocalTime.parse(startTime);
            LocalTime endLocalTime = LocalTime.parse(endTime);

            if (!startLocalTime.isBefore(endLocalTime)) {
                throw new RuntimeException("Giờ bắt đầu phải nhỏ hơn giờ kết thúc.");
            }

            EventPublicDTO eventData = new EventPublicDTO();
            eventData.setEventName(eventName);
            eventData.setDateOfEvent(eventDate);
            eventData.setStartTime(eventDate.atTime(startLocalTime));
            eventData.setEndTime(eventDate.atTime(endLocalTime));
            eventData.setRoomId(roomId);
            eventData.setTypeId(typeId);
            eventData.setType(type);
            eventData.setDescription(description);
            eventData.setCreator(creator);
            eventData.setBannerImg(bannerUrl);
            eventData.setImage(bannerUrl);

            EventPublicDTO createdEvent = eventPublicService.createEvent(eventData);
            return ResponseEntity.ok(
                    new SuccessResponseDTO<>(createdEvent, "Đăng ký sự kiện thành công! Chờ phê duyệt."));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Có lỗi upload file: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Có lỗi xảy ra: " + e.getMessage());
        }
    }


    @PostMapping("/{id}")
    public ResponseEntity<?> actionEvent(
            @PathVariable Integer id,
            @RequestParam String status,
            @RequestBody(required = false) Map<String, String> payload) {
        try {
            if ("APPROVE".equalsIgnoreCase(status)) {
                String message = eventPublicService.approveEvent(id);
                return ResponseEntity.ok(
                        new SuccessResponseDTO<>(null, message));
            } else if ("REJECT".equalsIgnoreCase(status)) {
                String reason = payload.getOrDefault("reason", "");
                String message = eventPublicService.rejectEvent(id, reason);
                return ResponseEntity.ok(
                        new SuccessResponseDTO<>(null, message));
            } else {
                return ResponseEntity.badRequest()
                        .body("Trạng thái không hợp lệ. Chỉ chấp nhận 'APPROVE' hoặc 'REJECT'.");
            }

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Có lỗi xảy ra: " + e.getMessage());
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteEvent(@PathVariable Integer id) {
        try {
            String message = eventPublicService.deleteEvent(id);
            return ResponseEntity.ok(
                    new SuccessResponseDTO<>(null, message));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Có lỗi xảy ra: " + e.getMessage());
        }
    }
}
