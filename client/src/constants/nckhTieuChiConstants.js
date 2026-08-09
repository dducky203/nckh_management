/**
 * Định nghĩa tập trung các mã tiêu chí NCKH (tieu_chi_code) và mapping sang tên hiển thị mặc định.
 * Các thông tin chi tiết (định mức tối thiểu, giờ quy đổi, tổng giờ...) sẽ được lấy động 
 * từ database (bảng nckh_tieu_chi_dinh_muc) theo từng năm và từng phương án do admin nhập từ Excel.
 */

export const TIEU_CHI_CODES = {
  SEMINAR_TRINH_BAY: "SEMINAR_TRINH_BAY",
  SEMINAR_THAM_DU: "SEMINAR_THAM_DU",
  HT_THAM_LUAN: "HT_THAM_LUAN",
  HT_THAM_GIA: "HT_THAM_GIA",
  BB_WOS_SCOPUS: "BB_WOS_SCOPUS",
  BB_TA_HOCVIEN: "BB_TA_HOCVIEN",
  BB_TV_HOCVIEN: "BB_TV_HOCVIEN",
  BTL_FULL_TEXT: "BTL_FULL_TEXT",
  TONG_QUAN: "TONG_QUAN",
  DE_XUAT_BO: "DE_XUAT_BO",
  DT_BO_CHUNHIEM: "DT_BO_CHUNHIEM",
  HD_SVNCKH: "HD_SVNCKH",
  HOI_DONG_TU_VAN: "HOI_DONG_TU_VAN",
  MOI_CHUYEN_GIA: "MOI_CHUYEN_GIA",
  XD_DE_AN_HV: "XD_DE_AN_HV",
  TU_VAN_BAN_TIN: "TU_VAN_BAN_TIN",
  QUY_TRINH_KY_THUAT: "QUY_TRINH_KY_THUAT",
  HT_TC_HV: "HT_TC_HV",
  HT_TC_QUOCGIA: "HT_TC_QUOCGIA",
  HT_TC_QUOCTE: "HT_TC_QUOCTE",
  BB_SCOPUS: "BB_SCOPUS",
  SP_KHCN_HOCVIEN: "SP_KHCN_HOCVIEN",
};

export const TIEU_CHI_NAME_MAP = {
  [TIEU_CHI_CODES.SEMINAR_TRINH_BAY]: "Trình bày Seminar",
  [TIEU_CHI_CODES.SEMINAR_THAM_DU]: "Tham dự Seminar",
  [TIEU_CHI_CODES.HT_THAM_LUAN]: "Bài tham luận trình bày tại hội thảo",
  [TIEU_CHI_CODES.HT_THAM_GIA]: "Tham gia hội thảo",
  [TIEU_CHI_CODES.BB_WOS_SCOPUS]: "Bài báo quốc tế WoS/Scopus",
  [TIEU_CHI_CODES.BB_TA_HOCVIEN]: "Bài báo tiếng Anh (Tạp chí Học viện)",
  [TIEU_CHI_CODES.BB_TV_HOCVIEN]: "Bài báo tiếng Việt (Tạp chí Học viện)",
  [TIEU_CHI_CODES.BTL_FULL_TEXT]: "Bài tham luận hội thảo (full text)",
  [TIEU_CHI_CODES.TONG_QUAN]: "Bài tổng quan lĩnh vực nghiên cứu",
  [TIEU_CHI_CODES.DE_XUAT_BO]: "Đề xuất nhiệm vụ cấp Bộ và tương đương",
  [TIEU_CHI_CODES.DT_BO_CHUNHIEM]: "Đề tài cấp Bộ và tương đương (chủ trì)",
  [TIEU_CHI_CODES.HD_SVNCKH]: "Hướng dẫn nhóm SV NCKH / Hợp đồng KH&CN",
  [TIEU_CHI_CODES.HOI_DONG_TU_VAN]: "Tham dự Hội đồng tư vấn KH định hướng NC",
  [TIEU_CHI_CODES.MOI_CHUYEN_GIA]: "Tham dự Seminar/chuyên đề do chuyên gia",
  [TIEU_CHI_CODES.XD_DE_AN_HV]: "Xây dựng đề án/Nhiệm vụ KH&CN Học viện",
  [TIEU_CHI_CODES.TU_VAN_BAN_TIN]: "Các hoạt động tư vấn/ Hướng dẫn kỹ thuật/ Bản tin KH&CN đăng trên website Học viện",
  [TIEU_CHI_CODES.QUY_TRINH_KY_THUAT]: "Quy trình kỹ thuật/ Tiến bộ kỹ thuật được công nhận",
  [TIEU_CHI_CODES.HT_TC_HV]: "Hội thảo cấp Học viện",
  [TIEU_CHI_CODES.HT_TC_QUOCGIA]: "Hội thảo cấp Quốc gia",
  [TIEU_CHI_CODES.HT_TC_QUOCTE]: "Hội thảo cấp Quốc tế",
  [TIEU_CHI_CODES.BB_SCOPUS]: "Bài báo Scopus (trong hệ thống Q)",
  [TIEU_CHI_CODES.SP_KHCN_HOCVIEN]: "Sản phẩm KH&CN mang thương hiệu Học viện",
};

export function getTieuChiName(code, fallback) {
  return TIEU_CHI_NAME_MAP[code] || fallback || code || "";
}
