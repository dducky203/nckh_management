package com.example.server.service.researchgroup;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.server.domain.ResearchGroup;
import com.example.server.domain.ResearchGroupMember;
import com.example.server.domain.User;
import com.example.server.repository.ResearchGroupMemberRepository;
import com.example.server.repository.ResearchGroupRepository;
import com.example.server.repository.UserRepository;
import com.example.server.constant.NckhTieuChiConstants;
import com.example.server.service.nckh.NckhComputeService;
import com.example.server.service.nckh.NckhGroupQuotaRules;

@Service
public class ResearchGroupQuotaService {

    private final NckhComputeService computeService;
    private final ResearchGroupRepository groupRepo;
    private final ResearchGroupMemberRepository memberRepo;
    private final UserRepository userRepo;

    public ResearchGroupQuotaService(
            NckhComputeService computeService,
            ResearchGroupRepository groupRepo,
            ResearchGroupMemberRepository memberRepo,
            UserRepository userRepo) {
        this.computeService = computeService;
        this.groupRepo = groupRepo;
        this.memberRepo = memberRepo;
        this.userRepo = userRepo;
    }

    public Double calculateMemberQuota(double qty, String groupType, String tieuChiCode,
                                       String academicTitle, boolean isLeader) {
        return computeService.computeGroupMemberQuota(qty, groupType, tieuChiCode, academicTitle, isLeader);
    }

    /** Nhóm GV (lecturer) + group_type NCM/XUAT_SAC/TINH_HOA + đã duyệt. */
    public Optional<ResearchGroup> findApprovedQuotaGroup(Integer userId) {
        if (userId == null) return Optional.empty();
        for (ResearchGroupMember rm : memberRepo.findAllByUserId(userId)) {
            ResearchGroup g = groupRepo.findById(rm.getGroupId()).orElse(null);
            if (g != null && qualifiesForQuota(g)) {
                return Optional.of(g);
            }
        }
        return Optional.empty();
    }

    public static boolean isLecturerGroup(String type) {
        return type != null && "lecturer".equalsIgnoreCase(type.trim());
    }

    /** Phương án định mức: NCM / XUAT_SAC / TINH_HOA (trường group_type). */
    public static boolean isQuotaScheme(String groupType) {
        return NckhGroupQuotaRules.resolveGroupKind(groupType) != null;
    }

    public static boolean qualifiesForQuota(ResearchGroup g) {
        if (g == null || g.getStatus() != ResearchGroup.GroupStatus.APPROVED) {
            return false;
        }
        return isLecturerGroup(g.getType()) && isQuotaScheme(g.getGroupType());
    }

    /**
     * Kiểm tra chi tiết: user có thuộc 1 trong 3 nhóm định mức (NCM / Xuất sắc / Tinh hoa) hay không.
     */
    public Map<String, Object> resolveMembership(Integer userId) {
        Map<String, Object> result = new LinkedHashMap<>();
        if (userId == null) {
            result.put("inQuotaGroup", false);
            result.put("reason", "NOT_LOGGED_IN");
            result.put("message", "Chưa đăng nhập");
            result.put("allMemberships", List.of());
            return result;
        }

        User user = userRepo.findById(userId).orElse(null);
        if (user == null) {
            result.put("inQuotaGroup", false);
            result.put("reason", "USER_NOT_FOUND");
            result.put("message", "Không tìm thấy người dùng");
            result.put("allMemberships", List.of());
            return result;
        }

        List<ResearchGroupMember> memberships = memberRepo.findAllByUserId(userId);
        List<Map<String, Object>> membershipRows = new ArrayList<>();

        ResearchGroup matchedGroup = null;
        String reason = "NOT_IN_ANY_GROUP";

        if (memberships.isEmpty()) {
            result.put("message", "Người dùng chưa được thêm vào nhóm nghiên cứu nào");
        } else {
            boolean hasPending = false;
            boolean hasWrongScheme = false;
            boolean hasNotLecturer = false;

            for (ResearchGroupMember rm : memberships) {
                ResearchGroup g = groupRepo.findById(rm.getGroupId()).orElse(null);
                if (g == null) continue;

                String quotaKind = NckhGroupQuotaRules.resolveGroupKind(g.getGroupType());
                boolean lecturer = isLecturerGroup(g.getType());
                boolean isQuotaScheme = quotaKind != null;
                boolean isApproved = g.getStatus() == ResearchGroup.GroupStatus.APPROVED;
                boolean countsForQuota = lecturer && isQuotaScheme && isApproved;

                Map<String, Object> row = new LinkedHashMap<>();
                row.put("groupId", g.getId());
                row.put("groupName", g.getGroupName());
                row.put("type", g.getType());
                row.put("groupType", g.getGroupType());
                row.put("quotaKind", quotaKind);
                row.put("quotaKindLabel", quotaKindLabel(quotaKind));
                row.put("status", g.getStatus() != null ? g.getStatus().name() : null);
                row.put("role", rm.getRole());
                row.put("isLecturerGroup", lecturer);
                row.put("isQuotaScheme", isQuotaScheme);
                row.put("isApproved", isApproved);
                row.put("countsForQuota", countsForQuota);
                row.put("isLeader", g.isLeader(user));
                membershipRows.add(row);

                if (countsForQuota && matchedGroup == null) {
                    matchedGroup = g;
                }
                if (!isApproved) hasPending = true;
                if (!lecturer) hasNotLecturer = true;
                if (lecturer && !isQuotaScheme) hasWrongScheme = true;
            }

            if (matchedGroup != null) {
                reason = "OK";
            } else if (hasPending) {
                reason = "GROUP_NOT_APPROVED";
            } else if (hasWrongScheme || hasNotLecturer) {
                reason = "GROUP_TYPE_NOT_QUOTA";
            } else {
                reason = "NOT_IN_QUOTA_GROUP";
            }

            result.put("message", membershipMessage(reason));
        }

        result.put("userId", userId);
        result.put("userName", user.getName());
        result.put("inQuotaGroup", matchedGroup != null);
        result.put("reason", reason);
        result.put("allMemberships", membershipRows);

        if (matchedGroup != null) {
            String kind = NckhGroupQuotaRules.resolveGroupKind(matchedGroup.getGroupType());
            result.put("groupId", matchedGroup.getId());
            result.put("groupName", matchedGroup.getGroupName());
            result.put("type", matchedGroup.getType());
            result.put("groupType", matchedGroup.getGroupType());
            result.put("quotaKind", kind);
            result.put("quotaKindLabel", quotaKindLabel(kind));
            result.put("isLeader", matchedGroup.isLeader(user));
            result.put("memberFactor", NckhGroupQuotaRules.getMemberFactor(matchedGroup.getGroupType()));
        }

        return result;
    }

    private static String quotaKindLabel(String kind) {
        if (kind == null) return null;
        return switch (kind) {
            case "NCM" -> "Nhóm nghiên cứu mạnh (Phương án 1)";
            case "XUAT_SAC" -> "Nhóm xuất sắc (Phương án 2)";
            case "TINH_HOA" -> "Nhóm tinh hoa (Phương án 3)";
            default -> kind;
        };
    }

    private static String membershipMessage(String reason) {
        return switch (reason) {
            case "OK" -> "Thuộc nhóm định mức NCKH (NCM / Xuất sắc / Tinh hoa) đã duyệt";
            case "NOT_IN_ANY_GROUP" -> "Chưa tham gia nhóm nghiên cứu nào";
            case "GROUP_NOT_APPROVED" -> "Có nhóm nhưng chưa được duyệt (APPROVED)";
            case "GROUP_TYPE_NOT_QUOTA" ->
                    "Cần nhóm giảng viên (type = lecturer) và phương án định mức (group_type = NCM / XUAT_SAC / TINH_HOA)";
            case "NOT_IN_QUOTA_GROUP" -> "Không thuộc nhóm định mức";
            default -> "";
        };
    }

    /** @deprecated dùng {@link #isQuotaScheme(String)} hoặc {@link #qualifiesForQuota(ResearchGroup)} */
    @Deprecated
    public static boolean isQuotaGroupType(String groupType) {
        return isQuotaScheme(groupType);
    }

    public static List<String> catalogCodesForCriterion(String criterionCode) {
        if (criterionCode == null) return List.of();
        List<String> ncmTable2 = NckhGroupQuotaRules.getNcmTable2CatalogCodes(criterionCode);
        if (!ncmTable2.isEmpty()) {
            return ncmTable2;
        }
        return switch (criterionCode) {
            case NckhTieuChiConstants.BB_WOS_SCOPUS -> List.of(NckhTieuChiConstants.BB_WOS_SCOPUS, NckhTieuChiConstants.BB_SCOPUS);
            case "NHIEM_VU_BO_CHU" -> List.of(
                    "NHIEM_VU_BO_CHU", "NHIEM_VU_BO_TK", "NHIEM_VU_BO_TG");
            case NckhTieuChiConstants.HOI_DONG_TU_VAN -> List.of("HOI_DONG_TV");
            default -> List.of(criterionCode);
        };

    }

    public static double sumQtyForCriterion(
            java.util.Map<String, Double> qtyByCatalog, String criterionCode) {
        double sum = 0;
        for (String code : catalogCodesForCriterion(criterionCode)) {
            sum += qtyByCatalog.getOrDefault(code, 0.0);
        }
        return sum;
    }
}
