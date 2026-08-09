package com.example.server.controller.rooms;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.server.DTO.response.SuccessResponseDTO;
import com.example.server.domain.Room;
import com.example.server.repository.RoomRepository;

/**
 * API phòng/địa điểm công khai cho dropdown sự kiện.
 * Path thực tế: /api/rooms/... (servlet path /api).
 */
@RestController
@RequestMapping("/rooms")
@CrossOrigin(origins = "*")
public class RoomController {

    private final RoomRepository roomRepository;

    public RoomController(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    @GetMapping("/public")
    public ResponseEntity<SuccessResponseDTO<List<Map<String, Object>>>> getPublicRooms() {
        List<Room> rooms = roomRepository.findAll();

        List<Map<String, Object>> roomDTOs = rooms.stream().map(room -> {
            Map<String, Object> roomDTO = new HashMap<>();
            roomDTO.put("id", room.getId());
            roomDTO.put("roomName", room.getRoomName());
            roomDTO.put("address", room.getAddress());
            roomDTO.put("displayName", buildDisplayName(room));
            return roomDTO;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(
                new SuccessResponseDTO<>(roomDTOs, "Lấy danh sách phòng thành công"));
    }

    private String buildDisplayName(Room room) {
        StringBuilder displayName = new StringBuilder();

        if (room.getRoomName() != null && !room.getRoomName().isBlank()) {
            displayName.append(room.getRoomName());
        }

        if (room.getAddress() != null && !room.getAddress().isBlank()) {
            if (displayName.length() > 0) {
                displayName.append(" - ");
            }
            displayName.append(room.getAddress());
        }

        return displayName.isEmpty() ? "Phòng không tên" : displayName.toString();
    }
}
