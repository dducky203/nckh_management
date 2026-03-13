package com.example.server.repository.nckh;

import com.example.server.domain.nckh.NckhTieuChiDinhMuc;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface NckhTieuChiDinhMucRepository extends JpaRepository<NckhTieuChiDinhMuc, Long> {

    @Query(value = "SELECT * FROM nckh_tieu_chi_dinh_muc " +
            "WHERE phuong_an = :phuongAn " +
            "AND chuc_danh = :chucDanh " +
            "ORDER BY sort_order ASC",
            nativeQuery = true)
    List<NckhTieuChiDinhMuc> findByPhuongAnAndChucDanh(Integer phuongAn, String chucDanh);
}
