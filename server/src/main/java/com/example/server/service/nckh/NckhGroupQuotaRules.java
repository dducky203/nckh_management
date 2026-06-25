package com.example.server.service.nckh;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import com.example.server.DTO.nckh.GroupQuotaActivityProjection;

/**
 * Quy tắc định mức nhóm NCKH theo Phương án 1 (NCM), 2 (Xuất sắc), 3 (Tinh hoa).
 */
public final class NckhGroupQuotaRules {

    private NckhGroupQuotaRules() {}

    public static final double NCM_MEMBER_FACTOR = 0.8;
    public static final double XUAT_SAC_MEMBER_FACTOR = 1.0;
    public static final double TINH_HOA_MEMBER_FACTOR = 0.8;

    /** Tỷ lệ tối thiểu seminar do nhóm tự trình bày (Bảng 2 NCM). */
    public static final double NCM_SEMINAR_PRESENTED_RATIO = 0.7;

    /** Mã hoạt động APPROVED gắn với từng chỉ tiêu Bảng 2 NCM. */
    private static final Map<String, List<String>> NCM_TABLE2_CATALOG = Map.ofEntries(
            Map.entry("HOI_THAO_HOC_VIEN", List.of("HT_TC_HV", "HT_TO_CHUC_HOC_VIEN")),
            Map.entry("HOI_THAO_QUOC_GIA", List.of("HT_TC_QUOCGIA", "HT_TO_CHUC_QUOC_GIA")),
            Map.entry("HOI_THAO_QUOC_TE", List.of("HT_TC_QUOCTE", "HT_TO_CHUC_QUOC_TE")),
            Map.entry("CONG_BO_KHOA_HOC", List.of(
                    "TONG_QUAN", "BB_TV_HOCVIEN", "BB_TA_HOCVIEN", "BTL_FULL_TEXT", "HT_THAM_LUAN_KYYEU")),
            Map.entry("HOI_DONG_TU_VAN", List.of("HOI_DONG_TV")),
            Map.entry("MOI_CHUYEN_GIA", List.of("MOI_CHUYEN_GIA")),
            Map.entry("SEMINAR_TRINH_BAY", List.of("SEMINAR_TRINH_BAY")),
            Map.entry("SEMINAR_THAM_DU", List.of("SEMINAR_THAM_DU"))
    );

    private static final Map<String, String> NCM_TABLE2_LABELS = Map.ofEntries(
            Map.entry("HOI_THAO_HOC_VIEN", "Tổ chức Hội thảo cấp Học viện"),
            Map.entry("HOI_THAO_QUOC_GIA", "Tổ chức Hội thảo quốc gia"),
            Map.entry("HOI_THAO_QUOC_TE", "Tổ chức Hội thảo quốc tế"),
            Map.entry("CONG_BO_KHOA_HOC", "Công bố KH (TV, kỷ yếu, tổng quan)"),
            Map.entry("HOI_DONG_TU_VAN", "Hội đồng tư vấn / định hướng nghiên cứu"),
            Map.entry("MOI_CHUYEN_GIA", "Mời chuyên gia trình bày seminar"),
            Map.entry("SEMINAR_TRINH_BAY_RATIO", "Tỷ lệ seminar do nhóm trình bày"),
            Map.entry("SEMINAR_THAM_DU", "Tham dự Seminar (≥70% do nhóm trình bày)")
    );

    private static final Map<String, String> NCM_TABLE2_UNITS = Map.ofEntries(
            Map.entry("HOI_THAO_HOC_VIEN", "hội thảo"),
            Map.entry("HOI_THAO_QUOC_GIA", "hội thảo"),
            Map.entry("HOI_THAO_QUOC_TE", "hội thảo"),
            Map.entry("CONG_BO_KHOA_HOC", "bài"),
            Map.entry("HOI_DONG_TU_VAN", "HĐ"),
            Map.entry("MOI_CHUYEN_GIA", "buổi"),
            Map.entry("SEMINAR_TRINH_BAY_RATIO", "%"),
            Map.entry("SEMINAR_THAM_DU", "buổi")
    );

    public static String mapChucDanh(String raw) {
        if (raw == null) return "KSCN";
        String up = raw.toUpperCase().replace(" ", "");
        if (up.contains("GS") || up.contains("PGS")) return "GSPGS";
        if (up.contains("TS") || up.contains("TIẾNSĨ")) return "TS";
        if (up.contains("THS") || up.contains("THẠCSĨ")) return "THS";
        return "KSCN";
    }

    public static String resolveGroupKind(String groupType) {
        if (groupType == null) return null;
        String up = groupType.toUpperCase();
        if (up.contains("NCM")) return "NCM";
        if (up.contains("XUAT_SAC") || up.contains("XUẤT SẮC")) return "XUAT_SAC";
        if (up.contains("TINH_HOA")) return "TINH_HOA";
        return null;
    }

    /** Hệ số định mức so với chuẩn (0.8 hoặc 1.0). */
    public static double getMemberFactor(String groupType) {
        String kind = resolveGroupKind(groupType);
        if ("XUAT_SAC".equals(kind)) return XUAT_SAC_MEMBER_FACTOR;
        if ("TINH_HOA".equals(kind)) return TINH_HOA_MEMBER_FACTOR;
        if ("NCM".equals(kind)) return NCM_MEMBER_FACTOR;
        return 1.0;
    }

    /**
     * Định mức số lượng bắt buộc cho từng tiêu chí (thành viên, không phải trưởng nhóm).
     * Trả về null nếu tiêu chí không áp dụng.
     */
    public static Double getMemberRequiredQty(String groupType, String tieuChiCode,
                                            String chucDanh, boolean isLeader) {
        if (groupType == null || tieuChiCode == null) return null;
        String kind = resolveGroupKind(groupType);
        String cd = mapChucDanh(chucDanh);

        if ("XUAT_SAC".equals(kind)) {
            if (isLeader) return null;
            return requiredXuatSac(tieuChiCode, cd);
        }
        if ("TINH_HOA".equals(kind)) {
            if (isLeader) return null;
            return requiredTinhHoa(tieuChiCode, cd);
        }
        if ("NCM".equals(kind)) {
            return requiredNcmCoefficient(tieuChiCode, cd);
        }
        return null;
    }

    private static Double requiredXuatSac(String code, String cd) {
        switch (code) {
            case "BB_WOS_SCOPUS":
            case "BB_SCOPUS":
                if ("GSPGS".equals(cd)) return 0.60;
                if ("TS".equals(cd)) return 0.40;
                return 0.0;
            case "NHIEM_VU_BO_CHU":
                if ("GSPGS".equals(cd) || "TS".equals(cd)) return 0.40;
                return 0.0;
            default:
                return null;
        }
    }

    private static Double requiredTinhHoa(String code, String cd) {
        switch (code) {
            case "BB_WOS_SCOPUS":
            case "BB_SCOPUS":
                if ("GSPGS".equals(cd)) return 0.48;
                if ("TS".equals(cd)) return 0.32;
                return 0.0;
            case "NHIEM_VU_BO_CHU":
                if ("GSPGS".equals(cd) || "TS".equals(cd)) return 0.32;
                return 0.0;
            default:
                return null;
        }
    }

    /** Hệ số định mức NCM (qty=1) — tương đương định mức chuẩn × 0,8. */
    private static Double requiredNcmCoefficient(String code, String cd) {
        switch (code) {
            case "SEMINAR_TRINH_BAY":
            case "HT_THAM_LUAN":
                return "GSPGS".equals(cd) ? 1.6 : 0.8;
            case "BB_WOS_SCOPUS":
            case "BB_SCOPUS":
                if ("GSPGS".equals(cd)) return 0.48;
                if ("TS".equals(cd)) return 0.32;
                return 0.0;
            case "BB_TA_HOCVIEN":
                if ("GSPGS".equals(cd) || "THS".equals(cd)) return 0.4;
                return 0.0;
            case "BB_TV_HOCVIEN":
                if ("TS".equals(cd)) return 0.4;
                if ("THS".equals(cd)) return 0.8;
                if ("KSCN".equals(cd)) return 0.4;
                return 0.0;
            case "HT_THAM_LUAN_KYYEU":
                if ("GSPGS".equals(cd) || "TS".equals(cd)) return 0.8;
                if ("THS".equals(cd)) return 0.4;
                return 0.0;
            case "TU_VAN_BAN_TIN":
                if ("TS".equals(cd)) return 0.8;
                if ("THS".equals(cd)) return 1.6;
                if ("KSCN".equals(cd)) return 0.8;
                return 0.0;
            case "QUY_TRINH_KT":
                if ("TS".equals(cd)) return 0.8;
                return 0.0;
            case "DE_XUAT_BO":
                if ("GSPGS".equals(cd) || "TS".equals(cd)) return 1.6;
                if ("THS".equals(cd)) return 0.8;
                return 0.0;
            case "NHIEM_VU_BO_CHU":
                if ("GSPGS".equals(cd) || "TS".equals(cd)) return 0.32;
                return 0.0;
            case "HD_SVNCKH":
                if ("THS".equals(cd) || "KSCN".equals(cd)) return 0.8;
                return 0.0;
            default:
                return null;
        }
    }

    public static Map<String, String> getLeaderQuota(String groupType) {
        String kind = resolveGroupKind(groupType);
        if ("XUAT_SAC".equals(kind)) {
            return Map.of(
                    "BB_WOS_SCOPUS", "4 bài WoS/Scopus/năm (≥3 WoS)",
                    "NHIEM_VU_BO_CHU", "2 đề tài cấp Bộ/năm",
                    "LEADER_CONDITION", "Tác giả chính ≥1 bài WoS/Scopus HOẶC CN 1 đề tài cấp Bộ"
            );
        }
        if ("TINH_HOA".equals(kind)) {
            return Map.of(
                    "BB_WOS_SCOPUS", "8 bài WoS/Scopus/năm (≥5 WoS)",
                    "NHIEM_VU_BO_CHU", "4 đề tài cấp Bộ/năm",
                    "LEADER_CONDITION", "Tác giả chính ≥2 bài WoS HOẶC 1 bài WoS + CN 1 đề tài cấp Bộ"
            );
        }
        return Map.of();
    }

    public static List<Map<String, Object>> getBenefits(String groupType) {
        String kind = resolveGroupKind(groupType);
        if ("NCM".equals(kind)) {
            return List.of(
                    benefit("Hệ số định mức", "0,8 so với định mức chuẩn"),
                    benefit("Kinh phí nhóm", "50–70 triệu đồng/năm (nhóm ≥10 người)"),
                    benefit("Vượt định mức", "Được thanh toán tiền vượt giờ"),
                    benefit("Ưu tiên", "Xét chọn đề tài cấp Học viện")
            );
        }
        if ("XUAT_SAC".equals(kind)) {
            return List.of(
                    benefit("Kinh phí nhóm", "150 triệu đồng/năm"),
                    benefit("Trưởng nhóm", "Lương 20 triệu/tháng, 50% định mức giảng dạy"),
                    benefit("Thành viên", "Chỉ 2 tiêu chí (WoS/Scopus + Đề tài Bộ), hệ số 1,0")
            );
        }
        if ("TINH_HOA".equals(kind)) {
            return List.of(
                    benefit("Kinh phí nhóm", "400 triệu đồng/năm"),
                    benefit("Trưởng nhóm", "Lương 30 triệu/tháng, 30 giờ GD lý thuyết/năm"),
                    benefit("Thành viên", "Chỉ 2 tiêu chí, hệ số 0,8 so với chuẩn")
            );
        }
        return List.of();
    }

    private static Map<String, Object> benefit(String title, String desc) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("title", title);
        m.put("description", desc);
        return m;
    }

    /**
     * Định mức cấp nhóm NCM theo quy mô thành viên.
     */
    public static Map<String, Object> getNcmGroupLevelQuotas(int memberCount) {
        String sizeBand;
        Map<String, Object> quotas = new LinkedHashMap<>();

        quotas.put("SEMINAR_TRINH_BAY_RATIO", "70% tổng seminar do nhóm tự trình bày");

        if (memberCount < 10) {
            sizeBand = "UNDER_10";
            quotas.put("HOI_THAO_HOC_VIEN", 1.5);
            quotas.put("HOI_THAO_QUOC_GIA", 1.0);
            quotas.put("HOI_THAO_QUOC_TE", 0.0);
            quotas.put("CONG_BO_KHOA_HOC", 3.0);
        } else if (memberCount <= 20) {
            sizeBand = "FROM_10_TO_20";
            quotas.put("HOI_THAO_HOC_VIEN", 1.0);
            quotas.put("HOI_THAO_QUOC_GIA", 1.0);
            quotas.put("HOI_THAO_QUOC_TE", 0.5);
            quotas.put("CONG_BO_KHOA_HOC", 4.0);
        } else {
            sizeBand = "OVER_20";
            quotas.put("HOI_THAO_HOC_VIEN", 0.5);
            quotas.put("HOI_THAO_QUOC_GIA", 1.0);
            quotas.put("HOI_THAO_QUOC_TE", 1.0);
            quotas.put("CONG_BO_KHOA_HOC", 6.0);
        }

        quotas.put("HOI_DONG_TU_VAN", 2.0);
        quotas.put("MOI_CHUYEN_GIA", 2.0);
        quotas.put("sizeBand", sizeBand);
        quotas.put("memberCount", memberCount);
        return quotas;
    }

    public static List<String> getNcmTable2CatalogCodes(String groupQuotaKey) {
        if (groupQuotaKey == null) return List.of();
        return NCM_TABLE2_CATALOG.getOrDefault(groupQuotaKey, List.of());
    }

    /** Định mức số lượng Bảng 2 theo mã chỉ tiêu (null nếu không áp dụng). */
    public static Double getNcmGroupRequired(String groupQuotaKey, int memberCount) {
        if (groupQuotaKey == null) return null;
        Object val = getNcmGroupLevelQuotas(memberCount).get(groupQuotaKey);
        if (val instanceof Number n) return n.doubleValue();
        return null;
    }

    public static double sumActualQty(List<GroupQuotaActivityProjection> activities, String groupQuotaKey) {
        return sumActualQty(activities, getNcmTable2CatalogCodes(groupQuotaKey));
    }

    public static double sumActualQty(List<GroupQuotaActivityProjection> activities, Collection<String> catalogCodes) {
        if (activities == null || catalogCodes == null || catalogCodes.isEmpty()) return 0;
        Set<String> codes = new HashSet<>(catalogCodes);
        double sum = 0;
        for (GroupQuotaActivityProjection act : activities) {
            if (act.getCatalogCode() != null && codes.contains(act.getCatalogCode())) {
                sum += act.getEquivQty() != null ? act.getEquivQty() : 0;
            }
        }
        return sum;
    }

    /**
     * Đánh giá seminar: ≥70% hoạt động seminar của nhóm là trình bày (không chỉ tham dự).
     */
    public static Map<String, Object> evaluateSeminarPresentedRatio(List<GroupQuotaActivityProjection> activities) {
        double presented = sumActualQty(activities, "SEMINAR_TRINH_BAY");
        double attended = sumActualQty(activities, "SEMINAR_THAM_DU");
        double total = presented + attended;
        double ratio = total > 0 ? presented / total : (presented > 0 ? 1.0 : 0.0);
        boolean achieved = total <= 0 || ratio >= NCM_SEMINAR_PRESENTED_RATIO - 1e-9;

        Map<String, Object> row = new LinkedHashMap<>();
        row.put("code", "SEMINAR_TRINH_BAY_RATIO");
        row.put("name", NCM_TABLE2_LABELS.get("SEMINAR_TRINH_BAY_RATIO"));
        row.put("unit", "%");
        row.put("requiredRatio", NCM_SEMINAR_PRESENTED_RATIO);
        row.put("requiredLabel", "≥70%");
        row.put("presentedQty", round2(presented));
        row.put("attendedQty", round2(attended));
        row.put("actualQty", round2(ratio * 100));
        row.put("actualRatio", round2(ratio));
        row.put("achieved", achieved);
        row.put("isGroupLevel", true);
        row.put("evaluationMode", "SEMINAR_RATIO");
        row.put("catalogCodes", List.of("SEMINAR_TRINH_BAY", "SEMINAR_THAM_DU"));
        if (!achieved && total > 0) {
            row.put("gap", round2(Math.max(0, NCM_SEMINAR_PRESENTED_RATIO - ratio) * 100));
        }
        return row;
    }

    /**
     * Đánh giá đầy đủ Bảng 2 NCM từ hoạt động APPROVED của thành viên nhóm trong năm.
     */
    public static List<Map<String, Object>> evaluateNcmTable2(
            List<GroupQuotaActivityProjection> activities, int memberCount) {
        Map<String, Object> targets = getNcmGroupLevelQuotas(memberCount);
        List<Map<String, Object>> rows = new ArrayList<>();

        for (String key : List.of(
                "HOI_THAO_HOC_VIEN", "HOI_THAO_QUOC_GIA", "HOI_THAO_QUOC_TE",
                "CONG_BO_KHOA_HOC", "HOI_DONG_TU_VAN", "MOI_CHUYEN_GIA")) {
            if (!(targets.get(key) instanceof Number requiredNum)) continue;
            double required = requiredNum.doubleValue();
            double actual = sumActualQty(activities, key);
            boolean achieved = isAchieved(actual, required);

            Map<String, Object> row = new LinkedHashMap<>();
            row.put("code", key);
            row.put("name", NCM_TABLE2_LABELS.getOrDefault(key, key));
            row.put("unit", NCM_TABLE2_UNITS.getOrDefault(key, ""));
            row.put("requiredQty", required);
            row.put("actualQty", round2(actual));
            row.put("gap", round2(Math.max(0, required - actual)));
            row.put("achieved", achieved);
            row.put("isGroupLevel", true);
            row.put("evaluationMode", "GROUP_TABLE2");
            row.put("catalogCodes", getNcmTable2CatalogCodes(key));
            rows.add(row);
        }

        rows.add(evaluateSeminarPresentedRatio(activities));
        return rows;
    }

    /** Gắn kết quả đánh giá vào map ncmGroupQuotas trả về API. */
    public static Map<String, Object> buildNcmGroupQuotasWithEvaluation(
            List<GroupQuotaActivityProjection> activities, int memberCount) {
        Map<String, Object> quotas = new LinkedHashMap<>(getNcmGroupLevelQuotas(memberCount));
        quotas.put("sizeBandLabel", getSizeBandLabel((String) quotas.get("sizeBand")));

        List<Map<String, Object>> table2 = evaluateNcmTable2(activities, memberCount);
        quotas.put("table2Evaluation", table2);

        boolean allAchieved = table2.stream().allMatch(r -> Boolean.TRUE.equals(r.get("achieved")));
        quotas.put("table2OverallAchieved", allAchieved);
        quotas.put("table2AchievedCount", table2.stream().filter(r -> Boolean.TRUE.equals(r.get("achieved"))).count());
        quotas.put("table2TotalCount", table2.size());

        return quotas;
    }

    private static double round2(double v) {
        return Math.round(v * 100.0) / 100.0;
    }

    public static String getSizeBandLabel(String sizeBand) {
        if (sizeBand == null) return "";
        return switch (sizeBand) {
            case "UNDER_10" -> "Dưới 10 người";
            case "FROM_10_TO_20" -> "10–20 người";
            case "OVER_20" -> "Trên 20 người";
            default -> sizeBand;
        };
    }

    public static boolean isAchieved(double actualQty, Double requiredQty) {
        if (requiredQty == null) return true;
        if (requiredQty <= 0) return true;
        return actualQty >= requiredQty - 1e-9;
    }

    /**
     * Đóng góp vào quỹ nhóm: PA1 (NCM) và PA3 (Tinh hoa) nhân 0,8 so với số lượng chuẩn (equiv_qty).
     * VD: định mức chuẩn 10 → chỉ cộng 8 vào tổng nhóm.
     */
    public static double toGroupPoolQty(double standardEquivQty, String groupType) {
        if (standardEquivQty <= 0) return 0;
        return standardEquivQty * getMemberFactor(groupType);
    }

    /** Phần chia đều cho mỗi thành viên từ tổng nhóm (đã nhân hệ số PA). */
    public static double perMemberShare(double groupPoolTotalQty, int memberCount) {
        return groupPoolTotalQty / Math.max(1, memberCount);
    }

    /**
     * Đạt tiêu chí cá nhân trong nhóm khi phần chia đều ≥ định mức thành viên
     * (người không làm vẫn được tính nếu đồng đội gánh — "gánh team").
     */
    public static boolean isAchievedViaGroupShare(double groupPoolTotalQty, int memberCount, Double requiredQty) {
        if (requiredQty == null || requiredQty <= 0) return true;
        return isAchieved(perMemberShare(groupPoolTotalQty, memberCount), requiredQty);
    }

    /** Đạt bằng chính hoạt động của mình (không cần đồng đội gánh). */
    public static boolean isAchievedByOwnWork(double myPoolQty, Double requiredQty) {
        return isAchieved(myPoolQty, requiredQty);
    }

    /** Giờ nhóm hoàn thành cho một tiêu chí, chia đều cho mỗi thành viên. */
    public static double perMemberGroupHours(double groupCriterionHours, int memberCount) {
        return groupCriterionHours / Math.max(1, memberCount);
    }

    /**
     * Giờ cuối cùng để xét định mức (thành viên nhóm):
     * phần chia đều từ tổng nhóm + giờ cá nhân vượt ngoài tổng nhóm (nếu có).
     * Giờ đã nằm trong tổng nhóm không cộng chồng (vd. seminar 10h/4 TV = 2,5h, không phải 12,5h).
     */
    public static double creditedHoursForGroupMember(
            double myHours, double groupCriterionHours, int memberCount) {
        double perMember = perMemberGroupHours(groupCriterionHours, memberCount);
        double extraPersonal = Math.max(0, myHours - groupCriterionHours);
        return perMember + extraPersonal;
    }

    /** Tỷ lệ hoàn thành một chỉ tiêu nhóm (0–1). */
    public static double criterionCompletionRatio(double actualQty, Double requiredQty) {
        if (requiredQty == null || requiredQty <= 0) {
            return 1.0;
        }
        if (actualQty <= 0) {
            return 0.0;
        }
        return Math.min(1.0, actualQty / requiredQty);
    }

    /** % hoàn thành chung của nhóm = trung bình các chỉ tiêu (0–1). */
    public static double averageGroupCompletionPercent(List<Double> criterionRatios) {
        if (criterionRatios == null || criterionRatios.isEmpty()) {
            return 0.0;
        }
        double sum = 0;
        for (Double r : criterionRatios) {
            sum += r != null ? r : 0;
        }
        return sum / criterionRatios.size();
    }

    private static final double COMPLETION_EPS = 1e-9;

    /**
     * % thực tế — chỉ áp dụng quy tắc nhóm khi {@code groupPercent != null}
     * (user thuộc NCM / Xuất sắc / Tinh hoa). Không có nhóm → trả về % cá nhân.
     */
    public static double effectiveCompletionPercent(double personalPercent, Double groupPercent) {
        if (groupPercent == null) {
            return personalPercent;
        }
        if (groupPercent >= 100.0 - COMPLETION_EPS) {
            return 100.0;
        }
        return Math.min(personalPercent, groupPercent);
    }

    /** Không thuộc 3 nhóm định mức → chỉ xét % cá nhân ≥ 100%. */
    public static boolean isPlanOverallCompleted(double personalPercent, Double groupPercent) {
        if (groupPercent == null) {
            return personalPercent >= 100.0 - COMPLETION_EPS;
        }
        if (groupPercent >= 100.0 - COMPLETION_EPS) {
            return true;
        }
        return Math.min(personalPercent, groupPercent) >= 100.0 - COMPLETION_EPS;
    }
}
