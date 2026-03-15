package com.example.server.repository.nckh;

import com.example.server.domain.nckh.NckhActivity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NckhActivityRepository extends JpaRepository<NckhActivity, Long> {
    List<NckhActivity> findByCreatedByUserIdAndAcademicYear(Integer userId, Integer year);

    List<NckhActivity> findByAcademicYear(Integer year);
}
