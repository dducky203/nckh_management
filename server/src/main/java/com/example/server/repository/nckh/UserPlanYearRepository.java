package com.example.server.repository.nckh;

import com.example.server.domain.nckh.UserPlanYear;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserPlanYearRepository extends JpaRepository<UserPlanYear, Long> {

    Optional<UserPlanYear> findByUserIdAndAcademicYear(Integer userId, Integer academicYear);

    List<UserPlanYear> findByAcademicYear(Integer academicYear);

    boolean existsByUserIdAndAcademicYear(Integer userId, Integer academicYear);

    /** Lấy userId của những user đã chọn PA trong năm cho trước. */
    @Query("SELECT u.userId FROM UserPlanYear u WHERE u.academicYear = :year")
    List<Integer> findUserIdsByAcademicYear(@Param("year") Integer year);
}
