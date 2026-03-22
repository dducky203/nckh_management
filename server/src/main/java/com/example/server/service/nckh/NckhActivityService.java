package com.example.server.service.nckh;

import com.example.server.DTO.nckh.CreateActivityRequest;
import com.example.server.DTO.nckh.ContributorItem;
import com.example.server.DTO.nckh.ActivityStatisticsResponse;
import com.example.server.domain.nckh.NckhActivity;
import com.example.server.domain.nckh.NckhActivityCatalog;
import com.example.server.domain.nckh.NckhActivityContributor;
import com.example.server.domain.nckh.NckhTieuChiDinhMuc;
import com.example.server.domain.nckh.UserPlanYear;
import com.example.server.domain.User;
import com.example.server.repository.nckh.NckhActivityCatalogRepository;
import com.example.server.repository.nckh.NckhActivityContributorRepository;
import com.example.server.repository.nckh.NckhActivityRepository;
import com.example.server.repository.nckh.NckhTieuChiDinhMucRepository;
import com.example.server.repository.nckh.UserPlanYearRepository;
import com.example.server.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class NckhActivityService {

    private final NckhActivityRepository activityRepo;
    private final NckhActivityCatalogRepository catalogRepo;
    private final NckhActivityContributorRepository contribRepo;
    private final NckhComputeService computeService;
    private final NckhActivityTypeCodeResolver typeCodeResolver;
    private final UserPlanYearRepository planYearRepo;
    private final NckhTieuChiDinhMucRepository dinhMucRepo;
    private final UserRepository userRepo;

    public NckhActivityService(
            NckhActivityRepository activityRepo,
            NckhActivityCatalogRepository catalogRepo,
            NckhActivityContributorRepository contribRepo,
            NckhComputeService computeService,
            NckhActivityTypeCodeResolver typeCodeResolver,
            UserPlanYearRepository planYearRepo,
            NckhTieuChiDinhMucRepository dinhMucRepo,
            UserRepository userRepo) {
        this.activityRepo = activityRepo;
        this.catalogRepo = catalogRepo;
        this.contribRepo = contribRepo;
        this.computeService = computeService;
        this.typeCodeResolver = typeCodeResolver;
        this.planYearRepo = planYearRepo;
        this.dinhMucRepo = dinhMucRepo;
        this.userRepo = userRepo;
    }

    @Transactional
    public NckhActivity create(Integer creatorUserId, CreateActivityRequest req) {
        String catalogCode = typeCodeResolver.resolve(req);

        NckhActivityCatalog cat = catalogRepo.findById(catalogCode)
                .orElseThrow(() -> new IllegalStateException("catalog_code không tồn tại: " + catalogCode));

        NckhActivity a = new NckhActivity();
        a.setAcademicYear(req.academicYear);
        a.setResearchGroupId(req.researchGroupId);
        a.setCatalogCode(catalogCode);
        a.setQty(req.qty == null ? 1.0 : req.qty);
        a.setQuotaHoursSnapshot(cat.getQuotaHours());
        a.setTitle(req.title);
        a.setDescription(req.description);
        a.setPublicationName(req.publicationName);
        a.setActivityDate(req.activityDate);
        a.setVenue(req.venue);
        a.setIdentifierCode(req.identifierCode);
        a.setExternalLink(req.externalLink);
        a.setProofFileUrl(req.proofFileUrl);
        a.setProofImageUrl(req.proofImageUrl);
        a.setDetailsJson(req.detailsJson);
        a.setMainAuthorUserId(creatorUserId);
        a.setMemberUserIds(null);
        a.setStatus(NckhActivity.Status.DRAFT);
        a.setCreatedByUserId(creatorUserId);
        return activityRepo.save(a);
    }

    public List<NckhActivityCatalog> getActiveCatalog() {
        return catalogRepo.findByIsActiveTrueOrderByMetricKeyAscCatalogCodeAsc();
    }

    public Map<String, Object> getDeclarationOptions() {
        return typeCodeResolver.declarationOptions();
    }

    @Transactional
    public void addContributors(Long activityId, List<ContributorItem> items) {
        NckhActivity a = activityRepo.findById(activityId)
                .orElseThrow(() -> new IllegalStateException("Activity không tồn tại"));

        contribRepo.deleteByActivityId(activityId);

        double qty = a.getQty();
        double S = a.getQuotaHoursSnapshot();

        Integer mainAuthorUserId = null;
        List<Integer> memberUserIds = new ArrayList<>();

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

            if (c.getRole() == NckhActivityContributor.Role.MAIN && mainAuthorUserId == null) {
                mainAuthorUserId = c.getUserId();
            } else if (c.getRole() == NckhActivityContributor.Role.MEMBER) {
                memberUserIds.add(c.getUserId());
            }
        }

        if (mainAuthorUserId == null && !items.isEmpty()) {
            mainAuthorUserId = items.get(0).userId;
            memberUserIds = items.stream()
                    .skip(1)
                    .map(x -> x.userId)
                    .collect(Collectors.toList());
        }

        a.setMainAuthorUserId(mainAuthorUserId);
        a.setMemberUserIds(memberUserIds.isEmpty()
                ? null
                : memberUserIds.stream().map(String::valueOf).collect(Collectors.joining(",")));
        activityRepo.save(a);
    }

    public List<NckhActivityContributor> getContributors(Long activityId) {
        return contribRepo.findByActivityId(activityId);
    }

    public List<NckhActivity> listMy(Integer userId, Integer year, String activityType, String status) {
        List<NckhActivity> base = activityRepo.findByCreatedByUserIdAndAcademicYear(userId, year);
        return filterActivities(base, activityType, status, null);
    }

    public List<NckhActivity> listPublic(Integer year, String activityType) {
        List<NckhActivity> base = activityRepo.findByAcademicYear(year);
        return filterActivities(base, activityType, NckhActivity.Status.APPROVED.name(), null);
    }

    public List<NckhActivity> listPending(Integer year, String activityType) {
        List<NckhActivity> base = activityRepo.findByAcademicYear(year);
        return filterActivities(base, activityType, NckhActivity.Status.SUBMITTED.name(), null);
    }

    @Transactional
    public NckhActivity update(Long activityId, Integer userId, CreateActivityRequest req) {
        NckhActivity a = activityRepo.findById(activityId)
                .orElseThrow(() -> new IllegalStateException("Activity không tồn tại"));

        if (!a.getCreatedByUserId().equals(userId)) {
            throw new IllegalStateException("Chỉ người tạo mới được cập nhật.");
        }

        if (a.getStatus() == NckhActivity.Status.APPROVED || a.getStatus() == NckhActivity.Status.SUBMITTED) {
            throw new IllegalStateException("Không thể sửa activity đã submit/approved.");
        }

        String catalogCode = typeCodeResolver.resolve(req);
        NckhActivityCatalog cat = catalogRepo.findById(catalogCode)
                .orElseThrow(() -> new IllegalStateException("catalog_code không tồn tại: " + catalogCode));

        a.setAcademicYear(req.academicYear);
        a.setResearchGroupId(req.researchGroupId);
        a.setCatalogCode(catalogCode);
        a.setQty(req.qty == null ? 1.0 : req.qty);
        a.setQuotaHoursSnapshot(cat.getQuotaHours());
        a.setTitle(req.title);
        a.setDescription(req.description);
        a.setPublicationName(req.publicationName);
        a.setActivityDate(req.activityDate);
        a.setVenue(req.venue);
        a.setIdentifierCode(req.identifierCode);
        a.setExternalLink(req.externalLink);
        a.setProofFileUrl(req.proofFileUrl);
        a.setProofImageUrl(req.proofImageUrl);
        a.setDetailsJson(req.detailsJson);
        a.setApprovedByUserId(null);
        a.setApprovedAt(null);
        return activityRepo.save(a);
    }

    @Transactional
    public void delete(Long activityId, Integer userId) {
        NckhActivity a = activityRepo.findById(activityId)
                .orElseThrow(() -> new IllegalStateException("Activity không tồn tại"));

        if (!a.getCreatedByUserId().equals(userId)) {
            throw new IllegalStateException("Chỉ người tạo mới được xóa.");
        }

        if (a.getStatus() == NckhActivity.Status.APPROVED || a.getStatus() == NckhActivity.Status.SUBMITTED) {
            throw new IllegalStateException("Không thể xóa activity đã submit/approved.");
        }

        activityRepo.deleteById(activityId);
    }

    @Transactional
    public NckhActivity submit(Long activityId, Integer userId) {
        NckhActivity a = activityRepo.findById(activityId)
                .orElseThrow(() -> new IllegalStateException("Activity không tồn tại"));
        if (!a.getCreatedByUserId().equals(userId)) {
            throw new IllegalStateException("Chỉ người tạo mới được submit.");
        }

        if (a.getStatus() == NckhActivity.Status.APPROVED) {
            throw new IllegalStateException("Activity đã được duyệt.");
        }

        a.setStatus(NckhActivity.Status.SUBMITTED);
        a.setApprovedByUserId(null);
        a.setApprovedAt(null);
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

    private List<NckhActivity> filterActivities(
            List<NckhActivity> source,
            String activityType,
            String status,
            Integer excludeUserId) {
        List<String> codes = typeCodeResolver.resolveCatalogCodesByActivityType(activityType);
        NckhActivity.Status statusEnum = parseStatus(status);

        List<NckhActivity> result = new ArrayList<>();
        for (NckhActivity item : source) {
            if (!codes.isEmpty() && !codes.contains(item.getCatalogCode())) {
                continue;
            }
            if (statusEnum != null && item.getStatus() != statusEnum) {
                continue;
            }
            if (excludeUserId != null && excludeUserId.equals(item.getCreatedByUserId())) {
                continue;
            }
            result.add(item);
        }

        result.sort((a, b) -> b.getId().compareTo(a.getId()));
        return result;
    }

    private NckhActivity.Status parseStatus(String status) {
        if (status == null || status.trim().isEmpty()) {
            return null;
        }
        try {
            return NckhActivity.Status.valueOf(status.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new IllegalStateException("status không hợp lệ: " + status);
        }
    }

    public List<ActivityStatisticsResponse> getStatistics(Integer userId, Integer academicYear) {
        // 1. Get user's plan
        UserPlanYear userPlan = planYearRepo.findByUserIdAndAcademicYear(userId, academicYear)
                .orElse(null);

        if (userPlan == null) {
            return new ArrayList<>();
        }

        // 2. Get user's title
        User user = userRepo.findById(userId)
                .orElse(null);

        if (user == null || user.getIdTitle() == null || user.getIdTitle().getName() == null) {
            return new ArrayList<>();
        }

        String chucDanh = user.getIdTitle().getName();
        Integer phuongAn = userPlan.getPlanId();

        // 3. Get statistics from repository
        return activityRepo.getStatisticsByUserAndYear(
                userId,
                academicYear,
                phuongAn,
                chucDanh);
    }


}
