package com.example.server.service.nckh;

import com.example.server.DTO.nckh.ContributorItem;
import com.example.server.domain.nckh.NckhActivity;
import com.example.server.domain.nckh.NckhActivityCatalog;
import com.example.server.domain.nckh.NckhActivityContributor;
import com.example.server.repository.nckh.NckhActivityCatalogRepository;
import com.example.server.repository.nckh.NckhActivityContributorRepository;
import com.example.server.repository.nckh.NckhActivityRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NckhActivityService {

    private final NckhActivityRepository activityRepo;
    private final NckhActivityCatalogRepository catalogRepo;
    private final NckhActivityContributorRepository contribRepo;
    private final NckhComputeService computeService;

    public NckhActivityService(
            NckhActivityRepository activityRepo,
            NckhActivityCatalogRepository catalogRepo,
            NckhActivityContributorRepository contribRepo,
            NckhComputeService computeService) {
        this.activityRepo = activityRepo;
        this.catalogRepo = catalogRepo;
        this.contribRepo = contribRepo;
        this.computeService = computeService;
    }

    @Transactional
    public NckhActivity create(Integer creatorUserId, Integer year, Integer groupId, String catalogCode, Double qty,
            String title, String desc) {
        NckhActivityCatalog cat = catalogRepo.findById(catalogCode)
                .orElseThrow(() -> new IllegalStateException("catalog_code không tồn tại: " + catalogCode));

        NckhActivity a = new NckhActivity();
        a.setAcademicYear(year);
        a.setResearchGroupId(groupId);
        a.setCatalogCode(catalogCode);
        a.setQty(qty == null ? 1.0 : qty);
        a.setQuotaHoursSnapshot(cat.getQuotaHours());
        a.setTitle(title);
        a.setDescription(desc);
        a.setStatus(NckhActivity.Status.DRAFT);
        a.setCreatedByUserId(creatorUserId);
        return activityRepo.save(a);
    }

    @Transactional
    public void addContributors(Long activityId, List<ContributorItem> items) {
        NckhActivity a = activityRepo.findById(activityId)
                .orElseThrow(() -> new IllegalStateException("Activity không tồn tại"));

        double qty = a.getQty();
        double S = a.getQuotaHoursSnapshot();

        for (ContributorItem it : items) {
            NckhActivityContributor c = new NckhActivityContributor();
            c.setActivityId(activityId);
            c.setUserId(it.userId);
            c.setRole(NckhActivityContributor.Role.valueOf(it.role));
            c.setParticipantsN(it.participantsN == null ? 1 : it.participantsN);
            c.setNote(it.note);

            NckhComputeService.ComputeResult r = computeService.compute(qty, S, c.getParticipantsN(), c.getRole());

            c.setHoursShare(r.hoursShare);
            c.setEquivQty(r.equivQty);

            contribRepo.save(c);
        }
    }

    @Transactional
    public NckhActivity  submit(Long activityId, Integer userId) {
        NckhActivity a = activityRepo.findById(activityId)
                .orElseThrow(() -> new IllegalStateException("Activity không tồn tại"));
        if (!a.getCreatedByUserId().equals(userId)) {
            throw new IllegalStateException("Chỉ người tạo mới được submit.");
        }
        a.setStatus(NckhActivity.Status.SUBMITTED);
        return activityRepo.save(a);
    }

    @Transactional
    public NckhActivity approve(Long activityId, Integer adminId) {
        NckhActivity a = activityRepo.findById(activityId)
                .orElseThrow(() -> new IllegalStateException("Activity không tồn tại"));
        a.setStatus(NckhActivity.Status.APPROVED);
        a.setApprovedByUserId(adminId);
        a.setApprovedAt(LocalDateTime.now());
        return activityRepo.save(a);
    }

    @Transactional
    public NckhActivity reject(Long activityId, Integer adminId) {
        NckhActivity a = activityRepo.findById(activityId)
                .orElseThrow(() -> new IllegalStateException("Activity không tồn tại"));
        a.setStatus(NckhActivity.Status.REJECTED);
        a.setApprovedByUserId(adminId);
        a.setApprovedAt(LocalDateTime.now());
        return activityRepo.save(a);
    }
}
