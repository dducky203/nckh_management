package com.example.server.repository.nckh;

import com.example.server.domain.nckh.NckhActivity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NckhActivityRepository extends JpaRepository<NckhActivity, Long> {
    List<NckhActivity> findByCreatedByUserIdAndAcademicYear(Integer userId, Integer year);
}
