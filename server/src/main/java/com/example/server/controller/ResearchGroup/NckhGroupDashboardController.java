package com.example.server.controller.ResearchGroup;

import java.util.*;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import com.example.server.DTO.response.SuccessResponseDTO;
import com.example.server.domain.ResearchGroup;
import com.example.server.domain.ResearchGroupMember;
import com.example.server.domain.User;
import com.example.server.repository.ResearchGroupMemberRepository;
import com.example.server.repository.ResearchGroupRepository;
import com.example.server.repository.UserRepository;
import com.example.server.service.nckh.NckhComputeService;
import com.example.server.service.nckh.NckhGroupQuotaAggregationService;
import com.example.server.service.nckh.NckhGroupQuotaRules;
import com.example.server.service.nckh.NckhMemberRequiredHoursService;
import com.example.server.service.researchgroup.ResearchGroupQuotaService;
import com.example.server.utils.SecurityUtils;

import lombok.RequiredArgsConstructor;

/**
 * API tính định mức nhóm nghiên cứu (NCM / Xuất sắc / Tinh hoa).
 * Chức năng độc lập, không ảnh hưởng chức năng ResearchGroup hiện có.
 */
@RestController
@RequestMapping("/research-groups/quota")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class NckhGroupDashboardController {

    private final ResearchGroupRepository groupRepo;
    private final ResearchGroupMemberRepository memberRepo;
    private final UserRepository userRepo;
    private final NckhComputeService computeService;
    private final NckhGroupQuotaAggregationService aggregationService;
    private final ResearchGroupQuotaService quotaGroupService;
    private final NckhMemberRequiredHoursService memberRequiredHoursService;

    // -------------------------------------------------------------------
    // Bảng tiêu chí
    // -------------------------------------------------------------------

    private static final List<Map<String, Object>> NCM_CRITERIA = List.of(
        crit("SEMINAR_TRINH_BAY",  "Trình bày Seminar",                                        "bài"),
        critGroup("SEMINAR_THAM_DU", "Tham dự Seminar",                                        "buổi", "70% nhóm trình bày, chia đều"),
        crit("HT_THAM_LUAN",        "Bài tham luận hội thảo",                                  "bài"),
        crit("BB_WOS_SCOPUS",       "Bài báo WoS/Scopus",                                      "bài"),
        crit("BB_TA_HOCVIEN",       "Bài báo tiếng Anh (Tạp chí HV)",                          "bài"),
        crit("BB_TV_HOCVIEN",       "Bài báo tiếng Việt (Tạp chí HV)",                         "bài"),
        crit("HT_THAM_LUAN_KYYEU",  "Bài tham luận hội thảo đăng kỷ yếu (giờ HT q.gia)",      "bài"),
        crit("TU_VAN_BAN_TIN",      "Tư vấn / hướng dẫn KT / bản tin KH&CN",                  "bài"),
        crit("QUY_TRINH_KT",        "Quy trình KT / tiêu chuẩn KT cấp cơ sở",                 "bài"),
        crit("DE_XUAT_BO",          "Đề xuất cấp Bộ và tương đương",                           "đề xuất"),
        crit("NHIEM_VU_BO_CHU",     "Chủ nhiệm đề tài cấp Bộ",                                 "đề tài"),
        crit("HD_SVNCKH",           "Hướng dẫn SV NCKH / Hợp đồng KH&CN",                     "đề tài"),
        critGroup("HOI_THAO_HOC_VIEN", "Tổ chức Hội thảo cấp Học viện",                        "hội thảo", "Bảng 2 — theo quy mô nhóm"),
        critGroup("HOI_THAO_QUOC_GIA", "Tổ chức Hội thảo quốc gia",                             "hội thảo", "Bảng 2"),
        critGroup("HOI_THAO_QUOC_TE",  "Tổ chức Hội thảo quốc tế",                              "hội thảo", "Bảng 2"),
        critGroup("CONG_BO_KHOA_HOC",  "Công bố KH (TV, kỷ yếu, tổng quan)",                    "bài",      "Bảng 2"),
        critGroup("HOI_DONG_TU_VAN",   "Tổ chức Hội đồng tư vấn KH",                             "HĐ",       "2 HĐ/năm/nhóm"),
        critGroup("MOI_CHUYEN_GIA",    "Mời chuyên gia trình bày Seminar/chuyên đề",            "buổi",     "2 Seminar/năm/nhóm")
    );

    private static final List<Map<String, Object>> XS_CRITERIA = List.of(
        crit("BB_WOS_SCOPUS",   "Bài báo WoS/Scopus (tác giả chính)",          "bài"),
        crit("NHIEM_VU_BO_CHU", "Đề tài cấp Bộ và tương đương (chủ nhiệm)",   "đề tài")
    );

    private static final List<Map<String, Object>> TH_CRITERIA = List.of(
        crit("BB_WOS_SCOPUS",   "Bài báo WoS/Scopus (tác giả chính)",          "bài"),
        crit("NHIEM_VU_BO_CHU", "Đề tài cấp Bộ và tương đương (chủ nhiệm)",   "đề tài")
    );

    private static final Map<String, String> XS_LEADER_QUOTA = Map.of(
        "BB_WOS_SCOPUS",   "4 bài (3 WoS)",
        "NHIEM_VU_BO_CHU", "2 đề tài/năm"
    );

    private static final Map<String, String> TH_LEADER_QUOTA = Map.of(
        "BB_WOS_SCOPUS",   "8 bài (5 WoS)",
        "NHIEM_VU_BO_CHU", "4 đề tài/năm"
    );

    // -------------------------------------------------------------------
    // Helper để tìm nhóm định mức của user đang đăng nhập
    // -------------------------------------------------------------------
    private ResearchGroup getMyQuotaGroup(Integer userId) {
        return quotaGroupService.findApprovedQuotaGroup(userId).orElse(null);
    }

    // -------------------------------------------------------------------
    // GET /research-groups/quota/my-membership
    // Kiểm tra user có thuộc 1 trong 3 nhóm NCM / Xuất sắc / Tinh hoa không
    // -------------------------------------------------------------------
    @GetMapping("/my-membership")
    public ResponseEntity<SuccessResponseDTO<Map<String, Object>>> getMyMembership() {
        SecurityUtils.assertCurrentUserCanAccessQuota();
        Integer userId = SecurityUtils.getCurrentUserId();
        if (userId == null) throw new RuntimeException("Vui lòng đăng nhập");

        Map<String, Object> data = quotaGroupService.resolveMembership(userId);
        String msg = Boolean.TRUE.equals(data.get("inQuotaGroup"))
                ? "Người dùng thuộc nhóm định mức NCKH"
                : (String) data.getOrDefault("message", "Không thuộc nhóm định mức");
        return ResponseEntity.ok(new SuccessResponseDTO<>(data, msg));
    }

    @GetMapping("/membership")
    public ResponseEntity<SuccessResponseDTO<Map<String, Object>>> getMembershipByUserId(
            @RequestParam Integer userId) {
        Map<String, Object> data = quotaGroupService.resolveMembership(userId);
        return ResponseEntity.ok(new SuccessResponseDTO<>(data, (String) data.get("message")));
    }

    // -------------------------------------------------------------------
    // GET /research-groups/quota/my-quota
    // Trả về bảng tiêu chí + hệ số của nhóm
    // -------------------------------------------------------------------
    @GetMapping("/my-quota")
    public ResponseEntity<SuccessResponseDTO<Map<String, Object>>> getMyQuota() {
        SecurityUtils.assertCurrentUserCanAccessQuota();
        Integer userId = SecurityUtils.getCurrentUserId();
        if (userId == null) throw new RuntimeException("Vui lòng đăng nhập");

        ResearchGroup group = getMyQuotaGroup(userId);
        if (group == null) {
            return ResponseEntity.ok(new SuccessResponseDTO<>(null, "Người dùng không thuộc nhóm định mức nào"));
        }

        String type = group.getGroupType();
        User currentUser = userRepo.findById(userId).orElseThrow();

        boolean isLeader = group.isLeader(currentUser);
        String chucDanh  = currentUser.getIdTitle() != null ? currentUser.getIdTitle().getName() : "KS/CN";

        List<ResearchGroupMember> members = memberRepo.findByGroupId(group.getId());
        List<Map<String, Object>> criteria = getCriteriaForType(type);

        List<Map<String, Object>> rows = new ArrayList<>();
        for (Map<String, Object> c : criteria) {
            String code = (String) c.get("code");
            boolean isGroupLevel = Boolean.TRUE.equals(c.get("isGroupLevel"));
            Double requiredQty = isGroupLevel ? null
                    : computeService.getMemberRequiredQty(type, code, chucDanh, isLeader);
            Double coeff = requiredQty != null ? requiredQty : 0.0;

            Map<String, Object> row = new LinkedHashMap<>();
            row.put("code", code);
            row.put("name", c.get("name"));
            row.put("unit", c.get("unit"));
            row.put("isGroupLevel", isGroupLevel);
            row.put("coefficient", coeff);
            row.put("requiredQty", requiredQty);
            if (isGroupLevel) {
                row.put("groupQuota", c.get("groupQuota"));
            }
            rows.add(row);
        }

        Map<String, Object> data = new LinkedHashMap<>();
        data.put("userId", userId);
        data.put("groupId", group.getId());
        data.put("groupName", group.getGroupName());
        data.put("groupType", type);
        data.put("memberCount", members.size());
        data.put("isLeader", isLeader);
        data.put("chucDanh", chucDanh);
        data.put("memberFactor", computeService.getMemberFactor(type));
        data.put("benefits", NckhGroupQuotaRules.getBenefits(type));
        data.put("criteria", rows);

        if (NckhGroupQuotaRules.resolveGroupKind(type) != null
                && NckhGroupQuotaRules.resolveGroupKind(type).equals("NCM")) {
            Map<String, Object> groupQuotas = NckhGroupQuotaRules.getNcmGroupLevelQuotas(members.size());
            groupQuotas.put("sizeBandLabel",
                    NckhGroupQuotaRules.getSizeBandLabel((String) groupQuotas.get("sizeBand")));
            data.put("ncmGroupQuotas", groupQuotas);
        }

        Map<String, String> leaderQuota = NckhGroupQuotaRules.getLeaderQuota(type);
        if (!leaderQuota.isEmpty()) {
            data.put("leaderQuota", leaderQuota);
        }

        return ResponseEntity.ok(new SuccessResponseDTO<>(data, "Lấy định mức nhóm thành công"));
    }

    // -------------------------------------------------------------------
    // GET /research-groups/quota/my-stats?year=2025
    // Trả về thống kê hoạt động của cả nhóm + phần chia đều cho mỗi thành viên.
    // Logic: tổng_qty_nhóm / số_thành_viên >= định_mức_cá_nhân → cá nhân ĐẠT
    // -------------------------------------------------------------------
    @GetMapping("/my-stats")
    public ResponseEntity<SuccessResponseDTO<Map<String, Object>>> getMyGroupStats(
            @RequestParam(required = false) Integer year) {
        SecurityUtils.assertCurrentUserCanAccessQuota();
        Integer userId = SecurityUtils.getCurrentUserId();
        if (userId == null) throw new RuntimeException("Vui lòng đăng nhập");

        ResearchGroup group = getMyQuotaGroup(userId);
        if (group == null) {
            return ResponseEntity.ok(new SuccessResponseDTO<>(null, "Người dùng không thuộc nhóm định mức nào"));
        }

        int academicYear = (year != null) ? year : java.time.LocalDate.now().getYear();

        User currentUser = userRepo.findById(userId).orElseThrow();
        List<ResearchGroupMember> members = memberRepo.findByGroupId(group.getId());
        List<Integer> memberIds = memberRequiredHoursService.collectQuotaMemberUserIds(group, members);

        Map<String, Object> data = aggregationService.buildMemberStats(
                group,
                currentUser,
                memberIds,
                academicYear,
                getCriteriaForType(group.getGroupType()));

        return ResponseEntity.ok(new SuccessResponseDTO<>(data, "Lấy thống kê nhóm thành công"));
    }

    // -------------------------------------------------------------------
    // POST /research-groups/quota/my-calculate
    // Body: { "quantities": { "BB_WOS_SCOPUS": 2, "NHIEM_VU_BO_CHU": 1 } }
    // -------------------------------------------------------------------
    @PostMapping("/my-calculate")
    public ResponseEntity<SuccessResponseDTO<Map<String, Object>>> calculateMyGroup(
            @RequestBody Map<String, Object> body) {
        SecurityUtils.assertCurrentUserCanAccessQuota();
        Integer userId = SecurityUtils.getCurrentUserId();
        if (userId == null) throw new RuntimeException("Vui lòng đăng nhập");

        ResearchGroup group = getMyQuotaGroup(userId);
        if (group == null) {
            return ResponseEntity.ok(new SuccessResponseDTO<>(null, "Người dùng không thuộc nhóm định mức nào"));
        }

        String type = group.getGroupType();
        User currentUser = userRepo.findById(userId).orElseThrow();

        boolean isLeader = group.isLeader(currentUser);
        String chucDanh  = currentUser.getIdTitle() != null ? currentUser.getIdTitle().getName() : "KS/CN";

        @SuppressWarnings("unchecked")
        Map<String, Number> quantities = (Map<String, Number>) body.getOrDefault("quantities", Map.of());

        List<Map<String, Object>> items = new ArrayList<>();
        double totalHours = 0.0;

        for (Map.Entry<String, Number> entry : quantities.entrySet()) {
            String code = entry.getKey();
            double qty  = entry.getValue().doubleValue();
            if (qty <= 0) continue;

            Double hours = computeService.computeGroupMemberQuota(qty, type, code, chucDanh, isLeader);
            if (hours == null) continue;

            totalHours += hours;
            Map<String, Object> item = new LinkedHashMap<>();
            item.put("code",  code);
            item.put("qty",   qty);
            item.put("hours", hours);
            items.add(item);
        }

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("groupType",  type);
        result.put("chucDanh",   chucDanh);
        result.put("isLeader",   isLeader);
        result.put("items",      items);
        result.put("totalHours", totalHours);

        return ResponseEntity.ok(new SuccessResponseDTO<>(result, "Tính định mức thành công"));
    }

    // -------------------------------------------------------------------
    // GET /research-groups/quota/criteria-matrix?groupType=NCM
    // Trả về ma trận hệ số đầy đủ cho tất cả chức danh
    // -------------------------------------------------------------------
    @GetMapping("/criteria-matrix")
    public ResponseEntity<SuccessResponseDTO<Map<String, Object>>> getCriteriaMatrix(
            @RequestParam(required = false) String groupType) {
        SecurityUtils.assertCurrentUserCanAccessQuota();
        if (groupType == null || groupType.isBlank()) {
            Integer userId = SecurityUtils.getCurrentUserId();
            if (userId != null) {
                ResearchGroup group = getMyQuotaGroup(userId);
                if (group != null) groupType = group.getGroupType();
            }
        }
        if (groupType == null) {
            return ResponseEntity.ok(new SuccessResponseDTO<>(null, "Không xác định được loại nhóm"));
        }

        String type = groupType.toUpperCase();
        List<Map<String, Object>> criteria = getCriteriaForType(type);
        String[] chucDanhs;
        if (type.contains("NCM")) {
            chucDanhs = new String[]{"GS_PGS", "TS", "THS", "KS_CN"};
        } else {
            chucDanhs = new String[]{"GS_PGS", "TS", "THS"};
        }

        List<Map<String, Object>> matrix = new ArrayList<>();
        for (Map<String, Object> c : criteria) {
            String code = (String) c.get("code");
            boolean isGroupLevel = Boolean.TRUE.equals(c.get("isGroupLevel"));

            Map<String, Object> row = new LinkedHashMap<>();
            row.put("code", code);
            row.put("name", c.get("name"));
            row.put("unit", c.get("unit"));
            row.put("isGroupLevel", isGroupLevel);

            if (isGroupLevel) {
                row.put("groupQuota", c.get("groupQuota"));
                row.put("coefficients", Map.of());
            } else {
                Map<String, Double> coeffs = new LinkedHashMap<>();
                for (String cd : chucDanhs) {
                    String mappedCd = cd.replace("_", "");
                    Double coeff = computeService.getMemberRequiredQty(type, code, mappedCd, false);
                    coeffs.put(cd, coeff != null ? coeff : 0.0);
                }
                row.put("coefficients", coeffs);
            }

            matrix.add(row);
        }

        Map<String, String> leaderQuota = NckhGroupQuotaRules.getLeaderQuota(type);
        if (leaderQuota.isEmpty()) leaderQuota = null;

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("groupType", groupType);
        result.put("chucDanhs", chucDanhs);
        result.put("matrix", matrix);
        if (leaderQuota != null) result.put("leaderQuota", leaderQuota);

        return ResponseEntity.ok(new SuccessResponseDTO<>(result, "Lấy ma trận định mức thành công"));
    }

    // -------------------------------------------------------------------
    // GET /research-groups/quota/group-members?groupId=X
    // Trả về danh sách thành viên nhóm + hệ số định mức của từng người
    // -------------------------------------------------------------------
    @GetMapping("/group-members")
    public ResponseEntity<SuccessResponseDTO<Map<String, Object>>> getGroupMembers(
            @RequestParam(required = false) Integer groupId) {
        SecurityUtils.assertCurrentUserCanAccessQuota();
        Integer userId = SecurityUtils.getCurrentUserId();
        if (userId == null) throw new RuntimeException("Vui lòng đăng nhập");

        ResearchGroup group;
        if (groupId != null) {
            group = groupRepo.findById(groupId).orElseThrow();
        } else {
            group = getMyQuotaGroup(userId);
        }
        if (group == null) {
            return ResponseEntity.ok(new SuccessResponseDTO<>(null, "Không tìm thấy nhóm"));
        }

        List<ResearchGroupMember> members = memberRepo.findByGroupId(group.getId());
        List<Map<String, Object>> criteria = getCriteriaForType(group.getGroupType());

        List<Map<String, Object>> memberList = new ArrayList<>();
        for (ResearchGroupMember m : members) {
            User user = userRepo.findById(m.getUserId()).orElse(null);
            if (user == null) continue;

            String chucDanh = user.getIdTitle() != null ? user.getIdTitle().getName() : "KS/CN";
            boolean isLeader = group.isLeader(user);

            List<Map<String, Object>> quotaItems = new ArrayList<>();
            for (Map<String, Object> c : criteria) {
                if (Boolean.TRUE.equals(c.get("isGroupLevel"))) continue;
                String code = (String) c.get("code");
                Double requiredQty = computeService.getMemberRequiredQty(group.getGroupType(), code, chucDanh, isLeader);
                Map<String, Object> item = new LinkedHashMap<>();
                item.put("code", code);
                item.put("name", c.get("name"));
                item.put("coefficient", requiredQty != null ? requiredQty : 0.0);
                item.put("requiredQty", requiredQty);
                quotaItems.add(item);
            }

            Map<String, Object> memberData = new LinkedHashMap<>();
            memberData.put("userId", user.getId());
            memberData.put("name", user.getName());
            memberData.put("chucDanh", chucDanh);
            memberData.put("role", m.getRole());
            memberData.put("isLeader", isLeader);
            memberData.put("quotaItems", quotaItems);
            memberList.add(memberData);
        }

        Map<String, Object> data = new LinkedHashMap<>();
        data.put("groupId", group.getId());
        data.put("groupName", group.getGroupName());
        data.put("groupType", group.getGroupType());
        data.put("memberCount", members.size());
        data.put("members", memberList);

        return ResponseEntity.ok(new SuccessResponseDTO<>(data, "Lấy danh sách thành viên thành công"));
    }

    // -------------------------------------------------------------------
    // GET /research-groups/quota/admin-groups
    // Nhóm có thể xem thống kê:
    // - admin/assistant: toàn bộ nhóm định mức đã duyệt
    // - leader: chỉ nhóm mình đang làm leader
    // -------------------------------------------------------------------
    @GetMapping("/admin-groups")
    public ResponseEntity<SuccessResponseDTO<Map<String, Object>>> getManageableGroups() {
        SecurityUtils.assertCurrentUserCanAccessQuota();
        User currentUser = requireCurrentUser();
        boolean staff = SecurityUtils.hasNckhStaffAccess(currentUser);

        List<ResearchGroup> groups = resolveManageableQuotaGroups(currentUser, staff);

        List<Map<String, Object>> rows = groups.stream()
                .map(g -> {
                    Map<String, Object> row = new LinkedHashMap<>();
                    row.put("groupId", g.getId());
                    row.put("groupName", g.getGroupName());
                    row.put("groupType", g.getGroupType());
                    row.put("isLeader", g.isLeader(currentUser));
                    row.put("canViewStats", staff || g.isLeader(currentUser));
                    return row;
                })
                .toList();

        Map<String, Object> data = new LinkedHashMap<>();
        data.put("groups", rows);
        data.put("count", rows.size());
        data.put("asStaff", staff);
        return ResponseEntity.ok(new SuccessResponseDTO<>(data, "Lấy danh sách nhóm thành công"));
    }

    // -------------------------------------------------------------------
    // GET /research-groups/quota/admin-group-stats?groupId=1&year=2026
    // Trả về thống kê hoàn thành nhóm + tỷ lệ đóng góp từng thành viên
    // -------------------------------------------------------------------
    @GetMapping("/admin-group-stats")
    public ResponseEntity<SuccessResponseDTO<Map<String, Object>>> getAdminGroupStats(
            @RequestParam Integer groupId,
            @RequestParam(required = false) Integer year) {
        SecurityUtils.assertCurrentUserCanAccessQuota();
        User currentUser = requireCurrentUser();
        ResearchGroup group = groupRepo.findById(groupId).orElseThrow();
        if (!ResearchGroupQuotaService.qualifiesForQuota(group)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Nhóm không thuộc diện định mức hoặc chưa duyệt");
        }

        boolean staff = SecurityUtils.hasNckhStaffAccess(currentUser);
        boolean leader = group.isLeader(currentUser);
        if (!staff && !leader) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Bạn không có quyền xem thống kê nhóm này");
        }

        int academicYear = (year != null) ? year : java.time.LocalDate.now().getYear();
        List<ResearchGroupMember> members = memberRepo.findByGroupId(group.getId());
        List<Integer> memberIds = memberRequiredHoursService.collectQuotaMemberUserIds(group, members);
        if (memberIds.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Nhóm chưa có thành viên");
        }

        List<User> memberUsers = userRepo.findAllById(memberIds);
        Map<Integer, User> userMap = new HashMap<>();
        for (User u : memberUsers) {
            userMap.put(u.getId(), u);
        }

        Map<String, Object> data = aggregationService.buildAdminGroupStats(
                group, memberIds, academicYear, userMap);
        data.put("viewerIsStaff", staff);
        data.put("viewerIsLeader", leader);

        return ResponseEntity.ok(new SuccessResponseDTO<>(data, "Lấy thống kê nhóm thành công"));
    }

    // -------------------------------------------------------------------
    // GET /research-groups/quota/admin-scheme-comparison?year=2026
    // So sánh 3 phương án nhóm: số thành viên & % hoàn thành (biểu đồ tổng hợp)
    // -------------------------------------------------------------------
    @GetMapping("/admin-scheme-comparison")
    public ResponseEntity<SuccessResponseDTO<Map<String, Object>>> getAdminSchemeComparison(
            @RequestParam(required = false) Integer year) {
        SecurityUtils.assertCurrentUserCanAccessQuota();
        User currentUser = requireCurrentUser();
        boolean staff = SecurityUtils.hasNckhStaffAccess(currentUser);
        int academicYear = (year != null) ? year : java.time.LocalDate.now().getYear();

        List<ResearchGroup> groups = resolveManageableQuotaGroups(currentUser, staff);
        Map<Integer, List<Integer>> groupMemberIds = new LinkedHashMap<>();
        for (ResearchGroup group : groups) {
            List<ResearchGroupMember> members = memberRepo.findByGroupId(group.getId());
            groupMemberIds.put(
                    group.getId(),
                    memberRequiredHoursService.collectQuotaMemberUserIds(group, members));
        }

        List<Map<String, Object>> schemes = aggregationService.buildSchemeComparisonStats(
                groups, groupMemberIds, academicYear);

        Map<String, Object> data = new LinkedHashMap<>();
        data.put("academicYear", academicYear);
        data.put("schemes", schemes);
        data.put("asStaff", staff);
        data.put("groupCount", groups.size());
        return ResponseEntity.ok(new SuccessResponseDTO<>(data, "Lấy thống kê so sánh phương án nhóm thành công"));
    }

    // -------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------
    private List<ResearchGroup> resolveManageableQuotaGroups(User currentUser, boolean staff) {
        List<ResearchGroup> groups;
        if (staff) {
            groups = groupRepo.findAll().stream()
                    .filter(ResearchGroupQuotaService::qualifiesForQuota)
                    .toList();
        } else {
            LinkedHashSet<ResearchGroup> leaderGroups = new LinkedHashSet<>();
            leaderGroups.addAll(groupRepo.findByLeader(currentUser));
            memberRepo.findAllByUserId(currentUser.getId()).stream()
                    .map(m -> groupRepo.findById(m.getGroupId()).orElse(null))
                    .filter(Objects::nonNull)
                    .forEach(leaderGroups::add);
            groups = leaderGroups.stream()
                    .filter(ResearchGroupQuotaService::qualifiesForQuota)
                    .filter(g -> g.isLeader(currentUser))
                    .toList();
        }
        return groups;
    }

    private boolean isQuotaGroup(String type) {
        return ResearchGroupQuotaService.isQuotaGroupType(type);
    }

    private User requireCurrentUser() {
        Integer userId = SecurityUtils.getCurrentUserId();
        if (userId == null) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Vui lòng đăng nhập");
        return userRepo.findById(userId).orElseThrow();
    }

    private static double toDouble(Object v) {
        return v instanceof Number n ? n.doubleValue() : 0.0;
    }

    private List<Map<String, Object>> getCriteriaForType(String type) {
        String up = type.toUpperCase();
        if (up.contains("XUAT_SAC")) return XS_CRITERIA;
        if (up.contains("TINH_HOA")) return TH_CRITERIA;
        return NCM_CRITERIA;
    }

    private static Map<String, Object> crit(String code, String name, String unit) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("code", code);
        m.put("name", name);
        m.put("unit", unit);
        m.put("isGroupLevel", false);
        return m;
    }

    private static Map<String, Object> critGroup(String code, String name, String unit, String groupQuota) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("code", code);
        m.put("name", name);
        m.put("unit", unit);
        m.put("groupQuota", groupQuota);
        m.put("isGroupLevel", true);
        return m;
    }

    private static double round2(double v) {
        return Math.round(v * 100.0) / 100.0;
    }
}
