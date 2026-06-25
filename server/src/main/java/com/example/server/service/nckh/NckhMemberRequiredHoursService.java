package com.example.server.service.nckh;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.server.domain.ResearchGroup;
import com.example.server.domain.ResearchGroupMember;
import com.example.server.domain.User;
import com.example.server.domain.nckh.UserPlanYear;
import com.example.server.repository.UserRepository;
import com.example.server.repository.nckh.NckhTieuChiDinhMucRepository;
import com.example.server.repository.nckh.UserPlanYearRepository;
import com.example.server.utils.PlanSelectionWindowUtil;

/**
 * Tổng giờ định mức cá nhân theo phương án đã chọn (hoặc PA1 mặc định) — dùng tính định mức chuẩn nhóm.
 */
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

    /** Thành viên bảng + trưởng nhóm (không trùng, bỏ null). */
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

    /** Tổng giờ yêu cầu = Σ định mức từng TV (PA đã chọn + chức danh). */
    public double sumRequiredHoursForMembers(List<Integer> memberIds, int academicYear) {
        if (memberIds == null || memberIds.isEmpty()) {
            return 0;
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

        double total = 0;
        for (Integer memberId : memberIds) {
            User user = usersById.get(memberId);
            if (user == null) {
                continue;
            }
            int planId = planByUserId.getOrDefault(memberId, PlanSelectionWindowUtil.DEFAULT_PLAN_ID);
            String chucDanhEnum = NckhChucDanhUtils.toEnumKey(
                    user.getIdTitle() != null ? user.getIdTitle().getName() : null);
            BigDecimal req = dinhMucRepo.sumTongGioByPhuongAnAndChucDanh(planId, chucDanhEnum, yearStr);
            if (req != null) {
                total += req.doubleValue();
            }
        }
        return total;
    }

    public double requiredHoursForUser(int userId, int academicYear) {
        return sumRequiredHoursForMembers(List.of(userId), academicYear);
    }
}
