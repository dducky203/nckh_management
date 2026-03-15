package com.example.server.controller.user;

import com.example.server.DTO.SuccessResponseDTO;
import com.example.server.DTO.nckh.SelectPlanRequest;
import com.example.server.domain.nckh.UserPlanYear;
import com.example.server.service.nckh.UserPlanYearService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/nckh/plan")
public class NckhPlanController {

    private final UserPlanYearService service;

    public NckhPlanController(UserPlanYearService service) {
        this.service = service;
    }

    @PostMapping("/select")
    public UserPlanYear select(@RequestBody SelectPlanRequest req, @RequestParam Integer userId) {
        return service.selectAndLock(userId,  req.planId, req.academicYear);
    }

    @GetMapping("/current")
    public ResponseEntity<?> current(@RequestParam Integer userId, @RequestParam Integer year) {
        UserPlanYear userPlanYear = service.getPlanCurrent(userId, year);
        if (userPlanYear != null)  return ResponseEntity.ok(new SuccessResponseDTO<>(userPlanYear, "Lấy thành công thông tin phương án năm " + year));
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Bạn chưa chọn phương án cho năm này");
    }
}
