package com.example.server.service.nckh;

import java.util.*;

import org.springframework.stereotype.Service;

import com.example.server.DTO.nckh.GroupQuotaActivityProjection;
import com.example.server.domain.ResearchGroup;
import com.example.server.domain.User;
import com.example.server.repository.UserRepository;
import com.example.server.repository.nckh.NckhActivityRepository;
import com.example.server.service.researchgroup.ResearchGroupQuotaService;

@Service
public class NckhGroupQuotaAggregationService {

    private final NckhActivityRepository activityRepo;
    private final NckhComputeService computeService;
    private final UserRepository userRepo;

    public NckhGroupQuotaAggregationService(
            NckhActivityRepository activityRepo,
            NckhComputeService computeService,
            UserRepository userRepo) {
        this.activityRepo = activityRepo;
        this.computeService = computeService;
        this.userRepo = userRepo;
    }

    /**
     * Tổng hợp định mức nhóm từ hoạt động APPROVED.
     * - Đóng góp vào nhóm: equiv_qty × hệ số PA (0,8 với NCM/Tinh hoa).
     * - Giờ cá nhân (TV nhóm): chia đều tổng nhóm + phần vượt (không cộng chồng giờ trong tổng).
     * - % hoàn thành nhóm: trung bình tiến độ các chỉ tiêu.
     * - Đánh giá SL: chia đều ≥ định mức hoặc tự làm đủ.
     */
    public Map<String, Object> buildMemberStats(
            ResearchGroup group,
            User currentUser,
            List<Integer> memberIds,
            int academicYear,
            List<Map<String, Object>> criteriaDefinitions) {

        String groupType = group.getGroupType();
        boolean isLeader = group.isLeader(currentUser);
        String chucDanh = currentUser.getIdTitle() != null ? currentUser.getIdTitle().getName() : "KS/CN";
        int memberCount = Math.max(1, memberIds.size());
        int userId = currentUser.getId();
        double memberFactor = NckhGroupQuotaRules.getMemberFactor(groupType);

        List<GroupQuotaActivityProjection> myActivities =
                activityRepo.findApprovedActivitiesForUser(userId, academicYear);
        List<GroupQuotaActivityProjection> groupActivities =
                activityRepo.findApprovedActivitiesForUsers(memberIds, academicYear);

        Map<String, Double> groupPoolByCatalog = buildPoolQtyMap(groupActivities, groupType);
        Map<String, Double> myPoolByCatalog = buildPoolQtyMap(myActivities, groupType);
        Map<String, Double> myRawByCatalog = buildRawQtyMap(myActivities);

        Map<Integer, String> userNames = loadUserNames(groupActivities);

        List<Map<String, Object>> criteriaStats = new ArrayList<>();
        List<Map<String, Object>> personalEvaluation = new ArrayList<>();
        List<Map<String, Object>> activityBreakdown = new ArrayList<>();

        List<Double> groupCompletionRatios = new ArrayList<>();
        boolean allPersonalAchieved = true;
        int evaluatedCount = 0;
        int achievedCount = 0;

        Map<String, Double> myHoursByCatalog = buildHoursByCatalog(myActivities);
        Map<String, Double> groupHoursByCatalog = buildHoursByCatalog(groupActivities);
        double myCreditedTotalHours = isLeader
                ? 0
                : computeCreditedTotalHours(myHoursByCatalog, groupHoursByCatalog, memberCount);

        for (GroupQuotaActivityProjection act : myActivities) {
            activityBreakdown.add(toActivityMap(act, groupType, chucDanh, isLeader, userNames, memberFactor));
        }

        for (Map<String, Object> c : criteriaDefinitions) {
            String code = (String) c.get("code");
            boolean isGroupLevel = Boolean.TRUE.equals(c.get("isGroupLevel"));

            double groupPoolTotal = sumForCriterion(groupPoolByCatalog, code);
            double myPoolQty = sumForCriterion(myPoolByCatalog, code);
            double myRawQty = sumForCriterion(myRawByCatalog, code);
            double perMemberQty = NckhGroupQuotaRules.perMemberShare(groupPoolTotal, memberCount);

            double myHours = sumHoursShareForCriterion(myActivities, code);
            double groupCriterionHours = sumHoursShareForCriterion(groupActivities, code);
            double perMemberHours = NckhGroupQuotaRules.perMemberGroupHours(groupCriterionHours, memberCount);
            double myCreditedHours = NckhGroupQuotaRules.creditedHoursForGroupMember(
                    myHours, groupCriterionHours, memberCount);

            Map<String, Object> row = new LinkedHashMap<>();
            row.put("code", code);
            row.put("name", c.get("name"));
            row.put("unit", c.get("unit"));
            row.put("isGroupLevel", isGroupLevel);
            row.put("memberFactor", memberFactor);
            row.put("groupTotalQty", round2(groupPoolTotal));
            row.put("groupTotalRawQty", round2(sumRawForCriterion(groupActivities, code)));
            row.put("groupTotalHours", round2(groupCriterionHours));
            row.put("perMemberQty", round2(perMemberQty));
            row.put("perMemberHours", round2(perMemberHours));
            row.put("groupHoursCredit", round2(perMemberHours));
            row.put("myQty", round2(myRawQty));
            row.put("myPoolQty", round2(myPoolQty));
            row.put("myCreditedQty", round2(perMemberQty));
            row.put("myHours", round2(myHours));
            row.put("myCreditedHours", round2(myCreditedHours));
            row.put("myGroupQuotaHours", round2(myCreditedHours));
            row.put("memberCount", memberCount);

            if (isGroupLevel && "NCM".equals(NckhGroupQuotaRules.resolveGroupKind(groupType))) {
                if ("SEMINAR_THAM_DU".equals(code)) {
                    Map<String, Object> seminar = NckhGroupQuotaRules.evaluateSeminarPresentedRatio(groupActivities);
                    row.put("groupTotalQty", seminar.get("presentedQty"));
                    row.put("requiredLabel", seminar.get("requiredLabel"));
                    row.put("actualRatio", seminar.get("actualRatio"));
                    row.put("achievedViaShare", seminar.get("achieved"));
                } else {
                    double actualRaw = NckhGroupQuotaRules.sumActualQty(groupActivities, code);
                    Double groupReq = NckhGroupQuotaRules.getNcmGroupRequired(code, memberCount);
                    row.put("groupTotalQty", round2(actualRaw));
                    row.put("groupTotalRawQty", round2(actualRaw));
                    row.put("requiredQty", groupReq);
                    row.put("achievedViaShare", groupReq != null
                            && NckhGroupQuotaRules.isAchieved(actualRaw, groupReq));
                }
            }

            Double memberRequired = (!isGroupLevel && !isLeader)
                    ? computeService.getMemberRequiredQty(groupType, code, chucDanh, false)
                    : null;
            row.put("requiredQty", memberRequired);
            row.put("achievedViaShare", memberRequired != null && memberRequired > 0
                    && NckhGroupQuotaRules.isAchievedViaGroupShare(groupPoolTotal, memberCount, memberRequired));

            if (memberRequired != null && memberRequired > 0) {
                double critRatio = NckhGroupQuotaRules.criterionCompletionRatio(perMemberQty, memberRequired);
                row.put("criterionCompletionPercent", round2(critRatio * 100));
            }

            criteriaStats.add(row);

            if (!isGroupLevel && !isLeader && memberRequired != null && memberRequired > 0) {
                groupCompletionRatios.add(
                        NckhGroupQuotaRules.criterionCompletionRatio(perMemberQty, memberRequired));
            } else if (isGroupLevel && "NCM".equals(NckhGroupQuotaRules.resolveGroupKind(groupType))) {
                appendNcmGroupLevelCompletionRatio(groupCompletionRatios, code, groupActivities, memberCount);
            }

            if (!isGroupLevel && !isLeader) {
                Double requiredQty = memberRequired;
                if (requiredQty != null && requiredQty > 0) {
                    evaluatedCount++;
                    boolean achievedViaShare = NckhGroupQuotaRules.isAchievedViaGroupShare(
                            groupPoolTotal, memberCount, requiredQty);
                    boolean achievedByOwn = NckhGroupQuotaRules.isAchievedByOwnWork(myPoolQty, requiredQty);
                    boolean achieved = achievedViaShare;
                    if (achieved) achievedCount++;
                    else allPersonalAchieved = false;

                    boolean carriedByTeam = achievedViaShare && !achievedByOwn;

                    Map<String, Object> evalRow = new LinkedHashMap<>();
                    evalRow.put("code", code);
                    evalRow.put("name", c.get("name"));
                    evalRow.put("unit", c.get("unit"));
                    evalRow.put("requiredQty", requiredQty);
                    evalRow.put("myQty", round2(myRawQty));
                    evalRow.put("myPoolQty", round2(myPoolQty));
                    evalRow.put("perMemberQty", round2(perMemberQty));
                    evalRow.put("groupTotalQty", round2(groupPoolTotal));
                    evalRow.put("actualQty", round2(perMemberQty));
                    evalRow.put("myHours", round2(myHours));
                    evalRow.put("groupHoursCredit", round2(perMemberHours));
                    evalRow.put("myCreditedHours", round2(myCreditedHours));
                    evalRow.put("actualHours", round2(myCreditedHours));
                    evalRow.put("achieved", achieved);
                    evalRow.put("achievedByOwn", achievedByOwn);
                    evalRow.put("carriedByTeam", carriedByTeam);
                    evalRow.put("gap", round2(Math.max(0, requiredQty - perMemberQty)));
                    evalRow.put("evaluationMode", "GROUP_SHARE");
                    evalRow.put("activities", filterActivityMaps(activityBreakdown, code));
                    personalEvaluation.add(evalRow);
                }
            } else if (isGroupLevel) {
                appendGroupLevelEvaluation(
                        personalEvaluation, c, code, group, memberCount,
                        groupActivities, groupPoolTotal, perMemberQty);
            }
        }

        Map<String, Object> ncmGroupQuotas = null;
        if ("NCM".equals(NckhGroupQuotaRules.resolveGroupKind(groupType))) {
            ncmGroupQuotas = NckhGroupQuotaRules.buildNcmGroupQuotasWithEvaluation(groupActivities, memberCount);
            appendTable2CompletionRatios(groupCompletionRatios, ncmGroupQuotas);
        }
        double groupCompletionPercent = NckhGroupQuotaRules.averageGroupCompletionPercent(groupCompletionRatios);
        double groupPctDisplay = round2(groupCompletionPercent * 100);
        for (Map<String, Object> row : criteriaStats) {
            row.put("groupCompletionPercent", groupPctDisplay);
        }
        for (Map<String, Object> evalRow : personalEvaluation) {
            evalRow.put("groupCompletionPercent", groupPctDisplay);
        }

        Map<String, Object> data = new LinkedHashMap<>();
        data.put("groupId", group.getId());
        data.put("groupName", group.getGroupName());
        data.put("groupType", groupType);
        data.put("memberCount", memberCount);
        data.put("academicYear", academicYear);
        data.put("isLeader", isLeader);
        data.put("chucDanh", chucDanh);
        data.put("memberFactor", memberFactor);
        data.put("autoCalculated", true);
        data.put("dataSource", "APPROVED_ACTIVITIES");
        data.put("evaluationRule", "GROUP_EQUAL_SHARE_HOURS_AND_COMPLETION_PERCENT");
        data.put("groupCompletionPercent", round2(groupCompletionPercent * 100));
        data.put("groupCompletionCriteriaCount", groupCompletionRatios.size());
        double totalGroupQuotaHours = sumHoursShare(groupActivities);
        double myTotalHours = sumHoursShare(myActivities);
        data.put("totalGroupHours", round2(totalGroupQuotaHours));
        data.put("totalPerMemberHours", round2(NckhGroupQuotaRules.perMemberGroupHours(totalGroupQuotaHours, memberCount)));
        data.put("myTotalHours", round2(myTotalHours));
        data.put("myCreditedTotalHours", round2(myCreditedTotalHours));
        data.put("myGroupQuotaHours", round2(myCreditedTotalHours));
        data.put("criteria", criteriaStats);
        data.put("personalEvaluation", personalEvaluation);
        data.put("activities", activityBreakdown);
        data.put("overallAchieved", isLeader || (evaluatedCount > 0 && allPersonalAchieved));
        data.put("achievedCount", achievedCount);
        data.put("evaluatedCount", evaluatedCount);

        if (ncmGroupQuotas != null) {
            ncmGroupQuotas.put("groupCompletionPercent", round2(groupCompletionPercent * 100));
            data.put("ncmGroupQuotas", ncmGroupQuotas);
        }

        return data;
    }

    private static void appendNcmGroupLevelCompletionRatio(
            List<Double> ratios, String code, List<GroupQuotaActivityProjection> activities, int memberCount) {
        if ("SEMINAR_THAM_DU".equals(code)) {
            Map<String, Object> seminar = NckhGroupQuotaRules.evaluateSeminarPresentedRatio(activities);
            Object ratio = seminar.get("actualRatio");
            if (ratio instanceof Number n) {
                ratios.add(Math.min(1.0, n.doubleValue() / NckhGroupQuotaRules.NCM_SEMINAR_PRESENTED_RATIO));
            }
            return;
        }
        Double req = NckhGroupQuotaRules.getNcmGroupRequired(code, memberCount);
        if (req != null && req > 0) {
            double actual = NckhGroupQuotaRules.sumActualQty(activities, code);
            ratios.add(NckhGroupQuotaRules.criterionCompletionRatio(actual, req));
        }
    }

    @SuppressWarnings("unchecked")
    private static void appendTable2CompletionRatios(List<Double> ratios, Map<String, Object> ncmQuotas) {
        Object table2 = ncmQuotas.get("table2Evaluation");
        if (!(table2 instanceof List<?> list)) {
            return;
        }
        for (Object item : list) {
            if (!(item instanceof Map<?, ?> row)) continue;
            Map<String, Object> m = (Map<String, Object>) row;
            if ("SEMINAR_TRINH_BAY_RATIO".equals(m.get("code"))) {
                Object ar = m.get("actualRatio");
                if (ar instanceof Number n) {
                    ratios.add(Math.min(1.0, n.doubleValue() / NckhGroupQuotaRules.NCM_SEMINAR_PRESENTED_RATIO));
                }
            } else {
                Object actual = m.get("actualQty");
                Object required = m.get("requiredQty");
                if (actual instanceof Number a && required instanceof Number r && r.doubleValue() > 0) {
                    ratios.add(NckhGroupQuotaRules.criterionCompletionRatio(a.doubleValue(), r.doubleValue()));
                }
            }
        }
    }

    private void appendGroupLevelEvaluation(
            List<Map<String, Object>> personalEvaluation,
            Map<String, Object> crit,
            String code,
            ResearchGroup group,
            int memberCount,
            List<GroupQuotaActivityProjection> groupActivities,
            double groupPoolTotal,
            double perMemberQty) {

        if (!"NCM".equals(NckhGroupQuotaRules.resolveGroupKind(group.getGroupType()))) {
            return;
        }

        if ("SEMINAR_THAM_DU".equals(code)) {
            Map<String, Object> seminarRow = NckhGroupQuotaRules.evaluateSeminarPresentedRatio(groupActivities);
            Map<String, Object> evalRow = new LinkedHashMap<>(seminarRow);
            evalRow.put("name", crit.get("name"));
            evalRow.put("unit", crit.get("unit"));
            evalRow.put("groupTotalQty", seminarRow.get("presentedQty"));
            evalRow.put("perMemberQty", round2(perMemberQty));
            evalRow.put("carriedByTeam", true);
            personalEvaluation.add(evalRow);
            return;
        }

        Double groupRequired = NckhGroupQuotaRules.getNcmGroupRequired(code, memberCount);
        if (groupRequired == null) return;

        double actualRaw = NckhGroupQuotaRules.sumActualQty(groupActivities, code);
        boolean groupMet = NckhGroupQuotaRules.isAchieved(actualRaw, groupRequired);

        Map<String, Object> evalRow = new LinkedHashMap<>();
        evalRow.put("code", code);
        evalRow.put("name", crit.get("name"));
        evalRow.put("unit", crit.get("unit"));
        evalRow.put("requiredQty", groupRequired);
        evalRow.put("actualQty", round2(actualRaw));
        evalRow.put("groupTotalQty", round2(actualRaw));
        evalRow.put("groupPoolTotalQty", round2(groupPoolTotal));
        evalRow.put("perMemberQty", round2(perMemberQty));
        evalRow.put("gap", round2(Math.max(0, groupRequired - actualRaw)));
        evalRow.put("achieved", groupMet);
        evalRow.put("carriedByTeam", true);
        evalRow.put("evaluationMode", "GROUP_TABLE2");
        evalRow.put("isGroupLevel", true);
        evalRow.put("catalogCodes", NckhGroupQuotaRules.getNcmTable2CatalogCodes(code));
        personalEvaluation.add(evalRow);
    }

    private Map<String, Double> buildPoolQtyMap(List<GroupQuotaActivityProjection> activities, String groupType) {
        Map<String, Double> map = new LinkedHashMap<>();
        for (GroupQuotaActivityProjection act : activities) {
            String code = act.getCatalogCode();
            double pool = poolQtyFromActivity(act, groupType);
            map.merge(code, pool, Double::sum);
        }
        return map;
    }

    private Map<String, Double> buildRawQtyMap(List<GroupQuotaActivityProjection> activities) {
        Map<String, Double> map = new LinkedHashMap<>();
        for (GroupQuotaActivityProjection act : activities) {
            double raw = act.getEquivQty() != null ? act.getEquivQty() : 0;
            map.merge(act.getCatalogCode(), raw, Double::sum);
        }
        return map;
    }

    private double poolQtyFromActivity(GroupQuotaActivityProjection act, String groupType) {
        double raw = act.getEquivQty() != null ? act.getEquivQty() : 0;
        return NckhGroupQuotaRules.toGroupPoolQty(raw, groupType);
    }

    private double sumRawForCriterion(List<GroupQuotaActivityProjection> activities, String criterionCode) {
        Set<String> codes = new HashSet<>(ResearchGroupQuotaService.catalogCodesForCriterion(criterionCode));
        double sum = 0;
        for (GroupQuotaActivityProjection act : activities) {
            if (codes.contains(act.getCatalogCode())) {
                sum += act.getEquivQty() != null ? act.getEquivQty() : 0;
            }
        }
        return sum;
    }

    /** Giờ quy đổi thực tế từ bảng contributor (hours_share), không nhân hệ số định mức số lượng. */
    private static double hoursFromActivity(GroupQuotaActivityProjection act) {
        return act.getHoursShare() != null ? act.getHoursShare() : 0;
    }

    private static double sumHoursShare(List<GroupQuotaActivityProjection> activities) {
        if (activities == null) return 0;
        double sum = 0;
        for (GroupQuotaActivityProjection act : activities) {
            sum += hoursFromActivity(act);
        }
        return sum;
    }

    /** Gom giờ theo catalog — mỗi hoạt động chỉ tính một lần (tránh cộng trùng qua nhiều tiêu chí). */
    private static Map<String, Double> buildHoursByCatalog(List<GroupQuotaActivityProjection> activities) {
        Map<String, Double> map = new LinkedHashMap<>();
        if (activities == null) return map;
        for (GroupQuotaActivityProjection act : activities) {
            if (act.getCatalogCode() == null) continue;
            map.merge(act.getCatalogCode(), hoursFromActivity(act), Double::sum);
        }
        return map;
    }

    private static double computeCreditedTotalHours(
            Map<String, Double> myHoursByCatalog,
            Map<String, Double> groupHoursByCatalog,
            int memberCount) {
        Set<String> catalogs = new HashSet<>();
        catalogs.addAll(myHoursByCatalog.keySet());
        catalogs.addAll(groupHoursByCatalog.keySet());
        double total = 0;
        for (String catalog : catalogs) {
            double myH = myHoursByCatalog.getOrDefault(catalog, 0.0);
            double groupH = groupHoursByCatalog.getOrDefault(catalog, 0.0);
            total += NckhGroupQuotaRules.creditedHoursForGroupMember(myH, groupH, memberCount);
        }
        return total;
    }

    private static double sumHoursShareForCriterion(
            List<GroupQuotaActivityProjection> activities, String criterionCode) {
        Set<String> codes = new HashSet<>(ResearchGroupQuotaService.catalogCodesForCriterion(criterionCode));
        double sum = 0;
        for (GroupQuotaActivityProjection act : activities) {
            if (act.getCatalogCode() != null && codes.contains(act.getCatalogCode())) {
                sum += hoursFromActivity(act);
            }
        }
        return sum;
    }

    private List<Map<String, Object>> filterActivityMaps(List<Map<String, Object>> activities, String criterionCode) {
        Set<String> codes = new HashSet<>(ResearchGroupQuotaService.catalogCodesForCriterion(criterionCode));
        return activities.stream()
                .filter(a -> codes.contains(a.get("catalogCode")))
                .toList();
    }

    private Map<String, Object> toActivityMap(
            GroupQuotaActivityProjection act,
            String groupType,
            String chucDanh,
            boolean isLeader,
            Map<Integer, String> userNames,
            double memberFactor) {
        double rawQty = act.getEquivQty() != null ? act.getEquivQty() : 0;
        double poolQty = NckhGroupQuotaRules.toGroupPoolQty(rawQty, groupType);
        double convertedHours = hoursFromActivity(act);

        Map<String, Object> m = new LinkedHashMap<>();
        m.put("activityId", act.getActivityId());
        m.put("title", act.getTitle());
        m.put("catalogCode", act.getCatalogCode());
        m.put("catalogName", act.getCatalogName());
        m.put("unit", act.getUnit());
        m.put("equivQty", round2(rawQty));
        m.put("poolQty", round2(poolQty));
        m.put("memberFactor", memberFactor);
        m.put("hoursShare", round2(convertedHours));
        m.put("groupQuotaHours", round2(convertedHours));
        m.put("userId", act.getUserId());
        m.put("userName", userNames.getOrDefault(act.getUserId(), ""));
        m.put("activityDate", act.getActivityDate() != null ? act.getActivityDate().toString() : null);
        return m;
    }

    private Map<Integer, String> loadUserNames(List<GroupQuotaActivityProjection> activities) {
        Set<Integer> ids = new HashSet<>();
        for (GroupQuotaActivityProjection a : activities) {
            if (a.getUserId() != null) ids.add(a.getUserId());
        }
        Map<Integer, String> map = new HashMap<>();
        if (!ids.isEmpty()) {
            userRepo.findAllById(ids).forEach(u -> map.put(u.getId(), u.getName()));
        }
        return map;
    }

    private double sumForCriterion(Map<String, Double> qtyByCatalog, String criterionCode) {
        return ResearchGroupQuotaService.sumQtyForCriterion(qtyByCatalog, criterionCode);
    }

    private static double round2(double v) {
        return Math.round(v * 100.0) / 100.0;
    }
}
