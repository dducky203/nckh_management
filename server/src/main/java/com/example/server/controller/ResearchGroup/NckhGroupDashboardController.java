package com.example.server.controller.ResearchGroup;

import java.util.*;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.server.DTO.response.SuccessResponseDTO;
import com.example.server.DTO.nckh.ActivityStatisticsResponse;
import com.example.server.domain.ResearchGroup;
import com.example.server.domain.ResearchGroupMember;
import com.example.server.domain.User;
import com.example.server.repository.ResearchGroupMemberRepository;
import com.example.server.repository.ResearchGroupRepository;
import com.example.server.repository.UserRepository;
import com.example.server.repository.nckh.NckhActivityRepository;
import com.example.server.service.nckh.NckhComputeService;
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
    private final NckhActivityRepository activityRepo;

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
        critGroup("HOI_DONG_TU_VAN", "Tổ chức Hội đồng tư vấn KH",                             "HĐ",   "2 HĐ/năm/nhóm"),
        critGroup("MOI_CHUYEN_GIA",  "Mời chuyên gia trình bày Seminar/chuyên đề",              "buổi", "2 Seminar/năm/nhóm")
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
        List<ResearchGroupMember> memberships = memberRepo.findAllByUserId(userId);
        for (ResearchGroupMember rm : memberships) {
            ResearchGroup g = groupRepo.findById(rm.getGroupId()).orElse(null);
            if (g != null && g.getStatus() == ResearchGroup.GroupStatus.APPROVED && isQuotaGroup(g.getType())) {
                return g;
            }
        }
        return null;
    }

    // -------------------------------------------------------------------
    // GET /research-groups/quota/my-quota
    // Trả về bảng tiêu chí + hệ số của nhóm
    // -------------------------------------------------------------------
    @GetMapping("/my-quota")
    public ResponseEntity<SuccessResponseDTO<Map<String, Object>>> getMyQuota() {

        Integer userId = SecurityUtils.getCurrentUserId();
        if (userId == null) throw new RuntimeException("Vui lòng đăng nhập");

        ResearchGroup group = getMyQuotaGroup(userId);
        if (group == null) {
            return ResponseEntity.ok(new SuccessResponseDTO<>(null, "Người dùng không thuộc nhóm định mức nào"));
        }

        String type = group.getType();
        User currentUser = userRepo.findById(userId).orElseThrow();

        boolean isLeader = group.isLeader(currentUser);
        String chucDanh  = currentUser.getIdTitle() != null ? currentUser.getIdTitle().getName() : "KS/CN";

        List<ResearchGroupMember> members = memberRepo.findByGroupId(group.getId());
        List<Map<String, Object>> criteria = getCriteriaForType(type);

        List<Map<String, Object>> rows = new ArrayList<>();
        for (Map<String, Object> c : criteria) {
            String code   = (String) c.get("code");
            Double coeff  = computeService.computeGroupMemberQuota(1.0, type, code, chucDanh, isLeader);

            Map<String, Object> row = new LinkedHashMap<>();
            row.put("code",        code);
            row.put("name",        c.get("name"));
            row.put("unit",        c.get("unit"));
            row.put("coefficient", coeff != null ? coeff : 0.0);
            rows.add(row);
        }

        Map<String, Object> data = new LinkedHashMap<>();
        data.put("groupId",     group.getId());
        data.put("groupName",   group.getGroupName());
        data.put("groupType",   type);
        data.put("memberCount", members.size());
        data.put("isLeader",    isLeader);
        data.put("chucDanh",    chucDanh);
        data.put("criteria",    rows);

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

        Integer userId = SecurityUtils.getCurrentUserId();
        if (userId == null) throw new RuntimeException("Vui lòng đăng nhập");

        ResearchGroup group = getMyQuotaGroup(userId);
        if (group == null) {
            return ResponseEntity.ok(new SuccessResponseDTO<>(null, "Người dùng không thuộc nhóm định mức nào"));
        }

        int academicYear = (year != null) ? year : java.time.LocalDate.now().getYear();

        // Lấy danh sách userId của toàn bộ thành viên
        List<ResearchGroupMember> members = memberRepo.findByGroupId(group.getId());
        List<Integer> memberIds = members.stream()
                .map(ResearchGroupMember::getUserId)
                .collect(java.util.stream.Collectors.toList());

        int memberCount = Math.max(1, memberIds.size());

        // Tổng hợp hoạt động APPROVED của cả nhóm
        List<ActivityStatisticsResponse> groupStats = activityRepo.getGroupStatsByYear(memberIds, academicYear);

        // Build map: catalogCode → tổng nhóm
        Map<String, ActivityStatisticsResponse> statsMap = new LinkedHashMap<>();
        for (ActivityStatisticsResponse s : groupStats) {
            statsMap.put(s.getCatalogCode(), s);
        }

        // Tính phần chia đều + đánh giá ĐẠT/KHÔNG ĐẠT cho từng tiêu chí
        List<Map<String, Object>> criteriaStats = new ArrayList<>();
        List<Map<String, Object>> criteria = getCriteriaForType(group.getType());

        for (Map<String, Object> c : criteria) {
            String code = (String) c.get("code");
            ActivityStatisticsResponse stat = statsMap.get(code);

            double groupTotalQty   = stat != null ? (stat.getTotalQty() != null ? stat.getTotalQty() : 0.0) : 0.0;
            double groupTotalHours = stat != null ? (stat.getTotalQuotaHours() != null ? stat.getTotalQuotaHours() : 0.0) : 0.0;
            double perMemberQty    = groupTotalQty / memberCount;
            double perMemberHours  = groupTotalHours / memberCount;

            Map<String, Object> row = new LinkedHashMap<>();
            row.put("code",           code);
            row.put("name",           c.get("name"));
            row.put("unit",           c.get("unit"));
            row.put("groupTotalQty",  Math.round(groupTotalQty * 100.0) / 100.0);
            row.put("groupTotalHours",Math.round(groupTotalHours * 100.0) / 100.0);
            row.put("perMemberQty",   Math.round(perMemberQty * 100.0) / 100.0);
            row.put("perMemberHours", Math.round(perMemberHours * 100.0) / 100.0);
            row.put("memberCount",    memberCount);
            criteriaStats.add(row);
        }

        double totalGroupHours  = criteriaStats.stream()
                .mapToDouble(r -> (Double) r.get("groupTotalHours")).sum();
        double totalPerMemberHours = totalGroupHours / memberCount;

        Map<String, Object> data = new LinkedHashMap<>();
        data.put("groupId",            group.getId());
        data.put("groupName",          group.getGroupName());
        data.put("groupType",          group.getType());
        data.put("memberCount",        memberCount);
        data.put("academicYear",       academicYear);
        data.put("totalGroupHours",    Math.round(totalGroupHours * 100.0) / 100.0);
        data.put("totalPerMemberHours",Math.round(totalPerMemberHours * 100.0) / 100.0);
        data.put("criteria",           criteriaStats);

        return ResponseEntity.ok(new SuccessResponseDTO<>(data, "Lấy thống kê nhóm thành công"));
    }

    // -------------------------------------------------------------------
    // POST /research-groups/quota/my-calculate
    // Body: { "quantities": { "BB_WOS_SCOPUS": 2, "NHIEM_VU_BO_CHU": 1 } }
    // -------------------------------------------------------------------
    @PostMapping("/my-calculate")
    public ResponseEntity<SuccessResponseDTO<Map<String, Object>>> calculateMyGroup(
            @RequestBody Map<String, Object> body) {

        Integer userId = SecurityUtils.getCurrentUserId();
        if (userId == null) throw new RuntimeException("Vui lòng đăng nhập");

        ResearchGroup group = getMyQuotaGroup(userId);
        if (group == null) {
            return ResponseEntity.ok(new SuccessResponseDTO<>(null, "Người dùng không thuộc nhóm định mức nào"));
        }

        String type = group.getType();
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

        if (groupType == null || groupType.isBlank()) {
            Integer userId = SecurityUtils.getCurrentUserId();
            if (userId != null) {
                ResearchGroup group = getMyQuotaGroup(userId);
                if (group != null) groupType = group.getType();
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
                    Double coeff = computeService.computeGroupMemberQuota(1.0, type, code, mappedCd, false);
                    coeffs.put(cd, coeff != null ? coeff : 0.0);
                }
                row.put("coefficients", coeffs);
            }

            matrix.add(row);
        }

        Map<String, String> leaderQuota = null;
        if (type.contains("XUAT_SAC")) leaderQuota = XS_LEADER_QUOTA;
        else if (type.contains("TINH_HOA")) leaderQuota = TH_LEADER_QUOTA;

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
        List<Map<String, Object>> criteria = getCriteriaForType(group.getType());

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
                Double coeff = computeService.computeGroupMemberQuota(1.0, group.getType(), code, chucDanh, isLeader);
                Map<String, Object> item = new LinkedHashMap<>();
                item.put("code", code);
                item.put("name", c.get("name"));
                item.put("coefficient", coeff != null ? coeff : 0.0);
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
        data.put("groupType", group.getType());
        data.put("memberCount", members.size());
        data.put("members", memberList);

        return ResponseEntity.ok(new SuccessResponseDTO<>(data, "Lấy danh sách thành viên thành công"));
    }

    // -------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------
    private boolean isQuotaGroup(String type) {
        if (type == null) return false;
        String up = type.toUpperCase();
        return up.contains("NCM") || up.contains("XUAT_SAC") || up.contains("TINH_HOA");
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
}
