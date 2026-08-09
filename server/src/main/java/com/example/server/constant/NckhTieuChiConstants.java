package com.example.server.constant;

import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Set;

/**
 * Định nghĩa tập trung các mã tiêu chí NCKH (tieu_chi_code) và tên hiển thị mặc định.
 * Các chỉ tiêu chi tiết (định mức tối thiểu, giờ quy đổi, tổng giờ) được lưu trữ
 * và quản lý động trong DB (bảng nckh_tieu_chi_dinh_muc) theo từng năm từ Excel nhập vào.
 */
public final class NckhTieuChiConstants {

    private NckhTieuChiConstants() {}

    // -------------------------------------------------------------------
    // Mã tiêu chí (tieu_chi_code)
    // -------------------------------------------------------------------
    public static final String SEMINAR_TRINH_BAY    = "SEMINAR_TRINH_BAY";
    public static final String SEMINAR_THAM_DU      = "SEMINAR_THAM_DU";
    public static final String HT_THAM_LUAN         = "HT_THAM_LUAN";
    public static final String HT_THAM_GIA          = "HT_THAM_GIA";
    public static final String BB_WOS_SCOPUS        = "BB_WOS_SCOPUS";
    public static final String BB_TA_HOCVIEN        = "BB_TA_HOCVIEN";
    public static final String BB_TV_HOCVIEN        = "BB_TV_HOCVIEN";
    public static final String BTL_FULL_TEXT        = "BTL_FULL_TEXT";
    public static final String TONG_QUAN            = "TONG_QUAN";
    public static final String DE_XUAT_BO           = "DE_XUAT_BO";
    public static final String DT_BO_CHUNHIEM       = "DT_BO_CHUNHIEM";
    public static final String HD_SVNCKH            = "HD_SVNCKH";
    public static final String HOI_DONG_TU_VAN      = "HOI_DONG_TU_VAN";
    public static final String MOI_CHUYEN_GIA       = "MOI_CHUYEN_GIA";
    public static final String XD_DE_AN_HV          = "XD_DE_AN_HV";
    public static final String TU_VAN_BAN_TIN       = "TU_VAN_BAN_TIN";
    public static final String QUY_TRINH_KY_THUAT   = "QUY_TRINH_KY_THUAT";
    public static final String HT_TC_HV             = "HT_TC_HV";
    public static final String HT_TC_QUOCGIA        = "HT_TC_QUOCGIA";
    public static final String HT_TC_QUOCTE         = "HT_TC_QUOCTE";
    public static final String BB_SCOPUS            = "BB_SCOPUS";
    public static final String SP_KHCN_HOCVIEN      = "SP_KHCN_HOCVIEN";

    // -------------------------------------------------------------------
    // Mapping từ tieu_chi_code sang tên tiêu chí hiển thị mặc định
    // -------------------------------------------------------------------
    private static final Map<String, String> CODE_TO_NAME_MAP = new LinkedHashMap<>();

    static {
        CODE_TO_NAME_MAP.put(SEMINAR_TRINH_BAY, "Trình bày Seminar");
        CODE_TO_NAME_MAP.put(SEMINAR_THAM_DU, "Tham dự Seminar");
        CODE_TO_NAME_MAP.put(HT_THAM_LUAN, "Bài tham luận trình bày tại hội thảo");
        CODE_TO_NAME_MAP.put(HT_THAM_GIA, "Tham gia hội thảo");
        CODE_TO_NAME_MAP.put(BB_WOS_SCOPUS, "Bài báo quốc tế WoS/Scopus");
        CODE_TO_NAME_MAP.put(BB_TA_HOCVIEN, "Bài báo tiếng Anh (Tạp chí Học viện)");
        CODE_TO_NAME_MAP.put(BB_TV_HOCVIEN, "Bài báo tiếng Việt (Tạp chí Học viện)");
        CODE_TO_NAME_MAP.put(BTL_FULL_TEXT, "Bài tham luận hội thảo (full text)");
        CODE_TO_NAME_MAP.put(TONG_QUAN, "Bài tổng quan lĩnh vực nghiên cứu");
        CODE_TO_NAME_MAP.put(DE_XUAT_BO, "Đề xuất nhiệm vụ cấp Bộ và tương đương");
        CODE_TO_NAME_MAP.put(DT_BO_CHUNHIEM, "Đề tài cấp Bộ và tương đương (chủ trì)");
        CODE_TO_NAME_MAP.put(HD_SVNCKH, "Hướng dẫn nhóm SV NCKH / Hợp đồng KH&CN");
        CODE_TO_NAME_MAP.put(HOI_DONG_TU_VAN, "Tham dự Hội đồng tư vấn KH định hướng NC");
        CODE_TO_NAME_MAP.put(MOI_CHUYEN_GIA, "Tham dự Seminar/chuyên đề do chuyên gia");
        CODE_TO_NAME_MAP.put(XD_DE_AN_HV, "Xây dựng đề án/Nhiệm vụ KH&CN Học viện");
        CODE_TO_NAME_MAP.put(TU_VAN_BAN_TIN, "Các hoạt động tư vấn/ Hướng dẫn kỹ thuật/ Bản tin KH&CN đăng trên website Học viện");
        CODE_TO_NAME_MAP.put(QUY_TRINH_KY_THUAT, "Quy trình kỹ thuật/ Tiến bộ kỹ thuật được công nhận");
        CODE_TO_NAME_MAP.put(HT_TC_HV, "Hội thảo cấp Học viện");
        CODE_TO_NAME_MAP.put(HT_TC_QUOCGIA, "Hội thảo cấp Quốc gia");
        CODE_TO_NAME_MAP.put(HT_TC_QUOCTE, "Hội thảo cấp Quốc tế");
        CODE_TO_NAME_MAP.put(BB_SCOPUS, "Bài báo Scopus (trong hệ thống Q)");
        CODE_TO_NAME_MAP.put(SP_KHCN_HOCVIEN, "Sản phẩm KH&CN mang thương hiệu Học viện");
    }

    public static String getName(String code) {
        return getName(code, code);
    }

    public static String getName(String code, String fallback) {
        if (code == null) return fallback;
        return CODE_TO_NAME_MAP.getOrDefault(code, fallback);
    }

    /**
     * Reverse-lookup: tìm tieu_chi_code từ tên tiêu chí hiển thị.
     * So sánh không phân biệt hoa/thường và cắt khoảng trắng.
     * Trả về null nếu không tìm thấy.
     */
    public static String getCodeByName(String name) {
        if (name == null || name.isBlank()) return null;
        String normalizedInput = name.trim().toLowerCase();
        for (Map.Entry<String, String> entry : CODE_TO_NAME_MAP.entrySet()) {
            if (entry.getValue().toLowerCase().equals(normalizedInput)) {
                return entry.getKey();
            }
        }
        // Thử so sánh contains nếu không có kết quả chính xác
        for (Map.Entry<String, String> entry : CODE_TO_NAME_MAP.entrySet()) {
            if (normalizedInput.contains(entry.getValue().toLowerCase())
                    || entry.getValue().toLowerCase().contains(normalizedInput)) {
                return entry.getKey();
            }
        }
        return null;
    }

    public static Set<String> getAllCodes() {
        return Collections.unmodifiableSet(CODE_TO_NAME_MAP.keySet());
    }

    public static Map<String, String> getCodeToNameMap() {
        return Collections.unmodifiableMap(CODE_TO_NAME_MAP);
    }
}
