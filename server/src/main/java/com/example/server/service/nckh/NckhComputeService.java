package com.example.server.service.nckh;

import com.example.server.domain.nckh.NckhActivityContributor;

import org.springframework.stereotype.Service;

@Service
public class NckhComputeService {

    public static class ComputeResult {
        public final double hoursShare;
        public final double equivQty;

        public ComputeResult(double hoursShare, double equivQty) {
            this.hoursShare = hoursShare;
            this.equivQty = equivQty;
        }
    }

    // Công thức bạn yêu cầu:
    // MAIN: qty*S*(1/3 + 2/(3*n))
    // MEMBER: qty*S*(2/(3*n))
    public ComputeResult compute(double qty, double S, int n, NckhActivityContributor.Role role) {
        if (n <= 0)
            n = 1;
        double base = (2.0) / (3.0 * n);
        double factor = (role == NckhActivityContributor.Role.MAIN) ? (1.0 / 3.0 + base) : base;
        double hoursShare = qty * S * factor;
        double equivQty = (S == 0) ? 0 : (hoursShare / S);
        return new ComputeResult(hoursShare, equivQty);
    }

    // =========================================================
    // NHÓM NGHIÊN CỨU – TÍNH ĐỊNH MỨC THEO LOẠI NHÓM
    // =========================================================

    /**
     * Tính định mức (giờ quy đổi) cho 1 thành viên trong nhóm nghiên cứu.
     * Trả về null nếu không có quy tắc riêng cho tiêu chí / loại nhóm đó.
     */
    public Double computeGroupMemberQuota(double qty, String groupType, String tieuChiCode,
                                          String chucDanh, boolean isLeader) {
        if (groupType == null || chucDanh == null || tieuChiCode == null) return null;

        String type = groupType.toUpperCase();
        String cd   = mapChucDanh(chucDanh);

        if (type.contains("NCM")) {
            return computeNcm(qty, tieuChiCode, cd);
        } else if (type.contains("XUAT_SAC") || type.contains("XUẤT SẮC")) {
            return computeXuatSac(qty, tieuChiCode, cd, isLeader);
        } else if (type.contains("TINH_HOA")) {
            return computeTinhHoa(qty, tieuChiCode, cd, isLeader);
        }
        return null;
    }

    // -----------------------------------------------------------
    // Chuẩn hoá chức danh
    // -----------------------------------------------------------
    private String mapChucDanh(String raw) {
        String up = raw.toUpperCase().replace(" ", "");
        if (up.contains("GS") || up.contains("PGS"))           return "GSPGS";
        if (up.contains("TS")  || up.contains("TIẾNSĨ"))       return "TS";
        if (up.contains("THS") || up.contains("THẠCSĨ"))       return "THS";
        return "KSCN";
    }

    // -----------------------------------------------------------
    // Bảng 2 – Nhóm NCM (hệ số 0,8)
    // -----------------------------------------------------------
    private Double computeNcm(double qty, String code, String cd) {
        switch (code) {
            case "SEMINAR_TRINH_BAY":
            case "HT_THAM_LUAN":
                return ("GSPGS".equals(cd) ? 1.6 : 0.8) * qty;

            case "BB_WOS_SCOPUS":
            case "BB_SCOPUS":
                if ("GSPGS".equals(cd)) return 0.48 * qty;
                if ("TS".equals(cd))    return 0.32 * qty;
                return 0.0;

            case "BB_TA_HOCVIEN":
                if ("GSPGS".equals(cd) || "THS".equals(cd)) return 0.4 * qty;
                return 0.0;

            case "BB_TV_HOCVIEN":
                if ("TS".equals(cd))   return 0.4 * qty;
                if ("THS".equals(cd))  return 0.8 * qty;
                if ("KSCN".equals(cd)) return 0.4 * qty;
                return 0.0;

            case "HT_THAM_LUAN_KYYEU":
                if ("GSPGS".equals(cd) || "TS".equals(cd)) return 0.8 * qty;
                if ("THS".equals(cd)) return 0.4 * qty;
                return 0.0;

            case "TU_VAN_BAN_TIN":
                if ("TS".equals(cd))   return 0.8 * qty;
                if ("THS".equals(cd))  return 1.6 * qty;
                if ("KSCN".equals(cd)) return 0.8 * qty;
                return 0.0;

            case "QUY_TRINH_KT":
                if ("TS".equals(cd)) return 0.8 * qty;
                return 0.0;

            case "DE_XUAT_BO":
                if ("GSPGS".equals(cd) || "TS".equals(cd)) return 1.6 * qty;
                if ("THS".equals(cd)) return 0.8 * qty;
                return 0.0;

            case "NHIEM_VU_BO_CHU":
                if ("GSPGS".equals(cd) || "TS".equals(cd)) return 0.32 * qty;
                return 0.0;

            case "HD_SVNCKH":
                if ("THS".equals(cd) || "KSCN".equals(cd)) return 0.8 * qty;
                return 0.0;

            default:
                return null;
        }
    }

    // -----------------------------------------------------------
    // Bảng 3 – Nhóm Xuất sắc (chỉ thành viên, 2 tiêu chí)
    // -----------------------------------------------------------
    private Double computeXuatSac(double qty, String code, String cd, boolean isLeader) {
        if (isLeader) return null; // Trưởng nhóm có chế độ riêng ngoài phạm vi
        switch (code) {
            case "BB_WOS_SCOPUS":
            case "BB_SCOPUS":
                if ("GSPGS".equals(cd)) return 0.60 * qty;
                if ("TS".equals(cd))    return 0.40 * qty;
                return 0.0;

            case "NHIEM_VU_BO_CHU":
                if ("GSPGS".equals(cd) || "TS".equals(cd)) return 0.40 * qty;
                return 0.0;

            default:
                return null;
        }
    }

    // -----------------------------------------------------------
    // Bảng 4 – Nhóm Tinh hoa (chỉ thành viên, 2 tiêu chí)
    // -----------------------------------------------------------
    private Double computeTinhHoa(double qty, String code, String cd, boolean isLeader) {
        if (isLeader) return null;
        switch (code) {
            case "BB_WOS_SCOPUS":
            case "BB_SCOPUS":
                if ("GSPGS".equals(cd)) return 0.48 * qty;
                if ("TS".equals(cd))    return 0.32 * qty;
                return 0.0;

            case "NHIEM_VU_BO_CHU":
                if ("GSPGS".equals(cd) || "TS".equals(cd)) return 0.32 * qty;
                return 0.0;

            default:
                return null;
        }
    }
}
