package com.example.server.controller.user;

import com.example.server.repository.GuestRepository;
import com.example.server.repository.MemberRepository;
import com.example.server.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class SearchApiController {

    private final UserService userService;
    GuestRepository guestRepository;
    MemberRepository memberRepository;

    public SearchApiController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/search-users")
    public List<Map<String, Object>> searchUsers(@RequestParam String keyword) {
        return userService.findAll().stream()
                .filter(user -> user.getName().toLowerCase().contains(keyword.toLowerCase()))
                .map(user -> {
                    Map<String, Object> userMap = new HashMap<>();
                    userMap.put("id", user.getId());    // Thêm ID vào map
                    userMap.put("name", user.getName());
                    userMap.put("username", user.getUsername());
                    // Thêm trạng thái đã là guest hoặc member
                    userMap.put("isGuest", userService.isGuest(user.getId()));
                    userMap.put("isMember", userService.isMember(user.getId()));
                    // Thêm tên vào map
                    return userMap;
                })
                .collect(Collectors.toList());
    }
    // Phương thức xóa khách mời hoặc thành viên khỏi sự kiện
//    @DeleteMapping("/remove-user/{userId}")
//    public ResponseEntity<Map<String, Object>> removeUser(@PathVariable Integer userId,
//                                                          @RequestParam Integer eventId,
//                                                          @RequestParam String type) {
//        Map<String, Object> response = new HashMap<>();
//
//        try {
//            if ("guest".equals(type)) {
//                // Xóa khách mời
//                Guest guest = guestRepository.findByUserIdAndEventId(userId, eventId);
//                if (guest != null) {
//                    guestRepository.delete(guest);
//                } else {
//                    response.put("success", false);
//                    response.put("message", "Không tìm thấy khách mời với userId và eventId.");
//                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
//                }
//            } else if ("member".equals(type)) {
//                // Xóa thành viên
//                Member member = memberRepository.findByUserIdAndEventId(userId, eventId);
//                if (member != null) {
//                    memberRepository.delete(member);
//                } else {
//                    response.put("success", false);
//                    response.put("message", "Không tìm thấy thành viên với userId và eventId.");
//                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
//                }
//            }
//            response.put("success", true);
//            return ResponseEntity.ok(response);
//        } catch (Exception e) {
//            response.put("success", false);
//            response.put("message", e.getMessage());
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
//        }
//    }
    @DeleteMapping("/remove-user/{userId}")
    public ResponseEntity<Map<String, Object>> removeUser(@PathVariable Integer userId,
                                                          @RequestParam Integer eventId,
                                                          @RequestParam String type) {
        Map<String, Object> response = new HashMap<>();

        try {
            if ("guest".equals(type)) {
                userService.removeGuest(userId, eventId);
            } else if ("member".equals(type)) {
                userService.removeMember(userId, eventId);
            }
            response.put("success", true);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }


}
