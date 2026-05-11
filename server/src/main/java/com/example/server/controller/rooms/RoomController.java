package com.example.server.controller.rooms;

import java.util.*;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.server.domain.Room;
import com.example.server.repository.RoomRepository;

@RestController
@RequestMapping("/api/rooms")
@CrossOrigin(origins = "*")
public class RoomController {
    
    @Autowired
    private RoomRepository roomRepository;
    
    @GetMapping("/public")
    public ResponseEntity<?> getPublicRooms() {
        try {
            List<Room> rooms = roomRepository.findAll();
            
            // Map to simple Map instead of anonymous class
            List<Map<String, Object>> roomDTOs = rooms.stream().map(room -> {
                Map<String, Object> roomDTO = new HashMap<>();
                roomDTO.put("id", room.getId());
                roomDTO.put("roomName", room.getRoomName());
                roomDTO.put("address", room.getAddress());
                roomDTO.put("displayName", buildDisplayName(room));
                return roomDTO;
            }).collect(Collectors.toList());
            
            return ResponseEntity.ok(roomDTOs);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi khi lấy danh sách phòng: " + e.getMessage());
        }
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
        
        return displayName.toString().isEmpty() ? "Phòng không tên" : displayName.toString();
    }
}