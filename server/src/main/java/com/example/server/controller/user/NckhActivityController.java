package com.example.server.controller.user;

import com.example.server.DTO.nckh.CreateActivityRequest;
import com.example.server.DTO.nckh.DashboardResponse;
import com.example.server.DTO.nckh.UpsertContributorsRequest;
import com.example.server.domain.nckh.NckhActivity;
import com.example.server.service.nckh.NckhActivityService;
import com.example.server.service.nckh.NckhDashboardService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/nckh")
public class NckhActivityController {

    private final NckhActivityService activityService;
    private final NckhDashboardService dashboardService;

    public NckhActivityController(NckhActivityService activityService, NckhDashboardService dashboardService) {
        this.activityService = activityService;
        this.dashboardService = dashboardService;
    }

    // TODO: thay userId bằng SecurityContext/session
    @PostMapping("/activities")
    public NckhActivity create(@RequestBody CreateActivityRequest req, @RequestParam Integer userId) {
        return activityService.create(
                userId,
                req.academicYear,
                req.researchGroupId,
                req.catalogCode,
                req.qty,
                req.title,
                req.description);
    }

    @PostMapping("/activities/{id}/contributors")
    public void addContributors(@PathVariable Long id, @RequestBody UpsertContributorsRequest req) {
        activityService.addContributors(id, req.contributors);
    }

    @PostMapping("/activities/{id}/submit")
    public NckhActivity submit(@PathVariable Long id, @RequestParam Integer userId) {
        return activityService.submit(id, userId);
    }

    @GetMapping("/dashboard")
    public DashboardResponse dashboard(@RequestParam Integer userId, @RequestParam Integer year) {
        return dashboardService.personal(userId, year);
    }
}
