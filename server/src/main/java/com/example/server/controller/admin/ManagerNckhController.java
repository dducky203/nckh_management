package com.example.server.controller.admin;

import com.example.server.domain.nckh.NckhActivity;
import com.example.server.domain.nckh.UserPlanYear;
import com.example.server.service.nckh.NckhActivityService;
import com.example.server.service.nckh.UserPlanYearService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/nckh")
public class ManagerNckhController {

    private final NckhActivityService activityService;
    private final UserPlanYearService planService;

    public ManagerNckhController(NckhActivityService activityService, UserPlanYearService planService) {
        this.activityService = activityService;
        this.planService = planService;
    }

    @PostMapping("/activities/{id}/approve")
    public NckhActivity approve(@PathVariable Long id, @RequestParam Integer adminId) {
        return activityService.approve(id, adminId);
    }

    @PostMapping("/activities/{id}/reject")
    public NckhActivity reject(@PathVariable Long id, @RequestParam Integer adminId) {
        return activityService.reject(id, adminId);
    }

    @PatchMapping("/plan/override")
    public UserPlanYear overridePlan(
            @RequestParam Integer adminId,
            @RequestParam Integer userId,
            @RequestParam Integer year,
            @RequestParam Integer planId,
            @RequestParam String reason) {
        return planService.adminOverride(adminId, userId, year,planId, reason);
    }
}
