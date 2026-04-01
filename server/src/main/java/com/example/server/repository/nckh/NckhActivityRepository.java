package com.example.server.repository.nckh;

import com.example.server.DTO.nckh.ActivityStatisticsResponse;
import com.example.server.domain.nckh.NckhActivity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NckhActivityRepository extends JpaRepository<NckhActivity, Long> {
    List<NckhActivity> findByCreatedByUserIdAndAcademicYear(Integer userId, Integer year);

    List<NckhActivity> findByAcademicYear(Integer year);

    @Query(value = "SELECT " +
            "a.catalog_code AS catalogCode, " +
            "cat.tieu_chi_name AS catalogName, " +
            "cat.don_vi_tinh AS unit, " +
            "COUNT(DISTINCT a.id) AS participationCount, " +
            "COALESCE(ROUND(COALESCE(SUM(b.hours_share), 0) / NULLIF(MAX(cat.gio_quy_doi_per_unit), 0), 2), 0) AS totalQty, " +
            "SUM(b.hours_share) AS totalQuotaHours, " +
            "AVG(b.participants_n) AS avgParticipantsN " +
            "FROM nckh_activity a " +
            "INNER JOIN nckh_activity_contributor b ON a.id = b.activity_id " +
            "INNER JOIN nckh_tieu_chi_dinh_muc cat ON a.catalog_code = cat.tieu_chi_code " +
            "WHERE b.user_id = :userId " +
            "AND a.academic_year = :academicYear " +
            "AND cat.phuong_an = :phuongAn " +
            "AND cat.chuc_danh = :chucDanh " +
            "AND a.status = 'APPROVED' " +
            "GROUP BY a.catalog_code, cat.tieu_chi_name, cat.don_vi_tinh, cat.phuong_an, cat.chuc_danh " +
            "ORDER BY a.catalog_code",
            nativeQuery = true)
    List<ActivityStatisticsResponse> getStatisticsByUserAndYear(
            @Param("userId") Integer userId,
            @Param("academicYear") Integer academicYear,
            @Param("phuongAn") Integer phuongAn,
            @Param("chucDanh") String chucDanh);
}
