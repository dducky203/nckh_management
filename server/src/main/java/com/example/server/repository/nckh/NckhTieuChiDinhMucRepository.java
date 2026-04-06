package com.example.server.repository.nckh;

import com.example.server.domain.nckh.NckhTieuChiDinhMuc;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NckhTieuChiDinhMucRepository extends JpaRepository<NckhTieuChiDinhMuc, Long> {

    @Query(value = "SELECT * FROM nckh_tieu_chi_dinh_muc " +
            "WHERE phuong_an = :phuongAn " +
            "AND chuc_danh = :chucDanh " +
            "ORDER BY sort_order ASC",
            nativeQuery = true)
    List<NckhTieuChiDinhMuc> findByPhuongAnAndChucDanh(Integer phuongAn, String chucDanh);

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
}
