package com.example.server.service.nckh;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

import com.cloudinary.utils.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.server.DTO.nckh.*;
import com.example.server.domain.Title;
import com.example.server.domain.User;
import com.example.server.domain.nckh.*;
import com.example.server.domain.ResearchGroup;
import com.example.server.domain.ResearchGroupMember;
import com.example.server.exception.ErrorException;
import com.example.server.repository.ResearchGroupMemberRepository;
import com.example.server.repository.UserRepository;
import com.example.server.repository.nckh.*;
import com.example.server.service.researchgroup.ResearchGroupQuotaService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpStatus;

@Service
public class NckhActivityService {

    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();

    private final NckhActivityRepository activityRepo;
    private final NckhTieuChiDinhMucRepository dinhMucRepo;
    private final NckhActivityContributorRepository contribRepo;
    private final NckhComputeService computeService;
    private final UserPlanYearRepository planYearRepo;
    private final UserRepository userRepo;
    private final ResearchGroupQuotaService quotaGroupService;
    private final ResearchGroupMemberRepository groupMemberRepo;

    public NckhActivityService(
            NckhActivityRepository activityRepo,
            NckhActivityContributorRepository contribRepo,
            NckhComputeService computeService,
            UserPlanYearRepository planYearRepo,
            NckhTieuChiDinhMucRepository dinhMucRepo,
            UserRepository userRepo,
            ResearchGroupQuotaService quotaGroupService,
            ResearchGroupMemberRepository groupMemberRepo) {
        this.activityRepo = activityRepo;
        this.dinhMucRepo = dinhMucRepo;
        this.contribRepo = contribRepo;
        this.computeService = computeService;
        this.planYearRepo = planYearRepo;
        this.userRepo = userRepo;
        this.quotaGroupService = quotaGroupService;
        this.groupMemberRepo = groupMemberRepo;
    }

    @Transactional
    public NckhActivity create(Integer creatorUserId, CreateActivityRequest req) {
        String tieuChiCode = requireTieuChiCode(req);
        NckhTieuChiDinhMuc dinhMuc = resolveDinhMuc(creatorUserId, tieuChiCode);

        NckhActivity a = new NckhActivity();
        a.setCreatedByUserId(creatorUserId);
        createActivity(req, a, tieuChiCode, dinhMuc, creatorUserId);
        a.setMainAuthorUserId(creatorUserId);
        a.setMemberUserIds(null);
        a.setStatus(NckhActivity.Status.DRAFT);
        return activityRepo.save(a);
    }


    public Map<String, Object> getDeclarationOptions() {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("activityTypes", List.of(
                "SEMINAR",
                "CONFERENCE",
                "INTL_PAPER",
                "VN_PAPER",
                "PROCEEDING",
                "REVIEW_PAPER",
                "TECH_CONSULT",
                "TECH_PROCEDURE",
                "PROPOSAL",
                "APPROVED_TASK",
                "COUNCIL",
                "EXPERT_INVITE",
                "OTHER_ACTIVITY"));
        result.put("conferenceRoles", List.of("ORG", "PRES"));
        result.put("conferenceLevels", List.of("INTL", "NAT", "ACAD"));
        result.put("intlPaperCategories", List.of("WOS", "SCOPUS", "ENG_ACAD", "OTHER", "CITATION"));
        result.put("vnPaperCategories", List.of("ACADEMY", "OTHER"));
        result.put("proceedingLevels", List.of("INTL", "NAT", "ACAD"));
        result.put("proposalLevels", List.of("NAT", "MINISTRY"));
        // APPROVED_TASK sub-options
        result.put("taskLevels", List.of("QG", "BO", "HV"));
        result.put("taskRoles", List.of("CHU_NHIEM", "THU_KY", "THAM_GIA", "HD_SV"));
        // OTHER_ACTIVITY sub-options
        result.put("otherActivityTypes", List.of("CHUONG_SACH", "GIAO_TRINH", "SACH_CHUYEN_KHAO", "SACH_THAM_KHAO", "HOP_DONG_KHCN", "DE_AN_HV", "BAI_QUANG_BA"));

        Map<String, String> generatedTypeCodes = new LinkedHashMap<>();
        generatedTypeCodes.put("SEMINAR", "SEMINAR_TRINH_BAY");
        generatedTypeCodes.put("CONFERENCE.ORG.INTL", "HT_THAM_GIA");
        generatedTypeCodes.put("CONFERENCE.ORG.NAT", "HT_THAM_GIA");
        generatedTypeCodes.put("CONFERENCE.ORG.ACAD", "HT_THAM_GIA");
        generatedTypeCodes.put("CONFERENCE.PRES.INTL", "HT_THAM_LUAN");
        generatedTypeCodes.put("CONFERENCE.PRES.NAT", "HT_THAM_LUAN");
        generatedTypeCodes.put("CONFERENCE.PRES.ACAD", "HT_THAM_LUAN");
        generatedTypeCodes.put("INTL_PAPER.WOS", "BB_WOS_SCOPUS");
        generatedTypeCodes.put("INTL_PAPER.SCOPUS", "BB_SCOPUS");
        generatedTypeCodes.put("INTL_PAPER.ENG_ACAD", "BB_TA_HOCVIEN");
        generatedTypeCodes.put("INTL_PAPER.OTHER", "BB_WOS_SCOPUS");
        generatedTypeCodes.put("INTL_PAPER.CITATION", "BB_WOS_SCOPUS");
        generatedTypeCodes.put("VN_PAPER.ACADEMY", "BB_TV_HOCVIEN");
        generatedTypeCodes.put("VN_PAPER.OTHER", "BB_TV_HOCVIEN");
        generatedTypeCodes.put("PROCEEDING.INTL", "BTL_FULL_TEXT");
        generatedTypeCodes.put("PROCEEDING.NAT", "BTL_FULL_TEXT");
        generatedTypeCodes.put("PROCEEDING.ACAD", "BTL_FULL_TEXT");
        generatedTypeCodes.put("REVIEW_PAPER", "TONG_QUAN");
        generatedTypeCodes.put("TECH_CONSULT", "TU_VAN_BAN_TIN");
        generatedTypeCodes.put("TECH_PROCEDURE", "TU_VAN_BAN_TIN");
        generatedTypeCodes.put("PROPOSAL.NAT", "DE_XUAT_BO");
        generatedTypeCodes.put("PROPOSAL.MINISTRY", "DE_XUAT_BO");
        // APPROVED_TASK: LEVEL.ROLE
        generatedTypeCodes.put("APPROVED_TASK.QG.CHU_NHIEM", "NHIEM_VU_QG_CHU");
        generatedTypeCodes.put("APPROVED_TASK.QG.THU_KY", "NHIEM_VU_QG_TK");
        generatedTypeCodes.put("APPROVED_TASK.QG.THAM_GIA", "NHIEM_VU_QG_TG");
        generatedTypeCodes.put("APPROVED_TASK.BO.CHU_NHIEM", "NHIEM_VU_BO_CHU");
        generatedTypeCodes.put("APPROVED_TASK.BO.THU_KY", "NHIEM_VU_BO_TK");
        generatedTypeCodes.put("APPROVED_TASK.BO.THAM_GIA", "NHIEM_VU_BO_TG");
        generatedTypeCodes.put("APPROVED_TASK.HV.CHU_NHIEM", "NHIEM_VU_HV_CHU");
        generatedTypeCodes.put("APPROVED_TASK.HV.THAM_GIA", "NHIEM_VU_HV_TG");
        generatedTypeCodes.put("APPROVED_TASK.HV.HD_SV", "HD_SVNCKH");
        generatedTypeCodes.put("APPROVED_TASK.QG.HD_SV", "HD_SVNCKH");
        generatedTypeCodes.put("APPROVED_TASK.BO.HD_SV", "HD_SVNCKH");
        // COUNCIL, EXPERT_INVITE: direct
        generatedTypeCodes.put("COUNCIL", "HOI_DONG_TV");
        generatedTypeCodes.put("EXPERT_INVITE", "MOI_CHUYEN_GIA");
        // OTHER_ACTIVITY: direct sub-type key
        generatedTypeCodes.put("OTHER_ACTIVITY.CHUONG_SACH", "CHUONG_SACH");
        generatedTypeCodes.put("OTHER_ACTIVITY.GIAO_TRINH", "GIAO_TRINH");
        generatedTypeCodes.put("OTHER_ACTIVITY.SACH_CHUYEN_KHAO", "SACH_CHUYEN_KHAO");
        generatedTypeCodes.put("OTHER_ACTIVITY.SACH_THAM_KHAO", "SACH_THAM_KHAO");
        generatedTypeCodes.put("OTHER_ACTIVITY.HOP_DONG_KHCN", "HOP_DONG_KHCN");
        generatedTypeCodes.put("OTHER_ACTIVITY.DE_AN_HV", "DE_AN_HV");
        generatedTypeCodes.put("OTHER_ACTIVITY.BAI_QUANG_BA", "BAI_QUANG_BA");
        result.put("generatedTypeCodes", generatedTypeCodes);
        return result;
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
        List<NckhActivityContributor> contributors = contribRepo.findByActivityId(activityId);
        if (contributors.isEmpty()) {
            return contributors;
        }

        List<Integer> userIds = contributors.stream()
                .map(NckhActivityContributor::getUserId)
                .filter(Objects::nonNull)
                .distinct()
                .collect(Collectors.toList());

        if (userIds.isEmpty()) {
            return contributors;
        }

        Map<Integer, String> userNameById = userRepo.findAllById(userIds).stream()
                .collect(Collectors.toMap(
                        User::getId,
                        u -> (StringUtils.isBlank(u.getName())) ? u.getUsername() : u.getName(),
                        (left, right) -> left));

        for (NckhActivityContributor contributor : contributors) {
            contributor.setUserName(userNameById.get(contributor.getUserId()));
        }

        return contributors;
    }

    public List<NckhActivity> listMy(Integer userId, Integer year, String activityType, String status) {
        Map<Long, NckhActivity> byId = new LinkedHashMap<>();
        for (NckhActivity activity : activityRepo.findByCreatedByUserIdAndAcademicYear(userId, year)) {
            byId.put(activity.getId(), activity);
        }
        for (NckhActivity activity : activityRepo.findByContributorUserIdAndAcademicYear(userId, year)) {
            byId.putIfAbsent(activity.getId(), activity);
        }
        return filterActivities(new ArrayList<>(byId.values()), activityType, status);
    }

    public List<NckhActivity> listPublic(Integer year, String activityType) {
        List<NckhActivity> base = activityRepo.findByAcademicYear(year);
        return filterActivities(base, activityType, NckhActivity.Status.APPROVED.name());
    }

    public List<NckhActivity> listPending(Integer year, String activityType) {
        List<NckhActivity> base = activityRepo.findByAcademicYear(year);
        return filterActivities(base, activityType, NckhActivity.Status.SUBMITTED.name());
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

        String tieuChiCode = requireTieuChiCode(req);
        NckhTieuChiDinhMuc dinhMuc = resolveDinhMuc(userId, tieuChiCode);

        createActivity(req, a, tieuChiCode, dinhMuc, userId);
        a.setApprovedByUserId(null);
        a.setApprovedAt(null);
        assertNoDuplicate(a, activityId, userId);
        return activityRepo.save(a);
    }

    private void createActivity(CreateActivityRequest req, NckhActivity a, String tieuChiCode,
                                NckhTieuChiDinhMuc dinhMuc, Integer creatorUserId) {
        a.setAcademicYear(req.academicYear);
        Integer groupId = req.researchGroupId;
        if (groupId == null && creatorUserId != null) {
            groupId = quotaGroupService.findApprovedQuotaGroup(creatorUserId)
                    .map(ResearchGroup::getId)
                    .orElse(null);
        }
        a.setResearchGroupId(groupId);
        a.setCatalogCode(tieuChiCode);
        a.setQty(req.qty == null ? 1.0 : req.qty);
        a.setQuotaHoursSnapshot(requireQuotaHoursSnapshot(dinhMuc, tieuChiCode));
        a.setTitle(req.title);
        a.setDescription(req.description);
        a.setPublicationName(req.publicationName);
        validateActivityDate(req.activityDate);
        a.setActivityDate(req.activityDate);
        a.setVenue(req.venue);
        a.setIdentifierCode(req.identifierCode);
        a.setExternalLink(req.externalLink);
        a.setProofFileUrl(toJsonArray(req.proofFileUrls));
        a.setProofImageUrl(toJsonArray(req.proofImageUrls));
        a.setDetailsJson(req.detailsJson);
    }

    private String requireTieuChiCode(CreateActivityRequest req) {
        String tieuChiCode = req.tieuChiCode == null ? "" : req.tieuChiCode.trim();
        if (tieuChiCode.isEmpty()) {
            tieuChiCode = req.catalogCode == null ? "" : req.catalogCode.trim();
        }
        if (tieuChiCode.isEmpty()) {
            throw new IllegalStateException("tieuChiCode là bắt buộc");
        }
        return tieuChiCode;
    }

    private NckhTieuChiDinhMuc resolveDinhMuc(Integer userId, String tieuChiCode) {
        String chucDanh = userRepo.findById(userId)
                .map(User::getIdTitle)
                .map(Title::getName)
                .map(String::trim)
                .filter(name -> !name.isEmpty())
                .orElse(null);

        if (chucDanh != null) {
            Optional<NckhTieuChiDinhMuc> byTitle = dinhMucRepo.findFirstByTieuChiCodeAndChucDanh(tieuChiCode, chucDanh);
            if (byTitle.isPresent()) {
                return byTitle.get();
            }
        }

        return dinhMucRepo.findFirstByTieuChiCode(tieuChiCode)
                .orElseThrow(() -> new IllegalStateException("tieu_chi_code không tồn tại: " + tieuChiCode));
    }

    private double requireQuotaHoursSnapshot(NckhTieuChiDinhMuc dinhMuc, String tieuChiCode) {
        if (dinhMuc.getGioQuyDoiPerUnit() == null) {
            throw new IllegalStateException("gio_quy_doi_per_unit đang trống cho tieu_chi_code: " + tieuChiCode);
        }
        return dinhMuc.getGioQuyDoiPerUnit().doubleValue();
    }

    private void validateActivityDate(LocalDate activityDate) {
        if (activityDate == null) {
            return;
        }
        LocalDate today = LocalDate.now();
        if (!activityDate.isBefore(today)) {
            throw new IllegalStateException("Ngày xuất bản/ nghiệm thu phải là ngày trong quá khứ.");
        }
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

        assertNoDuplicate(a, activityId, userId);

        a.setStatus(NckhActivity.Status.SUBMITTED);
        a.setApprovedByUserId(null);
        a.setApprovedAt(null);
        return activityRepo.save(a);
    }

    @Transactional
    public NckhActivity approve(Long activityId, Integer adminId) {
        NckhActivity a = activityRepo.findById(activityId)
                .orElseThrow(() -> new IllegalStateException("Activity không tồn tại"));

        ensureContributorsOnApprove(a);

        if (a.getResearchGroupId() == null) {
            quotaGroupService.findApprovedQuotaGroup(a.getCreatedByUserId())
                    .map(ResearchGroup::getId)
                    .ifPresent(a::setResearchGroupId);
        }

        a.setStatus(NckhActivity.Status.APPROVED);
        a.setApprovedByUserId(adminId);
        a.setApprovedAt(LocalDateTime.now());
        return activityRepo.save(a);
    }

    /** Đảm bảo có contributor để thống kê định mức nhóm tự động. */
    private void ensureContributorsOnApprove(NckhActivity a) {
        if (!contribRepo.findByActivityId(a.getId()).isEmpty()) {
            return;
        }
        ContributorItem main = new ContributorItem();
        main.userId = a.getCreatedByUserId();
        main.role = "MAIN";
        main.participantsN = 1;
        addContributors(a.getId(), List.of(main));
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

    public DuplicateCheckResult checkDuplicate(CreateActivityRequest req, Long excludeActivityId, Integer userId) {
        NckhActivity probe = toProbeActivity(req);
        Optional<NckhActivity> existing = findDuplicate(probe, excludeActivityId);
        return existing.map(nckhActivity -> DuplicateCheckResult.found(
                nckhActivity.getId(),
                buildDuplicateMessage(nckhActivity, userId))).orElseGet(DuplicateCheckResult::ok);
    }

    private void assertNoDuplicate(NckhActivity activity, Long excludeActivityId, Integer userId) {
        findDuplicate(activity, excludeActivityId).ifPresent(existing -> {
            throw new ErrorException(buildDuplicateMessage(existing, userId), HttpStatus.CONFLICT);
        });
    }

    private Optional<NckhActivity> findDuplicate(NckhActivity activity, Long excludeActivityId) {
        if (activity.getAcademicYear() == null) {
            return Optional.empty();
        }

        String catalogCode = activity.getCatalogCode();
        if (catalogCode == null || catalogCode.isBlank()) {
            return Optional.empty();
        }

        String normId = normalizeIdentifier(activity.getIdentifierCode());
        String normLink = normalizeUrl(activity.getExternalLink());
        String normTitle = normalizeText(activity.getTitle());
        String normPublication = normalizeText(activity.getPublicationName());
        LocalDate activityDate = activity.getActivityDate();

        List<NckhActivity> candidates = activityRepo.findActiveByAcademicYearExcluding(
                activity.getAcademicYear(),
                excludeActivityId);

        for (NckhActivity other : candidates) {
            if (isDuplicate(other, catalogCode, normId, normLink, normTitle, normPublication, activityDate)) {
                return Optional.of(other);
            }
        }
        return Optional.empty();
    }

    private boolean isDuplicate(
            NckhActivity other,
            String catalogCode,
            String normId,
            String normLink,
            String normTitle,
            String normPublication,
            LocalDate activityDate) {
        String otherId = normalizeIdentifier(other.getIdentifierCode());
        if (!normId.isEmpty() && normId.equals(otherId)) {
            return true;
        }

        if (!catalogCode.equals(other.getCatalogCode())) {
            return false;
        }

        String otherLink = normalizeUrl(other.getExternalLink());
        if (!normLink.isEmpty() && normLink.equals(otherLink)) {
            return true;
        }

        if (normTitle.isEmpty() || activityDate == null || other.getActivityDate() == null) {
            return false;
        }

        if (!normTitle.equals(normalizeText(other.getTitle()))) {
            return false;
        }

        if (!activityDate.equals(other.getActivityDate())) {
            return false;
        }

        String otherPublication = normalizeText(other.getPublicationName());
        return normPublication.isEmpty() || otherPublication.isEmpty()
                || normPublication.equals(otherPublication);
    }

    private NckhActivity toProbeActivity(CreateActivityRequest req) {
        NckhActivity probe = new NckhActivity();
        probe.setAcademicYear(req.academicYear);
        probe.setCatalogCode(requireTieuChiCode(req));
        probe.setTitle(req.title);
        probe.setPublicationName(req.publicationName);
        probe.setActivityDate(req.activityDate);
        probe.setIdentifierCode(req.identifierCode);
        probe.setExternalLink(req.externalLink);
        return probe;
    }

    private String buildDuplicateMessage(NckhActivity existing, Integer userId) {
        boolean alreadyMember = contribRepo.findByActivityId(existing.getId()).stream()
                .anyMatch(c -> userId != null && userId.equals(c.getUserId()));

        if (alreadyMember) {
            return String.format(
                    "Hoạt động này đã được khai báo (mã #%d) và bạn đã nằm trong danh sách tham gia.",
                    existing.getId());
        }

        String creatorName = userRepo.findById(existing.getCreatedByUserId())
                .map(u -> StringUtils.isBlank(u.getName()) ? u.getUsername() : u.getName())
                .orElse("người khác");

        return String.format(
                "Hoạt động này đã được khai báo (mã #%d, người tạo: %s). "
                        + "Vui lòng liên hệ để được thêm vào danh sách tham gia thay vì tạo khai báo mới.",
                existing.getId(),
                creatorName);
    }

    private static String normalizeIdentifier(String value) {
        if (value == null) {
            return "";
        }
        String normalized = value.trim().toLowerCase(Locale.ROOT);
        if (normalized.startsWith("https://doi.org/")) {
            normalized = normalized.substring("https://doi.org/".length());
        }
        if (normalized.startsWith("http://doi.org/")) {
            normalized = normalized.substring("http://doi.org/".length());
        }
        return normalized.replaceAll("\\s+", "");
    }

    private static String normalizeUrl(String value) {
        if (value == null) {
            return "";
        }
        String normalized = value.trim().toLowerCase(Locale.ROOT);
        if (normalized.endsWith("/")) {
            normalized = normalized.substring(0, normalized.length() - 1);
        }
        return normalized;
    }

    private static String normalizeText(String value) {
        if (value == null) {
            return "";
        }
        return value.trim().toLowerCase(Locale.ROOT).replaceAll("\\s+", " ");
    }

    private List<NckhActivity> filterActivities(
            List<NckhActivity> source,
            String activityType,
            String status) {
        List<String> codes = resolveCatalogCodesByActivityType(activityType);
        NckhActivity.Status statusEnum = parseStatus(status);

        List<NckhActivity> result = new ArrayList<>();
        for (NckhActivity item : source) {
            if (!codes.isEmpty() && !codes.contains(item.getCatalogCode())) {
                continue;
            }
            if (statusEnum != null && item.getStatus() != statusEnum) {
                continue;
            }
            result.add(item);
        }

        result.sort((a, b) -> b.getId().compareTo(a.getId()));
        return result;
    }

    private NckhActivity.Status parseStatus(String status) {
        if (status == null || status.isBlank()) {
            return null;
        }
        try {
            return NckhActivity.Status.valueOf(status.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new IllegalStateException("status không hợp lệ: " + status);
        }
    }

    private List<String> resolveCatalogCodesByActivityType(String activityType) {
        String type = activityType == null ? "" : activityType.trim().toUpperCase();
        if (type.isEmpty()) {
            return List.of();
        }

        return switch (type) {
            case "SEMINAR" -> List.of("SEMINAR_TRINH_BAY", "SEMINAR_THAM_DU");
            case "CONFERENCE" -> List.of("HT_THAM_GIA", "HT_THAM_LUAN", "HT_TC_HV", "HT_TC_QUOCGIA", "HT_TC_QUOCTE");
            case "INTL_PAPER" -> List.of("BB_WOS_SCOPUS", "BB_SCOPUS", "BB_TA_HOCVIEN");
            case "VN_PAPER" -> List.of("BB_TV_HOCVIEN");
            case "PROCEEDING" -> List.of("BTL_FULL_TEXT");
            case "REVIEW_PAPER" -> List.of("TONG_QUAN");
            case "TECH_CONSULT", "TECH_PROCEDURE" -> List.of("TU_VAN_BAN_TIN");
            case "PROPOSAL" -> List.of("DE_XUAT_BO");
            case "APPROVED_TASK" -> List.of(
                    "NHIEM_VU_QG_CHU", "NHIEM_VU_QG_TK", "NHIEM_VU_QG_TG",
                    "NHIEM_VU_BO_CHU", "NHIEM_VU_BO_TK", "NHIEM_VU_BO_TG",
                    "NHIEM_VU_HV_CHU", "NHIEM_VU_HV_TG", "HD_SVNCKH");
            case "COUNCIL" -> List.of("HOI_DONG_TV");
            case "EXPERT_INVITE" -> List.of("MOI_CHUYEN_GIA");
            case "OTHER_ACTIVITY" -> List.of(
                    "CHUONG_SACH", "GIAO_TRINH", "SACH_CHUYEN_KHAO",
                    "SACH_THAM_KHAO", "HOP_DONG_KHCN", "DE_AN_HV", "BAI_QUANG_BA");
            default -> List.of();
        };
    }

    private String toJsonArray(List<String> urls) {
        if (urls == null || urls.isEmpty()) return null;
        try {
            return OBJECT_MAPPER.writeValueAsString(urls);
        } catch (Exception e) {
            return null;
        }
    }

    public static List<String> parseJsonArray(String json) {
        if (json == null || json.isBlank()) return List.of();
        try {
            if (json.startsWith("[")) {
                return OBJECT_MAPPER.readValue(json, new TypeReference<>() {});
            }
            return List.of(json);
        } catch (Exception e) {
            return List.of(json);
        }
    }

    public PersonalQuotaSummaryDto getStatistics(Integer userId, Integer academicYear) {
        PersonalQuotaSummaryDto summary = new PersonalQuotaSummaryDto();

        // 1. Get user's plan
        UserPlanYear userPlan = planYearRepo.findByUserIdAndAcademicYear(userId, academicYear)
                .orElse(null);

        if (userPlan == null) {
            summary.criteria = new ArrayList<>();
            return summary;
        }

        // 2. Get user's title
        User user = userRepo.findById(userId)
                .orElse(null);

        if (user == null || user.getIdTitle() == null || user.getIdTitle().getName() == null) {
            summary.criteria = new ArrayList<>();
            return summary;
        }

        String chucDanh = user.getIdTitle().getName();
        Integer phuongAn = userPlan.getPlanId();
        String yearStr = String.valueOf(academicYear);

        summary.planId = phuongAn;
        summary.chucDanh = chucDanh;

        List<ActivityStatisticsResponse> personal = activityRepo.getStatisticsByUserAndYear(
                userId, academicYear, phuongAn, chucDanh);

        Optional<ResearchGroup> quotaGroup = quotaGroupService.findApprovedQuotaGroup(userId);
        summary.inQuotaGroup = quotaGroup.isPresent();
        if (quotaGroup.isPresent()) {
            List<Integer> memberIds = groupMemberRepo.findByGroupId(quotaGroup.get().getId()).stream()
                    .map(ResearchGroupMember::getUserId)
                    .filter(Objects::nonNull)
                    .distinct()
                    .toList();
            int memberCount = Math.max(1, memberIds.size());

            if (!memberIds.isEmpty()) {
                Map<String, ActivityStatisticsDto> byCatalog = new LinkedHashMap<>();
                for (ActivityStatisticsResponse row : personal) {
                    byCatalog.put(row.getCatalogCode(), ActivityStatisticsDto.from(row));
                }

                for (ActivityStatisticsResponse groupRow : activityRepo.getGroupStatsByYear(memberIds, academicYear)) {
                    double groupHours = groupRow.getTotalQuotaHours() != null ? groupRow.getTotalQuotaHours() : 0;
                    if (groupHours <= 0) continue;
                    String code = groupRow.getCatalogCode();
                    double myHours = 0;
                    ActivityStatisticsDto existing = byCatalog.get(code);
                    if (existing != null) {
                        myHours = existing.getOwnQuotaHours() != null ? existing.getOwnQuotaHours() : 0;
                        existing.applyGroupHoursFromTeam(myHours, groupHours, memberCount);
                    } else {
                        ActivityStatisticsDto created = ActivityStatisticsDto.fromGroupRow(groupRow, 0);
                        created.setPlanContext(phuongAn, chucDanh);
                        created.applyGroupHoursFromTeam(0, groupHours, memberCount);
                        byCatalog.put(code, created);
                    }
                }

                personal = new ArrayList<>(byCatalog.values());
            }
        }

        summary.criteria = personal;

        // 3. Tính tổng giờ yêu cầu cho phương án + chức danh
        String chucDanhEnum = mapChucDanhToEnum(chucDanh);
        java.math.BigDecimal requiredBd = dinhMucRepo.sumTongGioByPhuongAnAndChucDanh(
                phuongAn, chucDanhEnum, yearStr);
        double requiredTotalHours = requiredBd != null ? requiredBd.doubleValue() : 0;
        summary.requiredTotalHours = requiredTotalHours;

        // 4. Tính tổng giờ thực tế
        double actualTotalHours = 0;
        for (ActivityStatisticsResponse stat : personal) {
            actualTotalHours += stat.getTotalQuotaHours() != null ? stat.getTotalQuotaHours() : 0;
        }
        summary.actualTotalHours = actualTotalHours;

        // 5. Tính % hoàn thành cá nhân
        double personalPercent = requiredTotalHours > 0
                ? Math.min(1.0, actualTotalHours / requiredTotalHours) * 100.0
                : (actualTotalHours > 0 ? 100.0 : 0);
        summary.personalCompletionPercent = round2(personalPercent);

        // 6. Tính % nhóm (nếu user thuộc nhóm)
        if (quotaGroup.isPresent()) {
            ResearchGroup group = quotaGroup.get();
            summary.groupName = group.getGroupName();

            List<ResearchGroupMember> members = groupMemberRepo.findByGroupId(group.getId());
            List<Integer> memberIds = members.stream()
                    .map(ResearchGroupMember::getUserId)
                    .filter(Objects::nonNull)
                    .distinct()
                    .toList();

            // Tính định mức chuẩn nhóm = tổng giờ tối thiểu của tất cả thành viên
            double groupRequired = 0;
            for (Integer memberId : memberIds) {
                User memberUser = userRepo.findById(memberId).orElse(null);
                if (memberUser == null || memberUser.getIdTitle() == null) continue;
                String memberChucDanh = memberUser.getIdTitle().getName();
                String memberCdEnum = mapChucDanhToEnum(memberChucDanh);

                UserPlanYear memberPlan = planYearRepo.findByUserIdAndAcademicYear(memberId, academicYear)
                        .orElse(null);
                if (memberPlan == null) continue;

                java.math.BigDecimal memberReq = dinhMucRepo.sumTongGioByPhuongAnAndChucDanh(
                        memberPlan.getPlanId(), memberCdEnum, yearStr);
                groupRequired += memberReq != null ? memberReq.doubleValue() : 0;
            }
            summary.groupRequiredTotalHours = groupRequired;

            // Tính tổng giờ thực tế nhóm
            double groupActual = 0;
            if (!memberIds.isEmpty()) {
                for (ActivityStatisticsResponse groupRow : activityRepo.getGroupStatsByYear(memberIds, academicYear)) {
                    groupActual += groupRow.getTotalQuotaHours() != null ? groupRow.getTotalQuotaHours() : 0;
                }
            }
            summary.groupActualTotalHours = groupActual;

            // % nhóm
            double groupPercent = groupRequired > 0
                    ? Math.min(1.0, groupActual / groupRequired) * 100.0
                    : (groupActual > 0 ? 100.0 : 0);
            summary.groupCompletionPercent = round2(groupPercent);

            // % thực tế: nhóm ≥ 100% → 100%; nhóm < 100% → bị giới hạn bởi nhóm
            double effectivePercent = NckhGroupQuotaRules.effectiveCompletionPercent(personalPercent, groupPercent);
            summary.effectiveCompletionPercent = round2(effectivePercent);
            summary.overallCompleted = NckhGroupQuotaRules.isPlanOverallCompleted(personalPercent, groupPercent);
        } else {
            // Không thuộc 3 nhóm NCM/Xuất sắc/Tinh hoa → chỉ tính cá nhân bình thường
            summary.inQuotaGroup = false;
            summary.groupCompletionPercent = null;
            summary.groupRequiredTotalHours = null;
            summary.groupActualTotalHours = null;
            summary.effectiveCompletionPercent = round2(personalPercent);
            summary.overallCompleted = NckhGroupQuotaRules.isPlanOverallCompleted(personalPercent, null);
        }

        return summary;
    }

    /** Chuyển tên chức danh từ DB sang enum string cho query. */
    private String mapChucDanhToEnum(String chucDanh) {
        if (chucDanh == null) return "KS_CN";
        String up = chucDanh.toUpperCase().replace(" ", "").replace("/", "_");
        if (up.contains("GS") || up.contains("PGS")) return "GS_PGS";
        if (up.contains("TS") || up.contains("TIẾN") || up.contains("TIEN")) return "TS";
        if (up.contains("THS") || up.contains("THẠC") || up.contains("THAC")) return "THS";
        return "KS_CN";
    }

    private static double round2(double v) {
        return Math.round(v * 100.0) / 100.0;
    }


}

