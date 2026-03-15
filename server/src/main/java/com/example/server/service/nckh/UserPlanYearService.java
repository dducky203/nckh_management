package com.example.server.service.nckh;

import com.example.server.domain.nckh.UserPlanYear;
import com.example.server.exception.GlobalExceptionHandler;
import com.example.server.repository.UserRepository;
import com.example.server.repository.nckh.UserPlanYearRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
public class UserPlanYearService {

    @Autowired
    private UserPlanYearRepository repo;
    @Autowired
    private UserRepository userRepository;

    public UserPlanYear getPlanCurrent(Integer userId, Integer year) {

        if (!userRepository.existsById(userId)) {
            return null;
        }
        return repo.findByUserIdAndAcademicYear(userId, year)
                .orElse(null);
    }

    @Transactional
    public UserPlanYear selectAndLock(Integer userId, Integer planId,  Integer year) {
        if(year == null)  year = LocalDate.now().getYear();
        if (repo.existsByUserIdAndAcademicYear(userId, year)) {
            throw new IllegalStateException("Bạn đã chọn phương án cho năm này và đã bị khóa.");
        }

        UserPlanYear row = new UserPlanYear();
        row.setUserId(userId);
        row.setAcademicYear(year);
        row.setPlanId(planId);
        row.setIsLocked(true);
        row.setSelectedAt(LocalDateTime.now());
        row.setLockedAt(LocalDateTime.now());
        row.setLockedBy(userId);

        return repo.save(row);
    }

    @Transactional
    public UserPlanYear adminOverride(Integer adminId, Integer userId, Integer year, Integer planId, String reason) {
        UserPlanYear row = repo.findByUserIdAndAcademicYear(userId, year)
                .orElseThrow(() -> new IllegalStateException("Người dùng chưa chọn phương án năm này."));
        row.setPlanId(planId);
        row.setLockedBy(adminId);
        row.setAdminOverrideReason(reason);
        return repo.save(row);
    }
}
