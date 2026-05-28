package com.example.server.domain.nckh;

import com.example.server.domain.EntityBase;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.math.BigDecimal;

@Entity
@Getter
@Setter
@Table(name = "nckh_tieu_chi_dinh_muc")
public class NckhTieuChiDinhMuc extends EntityBase{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "phuong_an", nullable = false)
    private Integer phuongAn;

    @Column(name = "tieu_chi_code", nullable = false, length = 50)
    private String tieuChiCode;

    @Column(name = "tieu_chi_name", nullable = false, length = 255)
    private String tieuChiName;

    @Enumerated(EnumType.STRING)
    @Column(name = "chuc_danh", nullable = false, length = 10)
    private ChucDanh chucDanh;

    @Column(name = "don_vi_tinh", length = 50)
    private String donViTinh;

    @Column(name = "dinh_muc_toi_thieu", precision = 10, scale = 2)
    private BigDecimal dinhMucToiThieu;

    @Column(name = "gio_quy_doi_per_unit", precision = 10, scale = 2)
    private BigDecimal gioQuyDoiPerUnit;

    @Column(name = "tong_gio_toi_thieu", precision = 10, scale = 2)
    private BigDecimal tongGioToiThieu;

    @Column(name = "year", length = 5)
    private String year;

    @Column(name = "ghi_chu", length = 500)
    private String ghiChu;

    @Column(name = "sort_order", nullable = false)
    private Integer sortOrder = 0;

    public enum ChucDanh {
        GS_PGS, TS, THS, KS_CN
    }

}
