package com.example.server.repository.nckh;

import com.example.server.domain.nckh.NckhTieuChiDinhMuc;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface NckhTieuChiDinhMucRepository extends JpaRepository<NckhTieuChiDinhMuc, Long> {

    @Query(value = "SELECT * FROM nckh_tieu_chi_dinh_muc " +
            "WHERE phuong_an = :phuongAn " +
            "AND chuc_danh = :chucDanh " +
            "AND year = :year " +
            "ORDER BY sort_order ASC",
            nativeQuery = true)
    List<NckhTieuChiDinhMuc> findByPhuongAnAndChucDanh(Integer phuongAn, String chucDanh, String year);

        @Query(value = "SELECT * FROM nckh_tieu_chi_dinh_muc " +
            "WHERE tieu_chi_code = :tieuChiCode " +
            "AND chuc_danh = :chucDanh " +
            "ORDER BY phuong_an ASC, sort_order ASC, id ASC " +
            "LIMIT 1",
            nativeQuery = true)
        Optional<NckhTieuChiDinhMuc> findFirstByTieuChiCodeAndChucDanh(
            @Param("tieuChiCode") String tieuChiCode,
            @Param("chucDanh") String chucDanh);

        @Query(value = "SELECT * FROM nckh_tieu_chi_dinh_muc " +
            "WHERE tieu_chi_code = :tieuChiCode " +
            "ORDER BY phuong_an ASC, sort_order ASC, id ASC " +
            "LIMIT 1",
            nativeQuery = true)
        Optional<NckhTieuChiDinhMuc> findFirstByTieuChiCode(@Param("tieuChiCode") String tieuChiCode);

    List<NckhTieuChiDinhMuc> findAllByYear(String year);

    /**
     * Tìm record theo (tieuChiCode, chucDanh, year, phuongAn) để thực hiện upsert.
     * Nếu tìm thấy → UPDATE, chưa có → INSERT.
     */
    @Query(value = "SELECT * FROM nckh_tieu_chi_dinh_muc " +
            "WHERE tieu_chi_code = :tieuChiCode " +
            "AND chuc_danh = :chucDanh " +
            "AND year = :year " +
            "AND phuong_an = :phuongAn " +
            "LIMIT 1",
            nativeQuery = true)
    Optional<NckhTieuChiDinhMuc> findForUpsert(
            @Param("tieuChiCode") String tieuChiCode,
            @Param("chucDanh") String chucDanh,
            @Param("year") String year,
            @Param("phuongAn") Integer phuongAn);

    /**
     * Tổng giờ tối thiểu phải đạt cho một phương án + chức danh + năm.
     * Dùng để tính % hoàn thành cá nhân và định mức chuẩn nhóm.
     */
    @Query(value = "SELECT COALESCE(SUM(tong_gio_toi_thieu), 0) FROM nckh_tieu_chi_dinh_muc " +
            "WHERE phuong_an = :phuongAn AND chuc_danh = :chucDanh AND year = :year",
            nativeQuery = true)
    BigDecimal sumTongGioByPhuongAnAndChucDanh(
            @Param("phuongAn") Integer phuongAn,
            @Param("chucDanh") String chucDanh,
            @Param("year") String year);
}

