package com.example.server.controller.admin;

import java.util.List;
import java.util.Objects;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import com.example.server.domain.Room;
import com.example.server.repository.RoomRepository;

@Controller
@RequestMapping("/ad/managerRoom")
public class ManagerRoomController {
    @Autowired
    RoomRepository roomRepository;

    // show room
    @GetMapping("/showRoom")
    public String showRoom(Model model) {
        List<Room> rooms = roomRepository.findAll();
        model.addAttribute("rooms", rooms);
        return "/admin/room/showRoom";
    }
    // create Room
    @GetMapping("/createRoom")
    public String createRoom() {
        return "admin/room/createRoom";
    }
    @PostMapping("/saveCreateRoom")
    public String saveCreateRoom(@RequestParam String roomName,
                                 @RequestParam String address,
                                 Model model) {
        List<Room>  rooms = roomRepository.findAll();
        for (Room room : rooms) {
            if (room.getRoomName().equals(roomName)) {
                model.addAttribute("message", "Tên phòng đã tồn tại ");
                return "admin/room/createRoom";
            }
        }
        Room room = new Room();
        room.setRoomName(roomName);
        room.setAddress(address);
        roomRepository.save(room);
        return "redirect:/ad/managerRoom/showRoom";
    }

    // repair room
    @GetMapping("/repairRoom/{idRoom}")
    public String repairRoom(@PathVariable Integer idRoom, Model model) {
        Room room = roomRepository.findById(idRoom).get();
        model.addAttribute("room", room);
        return "admin/room/repairRoom";
    }
    @PostMapping("/saveRepairRoom/{idRoom}")
    public String saveRepairRoom(@RequestParam String roomName,
                                 @RequestParam String address,
                                 Model model, @PathVariable Integer idRoom) {
        List<Room>  rooms = roomRepository.findAll();
        for (Room room : rooms) {
            if (!Objects.equals(room.getId(), idRoom) && room.getRoomName().equals(roomName)) {
                model.addAttribute("room", roomRepository.findById(idRoom).get());
                model.addAttribute("message", "Tên phòng đã tồn tại ");
                return "admin/room/repairRoom";
            }
        }
        Room room = roomRepository.findById(idRoom).get();
        room.setRoomName(roomName);
        room.setAddress(address);
        roomRepository.save(room);
        return "redirect:/ad/managerRoom/showRoom";
    }
}
