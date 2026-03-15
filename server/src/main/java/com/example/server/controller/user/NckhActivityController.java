package com.example.server.controller.user;

import com.example.server.DTO.nckh.CreateActivityRequest;
import com.example.server.DTO.nckh.DashboardResponse;
import com.example.server.DTO.nckh.UpsertContributorsRequest;
import com.example.server.domain.nckh.NckhActivity;
import com.example.server.domain.nckh.NckhActivityCatalog;
import com.example.server.domain.nckh.NckhActivityContributor;
import com.example.server.service.nckh.NckhActivityService;
import com.example.server.service.nckh.NckhDashboardService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

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
        return activityService.create(userId, req);
    }

    @PutMapping("/activities/{id}")
    public NckhActivity update(
            @PathVariable Long id,
            @RequestParam Integer userId,
            @RequestBody CreateActivityRequest req) {
        return activityService.update(id, userId, req);
    }

    @DeleteMapping("/activities/{id}")
    public void delete(@PathVariable Long id, @RequestParam Integer userId) {
        activityService.delete(id, userId);
    }

    @GetMapping("/activity-catalog")
    public List<NckhActivityCatalog> activeCatalog() {
        return activityService.getActiveCatalog();
    }

    @GetMapping("/activity-options")
    public Map<String, Object> declarationOptions() {
        return activityService.getDeclarationOptions();
    }

    @PostMapping("/activities/{id}/contributors")
    public void addContributors(@PathVariable Long id, @RequestBody UpsertContributorsRequest req) {
        activityService.addContributors(id, req.contributors);
    }

    @GetMapping("/activities/{id}/contributors")
    public List<NckhActivityContributor> getContributors(@PathVariable Long id) {
        return activityService.getContributors(id);
    }

    @PostMapping("/activities/{id}/submit")
    public NckhActivity submit(@PathVariable Long id, @RequestParam Integer userId) {
        return activityService.submit(id, userId);
    }

    @PostMapping("/activities/{id}/approve")
    public NckhActivity approve(@PathVariable Long id, @RequestParam Integer adminId) {
        return activityService.approve(id, adminId);
    }

    @PostMapping("/activities/{id}/reject")
    public NckhActivity reject(@PathVariable Long id, @RequestParam Integer adminId) {
        return activityService.reject(id, adminId);
    }

    @GetMapping("/activities/my")
    public List<NckhActivity> myActivities(
            @RequestParam Integer userId,
            @RequestParam Integer year,
            @RequestParam(required = false) String activityType,
            @RequestParam(required = false) String status) {
        return activityService.listMy(userId, year, activityType, status);
    }

    @GetMapping("/activities/public")
    public List<NckhActivity> publicActivities(
            @RequestParam Integer year,
            @RequestParam(required = false) String activityType) {
        return activityService.listPublic(year, activityType);
    }

    @GetMapping("/activities/pending")
    public List<NckhActivity> pendingActivities(
            @RequestParam Integer year,
            @RequestParam(required = false) String activityType) {
        return activityService.listPending(year, activityType);
    }

    @GetMapping("/dashboard")
    public DashboardResponse dashboard(@RequestParam Integer userId, @RequestParam Integer year) {
        return dashboardService.personal(userId, year);
    }
}
