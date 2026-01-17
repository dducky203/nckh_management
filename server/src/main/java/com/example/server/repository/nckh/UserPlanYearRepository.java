package com.example.server.repository.nckh;

import com.example.server.domain.nckh.UserPlanYear;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserPlanYearRepository extends JpaRepository<UserPlanYear, Long> {
    Optional<UserPlanYear> findByUserIdAndAcademicYear(Integer userId, Integer academicYear);

    boolean existsByUserIdAndAcademicYear(Integer userId, Integer academicYear);
}
