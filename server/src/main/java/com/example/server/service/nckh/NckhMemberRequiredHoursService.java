package com.example.server.service.nckh;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.server.domain.ResearchGroup;
import com.example.server.domain.ResearchGroupMember;
import com.example.server.domain.User;
import com.example.server.domain.nckh.NckhTieuChiDinhMuc;
import com.example.server.domain.nckh.UserPlanYear;
import com.example.server.repository.UserRepository;
import com.example.server.repository.nckh.NckhTieuChiDinhMucRepository;
import com.example.server.repository.nckh.UserPlanYearRepository;
import com.example.server.utils.PlanSelectionWindowUtil;

@Service
public class NckhMemberRequiredHoursService {

    private final UserRepository userRepo;
    private final UserPlanYearRepository planYearRepo;
    private final NckhTieuChiDinhMucRepository dinhMucRepo;

    public NckhMemberRequiredHoursService(
            UserRepository userRepo,
            UserPlanYearRepository planYearRepo,
            NckhTieuChiDinhMucRepository dinhMucRepo) {
        this.userRepo = userRepo;
        this.planYearRepo = planYearRepo;
        this.dinhMucRepo = dinhMucRepo;
    }

    public List<Integer> collectQuotaMemberUserIds(ResearchGroup group, List<ResearchGroupMember> members) {
        LinkedHashSet<Integer> ids = new LinkedHashSet<>();
        if (members != null) {
            for (ResearchGroupMember m : members) {
                if (m.getUserId() != null) {
                    ids.add(m.getUserId());
                }
            }
        }
        if (group != null && group.getLeader() != null && group.getLeader().getId() != null) {
            ids.add(group.getLeader().getId());
        }
        return new ArrayList<>(ids);
    }

    public double sumRequiredHoursForMembers(List<Integer> memberIds, int academicYear) {
        return requiredQuotasForMembers(memberIds, academicYear).values().stream()
                .mapToDouble(MemberRequiredQuota::totalRequiredHours)
                .sum();
    }

    public Map<Integer, MemberRequiredQuota> requiredQuotasForMembers(List<Integer> memberIds, int academicYear) {
        Map<Integer, MemberRequiredQuota> result = new LinkedHashMap<>();
        if (memberIds == null || memberIds.isEmpty()) {
            return result;
        }
        String yearStr = String.valueOf(academicYear);

        Map<Integer, User> usersById = new HashMap<>();
        for (User u : userRepo.findAllById(memberIds)) {
            usersById.put(u.getId(), u);
        }

        Map<Integer, Integer> planByUserId = planYearRepo.findByAcademicYear(academicYear).stream()
                .collect(Collectors.toMap(
                        UserPlanYear::getUserId,
                        UserPlanYear::getPlanId,
                        (left, right) -> left));

        Map<String, List<NckhTieuChiDinhMuc>> criteriaCache = new HashMap<>();
        for (Integer memberId : memberIds) {
            User user = usersById.get(memberId);
            if (user == null) {
                continue;
            }
            int planId = planByUserId.getOrDefault(memberId, PlanSelectionWindowUtil.DEFAULT_PLAN_ID);
            String chucDanhEnum = NckhChucDanhUtils.toEnumKey(
                    user.getIdTitle() != null ? user.getIdTitle().getName() : null);

            String cacheKey = planId + "|" + chucDanhEnum;
            List<NckhTieuChiDinhMuc> rows = criteriaCache.computeIfAbsent(cacheKey,
                    ignored -> dinhMucRepo.findByPhuongAnAndChucDanh(planId, chucDanhEnum, yearStr));

            Map<String, CriterionRequirement> criteria = new LinkedHashMap<>();
            double totalRequiredHours = 0;
            for (NckhTieuChiDinhMuc row : rows) {
                if (row.getTieuChiCode() == null || row.getTieuChiCode().isBlank()) {
                    continue;
                }
                double requiredQty = decimalValue(row.getDinhMucToiThieu());
                double hoursPerUnit = decimalValue(row.getGioQuyDoiPerUnit());
                double requiredHours = row.getTongGioToiThieu() != null
                        ? row.getTongGioToiThieu().doubleValue()
                        : requiredQty * hoursPerUnit;
                totalRequiredHours += requiredHours;

                CriterionRequirement requirement = new CriterionRequirement(
                        requiredQty,
                        hoursPerUnit,
                        requiredHours,
                        row.getTieuChiName(),
                        row.getDonViTinh());
                criteria.merge(row.getTieuChiCode(), requirement, CriterionRequirement::plus);
            }
            result.put(memberId, new MemberRequiredQuota(
                    memberId,
                    planId,
                    chucDanhEnum,
                    criteria,
                    totalRequiredHours));
        }
        return result;
    }

    public double requiredHoursForUser(int userId, int academicYear) {
        return sumRequiredHoursForMembers(List.of(userId), academicYear);
    }

    private static double decimalValue(java.math.BigDecimal value) {
        return value != null ? value.doubleValue() : 0;
    }

    public record CriterionRequirement(
            double requiredQty,
            double hoursPerUnit,
            double requiredHours,
            String name,
            String unit) {

        CriterionRequirement plus(CriterionRequirement other) {
            return new CriterionRequirement(
                    requiredQty + other.requiredQty,
                    hoursPerUnit != 0 ? hoursPerUnit : other.hoursPerUnit,
                    requiredHours + other.requiredHours,
                    name != null ? name : other.name,
                    unit != null ? unit : other.unit);
        }
    }

    public record MemberRequiredQuota(
            int userId,
            int planId,
            String chucDanh,
            Map<String, CriterionRequirement> criteria,
            double totalRequiredHours) {
    }
}
