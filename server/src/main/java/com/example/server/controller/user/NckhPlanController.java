package com.example.server.controller.user;

import com.example.server.DTO.nckh.SelectPlanRequest;
import com.example.server.domain.nckh.UserPlanYear;
import com.example.server.service.nckh.UserPlanYearService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/nckh/plan")
public class NckhPlanController {

    private final UserPlanYearService service;

    public NckhPlanController(UserPlanYearService service) {
        this.service = service;
    }

    // TODO: thay userId bằng cách lấy từ SecurityContext/session của bạn
    @PostMapping("/select")
    public UserPlanYear select(@RequestBody SelectPlanRequest req, @RequestParam Integer userId) {
        return service.selectAndLock(userId, req.academicYear, req.planCode);
    }

    @GetMapping("/current")
    public UserPlanYear current(@RequestParam Integer userId, @RequestParam Integer year) {
        return service.getOrNull(userId, year);
    }
}
