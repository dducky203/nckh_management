package com.example.server.service.nckh;

import com.example.server.domain.nckh.UserPlanYear;
import com.example.server.repository.nckh.UserPlanYearRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class UserPlanYearService {

    private final UserPlanYearRepository repo;

    public UserPlanYearService(UserPlanYearRepository repo) {
        this.repo = repo;
    }

    public UserPlanYear getOrNull(Integer userId, Integer year) {
        return repo.findByUserIdAndAcademicYear(userId, year).orElse(null);
    }

    @Transactional
    public UserPlanYear selectAndLock(Integer userId, Integer year, String planCode) {
        if (repo.existsByUserIdAndAcademicYear(userId, year)) {
            throw new IllegalStateException("Bạn đã chọn phương án cho năm này và đã bị khóa.");
        }

        UserPlanYear row = new UserPlanYear();
        row.setUserId(userId);
        row.setAcademicYear(year);
        row.setPlanCode(UserPlanYear.PlanCode.valueOf(planCode));
        row.setIsLocked(true);
        row.setSelectedAt(LocalDateTime.now());
        row.setLockedAt(LocalDateTime.now());
        row.setLockedBy(userId);

        return repo.save(row);
    }

    @Transactional
    public UserPlanYear adminOverride(Integer adminId, Integer userId, Integer year, String planCode, String reason) {
        UserPlanYear row = repo.findByUserIdAndAcademicYear(userId, year)
                .orElseThrow(() -> new IllegalStateException("Người dùng chưa chọn phương án năm này."));
        row.setPlanCode(UserPlanYear.PlanCode.valueOf(planCode));
        row.setUpdatedBy(adminId);
        row.setAdminOverrideReason(reason);
        return repo.save(row);
    }
}
