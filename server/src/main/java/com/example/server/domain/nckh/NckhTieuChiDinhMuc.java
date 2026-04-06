package com.example.server.domain.nckh;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "nckh_tieu_chi_dinh_muc")
public class NckhTieuChiDinhMuc {

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

    public Long getId() {
        return id;
    }

    public Integer getPhuongAn() {
        return phuongAn;
    }

    public void setPhuongAn(Integer phuongAn) {
        this.phuongAn = phuongAn;
    }

    public String getTieuChiCode() {
        return tieuChiCode;
    }

    public void setTieuChiCode(String tieuChiCode) {
        this.tieuChiCode = tieuChiCode;
    }

    public String getTieuChiName() {
        return tieuChiName;
    }

    public void setTieuChiName(String tieuChiName) {
        this.tieuChiName = tieuChiName;
    }

    public ChucDanh getChucDanh() {
        return chucDanh;
    }

    public void setChucDanh(ChucDanh chucDanh) {
        this.chucDanh = chucDanh;
    }

    public String getDonViTinh() {
        return donViTinh;
    }

    public void setDonViTinh(String donViTinh) {
        this.donViTinh = donViTinh;
    }

    public BigDecimal getDinhMucToiThieu() {
        return dinhMucToiThieu;
    }

    public void setDinhMucToiThieu(BigDecimal dinhMucToiThieu) {
        this.dinhMucToiThieu = dinhMucToiThieu;
    }

    public BigDecimal getGioQuyDoiPerUnit() {
        return gioQuyDoiPerUnit;
    }

    public void setGioQuyDoiPerUnit(BigDecimal gioQuyDoiPerUnit) {
        this.gioQuyDoiPerUnit = gioQuyDoiPerUnit;
    }

    public BigDecimal getTongGioToiThieu() {
        return tongGioToiThieu;
    }

    public void setTongGioToiThieu(BigDecimal tongGioToiThieu) {
        this.tongGioToiThieu = tongGioToiThieu;
    }

    public String getGhiChu() {
        return ghiChu;
    }

    public void setGhiChu(String ghiChu) {
        this.ghiChu = ghiChu;
    }

    public Integer getSortOrder() {
        return sortOrder;
    }

    public void setSortOrder(Integer sortOrder) {
        this.sortOrder = sortOrder;
    }
}
