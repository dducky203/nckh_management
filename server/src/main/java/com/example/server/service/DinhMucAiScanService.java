package com.example.server.service;

import java.math.BigDecimal;
import java.text.Normalizer;
import java.time.Year;
import java.util.*;
import java.util.regex.Pattern;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import com.example.server.DTO.nckh.NckhTieuChiDinhMucRequest;
import com.example.server.constant.NckhTieuChiConstants;
import com.google.genai.Client;
import com.google.genai.errors.ClientException;
import com.google.genai.types.*;

import jakarta.annotation.PostConstruct;

@Service
public class DinhMucAiScanService {

    private static final Logger logger = LoggerFactory.getLogger(DinhMucAiScanService.class);
    private static final Set<String> VALID_CHUC_DANH = Set.of("GS_PGS", "TS", "THS", "KS_CN");

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.model}")
    private String model;

    private Client client;

    @PostConstruct
    private void init() {
        client = Client.builder()
                .apiKey(apiKey)
                .httpOptions(HttpOptions.builder()
                        .timeout(900_000)
                        .retryOptions(HttpRetryOptions.builder()
                                .attempts(3)
                                .httpStatusCodes(429, 503)
                                .build())
                        .build())
                .build();
    }

    // ═══════════════════════════════════════════════════════════════
    // PROMPT: chỉ yêu cầu AI trích xuất OCR, KHÔNG yêu cầu AI map
    // ═══════════════════════════════════════════════════════════════

    private static final String PA_PROMPT = """
            Bạn là OCR chuyên trích xuất bảng định mức NCKH từ tài liệu PDF/ảnh của Học viện Công nghệ Bưu chính Viễn thông.
            NĂM: year = "%s".

            === CẤU TRÚC BẢNG ===
            Bảng có cấu trúc MULTI-HEADER (header 2 tầng):
            - Tầng 1: "Tiêu chí hoạt động KH&CN" | "Đơn vị tính" | "Định mức theo chức danh cá nhân"
            - Tầng 2 (dưới "Định mức..."): "GS/PGS" | "TS" | "ThS" | "KS/CN"
            - Mỗi ô số tương ứng với 1 chức danh cụ thể.
            - Các nhóm tiêu chí có tên nhóm (ví dụ "Seminar", "Hội thảo") là dòng TIÊU ĐỀ NHÓM — không có số → bỏ qua.
            - Dòng con bên dưới (ví dụ "Trình bày Seminar", "Tham dự Seminar") có giá trị số → trích xuất.
            - Một số tiêu chí chỉ áp dụng cho 1-2 chức danh, các chức danh còn lại để trống → bỏ qua ô trống.

            === QUY TẮC TRÍCH XUẤT ===
            1. Mỗi (tiêu chí × chức danh) có giá trị số → 1 object JSON riêng.
               Ví dụ "Trình bày Seminar" có 4 cột → tạo 4 object.
            2. tieuChiName: tên tiêu chí CON (không phải tên nhóm). Nếu ô bị merge, suy luận tên từ dòng phía trên.
            3. chucDanh: map chính xác theo enum: "GS_PGS", "TS", "THS", "KS_CN".
            4. dinhMucToiThieu: giá trị số trong cột chức danh đó. Dùng dấu CHẤM thập phân.
            5. gioQuyDoiPerUnit: null (bảng PA không có cột này).
            6. phuongAn: xác định từ tên file hoặc tiêu đề bảng (1–6). Nếu không rõ để null.
            7. donViTinh: lấy từ cột "Đơn vị tính" (VD: "Lần/năm", "Bài/năm", "Seminar/năm/người").
            8. sortOrder: thứ tự dòng trong bảng (1, 2, 3…).
            9. BỎ QUA: dòng tổng, ghi chú, tiêu đề cột, dòng trống, dòng chỉ có tên nhóm không có số.
            10. Nếu bảng là "Nhóm nghiên cứu mạnh" (Bảng 2): có cột "Định mức theo nhóm" — BỎ QUA cột đó, CHỈ lấy cột cá nhân.
            11. ĐẶC BIỆT QUAN TRỌNG: Nếu ảnh là trang tiếp theo của bảng (không có tiêu đề cột), HÃY TỰ ĐỘNG SUY LUẬN thứ tự cột số liệu từ trái sang phải ứng với: GS/PGS, TS, ThS, KS/CN. Mặc định bỏ qua cột "Định mức theo nhóm" (nếu có).
            === VÍ DỤ ĐẦU RA JSON ===
            Với dòng bảng: "Trình bày Seminar | Seminar/năm/người | 1.6 | 0.8 | 0.8 | 0.8"
            Tạo ra:
            [
              {"phuongAn": 1, "tieuChiName": "Trình bày Seminar", "chucDanh": "GS_PGS", "donViTinh": "Seminar/năm/người", "dinhMucToiThieu": 1.6, "gioQuyDoiPerUnit": null, "year": "2025", "sortOrder": 1},
              {"phuongAn": 1, "tieuChiName": "Trình bày Seminar", "chucDanh": "TS",     "donViTinh": "Seminar/năm/người", "dinhMucToiThieu": 0.8, "gioQuyDoiPerUnit": null, "year": "2025", "sortOrder": 1},
              {"phuongAn": 1, "tieuChiName": "Trình bày Seminar", "chucDanh": "THS",    "donViTinh": "Seminar/năm/người", "dinhMucToiThieu": 0.8, "gioQuyDoiPerUnit": null, "year": "2025", "sortOrder": 1},
              {"phuongAn": 1, "tieuChiName": "Trình bày Seminar", "chucDanh": "KS_CN",  "donViTinh": "Seminar/năm/người", "dinhMucToiThieu": 0.8, "gioQuyDoiPerUnit": null, "year": "2025", "sortOrder": 1}
            ]

            Với dòng bảng: "Bài báo quốc tế danh mục WoS/Scopus | Bài/năm/người | 0.48 | 0.32 | (trống) | (trống)"
            Tạo ra:
            [
              {"phuongAn": 1, "tieuChiName": "Bài báo quốc tế danh mục WoS/Scopus", "chucDanh": "GS_PGS", "donViTinh": "Bài/năm/người", "dinhMucToiThieu": 0.48, "gioQuyDoiPerUnit": null, "year": "2025", "sortOrder": 5},
              {"phuongAn": 1, "tieuChiName": "Bài báo quốc tế danh mục WoS/Scopus", "chucDanh": "TS",     "donViTinh": "Bài/năm/người", "dinhMucToiThieu": 0.32, "gioQuyDoiPerUnit": null, "year": "2025", "sortOrder": 5}
            ]

            Trả về JSON array. Trích xuất ĐẦY ĐỦ tất cả các dòng, KHÔNG bỏ sót.
            """;

    /**
     * Prompt cho Phụ lục 2 — bảng quy đổi giờ NCKH (không có cột chức danh).
     *
     * Cấu trúc: TT | Tiêu chí | Đơn vị tính | Định mức (giờ/đơn vị)
     * Mỗi tiêu chí chỉ có 1 số duy nhất → 1 object JSON.
     */
    private static final String PL2_PROMPT = """
            Bạn là OCR chuyên trích xuất bảng Phụ lục 2 (Quy đổi giờ NCKH) từ tài liệu PDF/ảnh.
            NĂM: year = "%s".

            === CẤU TRÚC BẢNG ===
            Bảng có cấu trúc ĐƠN GIẢN: TT | Tiêu chí hoạt động KH&CN | Đơn vị tính | Định mức (giờ quy đổi / đơn vị)
            - KHÔNG có cột chức danh (GS/PGS, TS, ThS, KS/CN).
            - Cột "Định mức" = số giờ quy đổi trên mỗi đơn vị sản phẩm.
            - Một tiêu chí = 1 dòng = 1 object JSON.

            === QUY TẮC TRÍCH XUẤT ===
            1. gioQuyDoiPerUnit: giá trị cột "Định mức". Dùng dấu CHẤM thập phân.
            2. phuongAn: null. chucDanh: null. dinhMucToiThieu: null.
            3. tieuChiName: tên tiêu chí ĐÚNG như trong bảng (giữ nguyên tiếng Việt).
            4. donViTinh: lấy từ cột "Đơn vị tính".
            5. NẾU Ô CÓ KHOẢNG SỐ (VD: "50-120"): CHỈ lấy số NHỎ NHẤT (VD: 50).
            6. BỎ QUA: dòng "Trừ giờ", dòng tổng, ghi chú, tiêu đề cột, dòng trống.
            7. Số thập phân dùng dấu CHẤM.

            === VÍ DỤ ĐẦU RA JSON ===
            Với dòng: "Trình bày Seminar | Giờ/bài | 10"
            Tạo ra:
            {"phuongAn": null, "tieuChiName": "Trình bày Seminar", "chucDanh": null, "donViTinh": "Giờ/bài", "dinhMucToiThieu": null, "gioQuyDoiPerUnit": 10.0, "year": "2025", "sortOrder": 1}

            Với dòng: "Đề án Học viện (50-120) | Giờ/đề án | 50-120"
            Tạo ra:
            {"phuongAn": null, "tieuChiName": "Đề án Học viện", "chucDanh": null, "donViTinh": "Giờ/đề án", "dinhMucToiThieu": null, "gioQuyDoiPerUnit": 50.0, "year": "2025", "sortOrder": 12}

            Trả về JSON array. Trích xuất ĐẦY ĐỦ, KHÔNG bỏ sót.
            """;

    /**
     * Prompt tổng quát khi không xác định được loại bảng từ tên file.
     */
    private static final String GENERIC_PROMPT = """
            Bạn là OCR chuyên trích xuất bảng định mức NCKH từ tài liệu PDF/ảnh của Học viện Công nghệ Bưu chính Viễn thông.
            NĂM: year = "%s".

            === NHẬN DẠNG LOẠI BẢNG ===
            - Bảng Phương án (PA) / Bảng theo chức danh cá nhân: có CỘT CHỨC DANH (GS/PGS, TS, ThS, KS/CN).
              → mỗi (tiêu chí × chức danh) = 1 object. dinhMucToiThieu = giá trị số, gioQuyDoiPerUnit = null.
            - Phụ lục 2 (Quy đổi giờ): KHÔNG có cột chức danh, chỉ có 1 cột số duy nhất.
              → mỗi tiêu chí = 1 object. gioQuyDoiPerUnit = giá trị số, dinhMucToiThieu = null, chucDanh = null.

            === QUY TẮC CHUNG ===
            1. Header bảng có thể là 2 tầng (multi-header) — đọc kỹ để xác định đúng cột nào là chức danh nào.
            2. Ô bị merge (rowspan/colspan): suy luận giá trị từ ngữ cảnh dòng liền kề.
            3. Tên tiêu chí: lấy tên CON (dòng có số liệu), KHÔNG lấy tên nhóm.
            4. BỎ QUA: dòng "Trừ giờ", dòng tổng, ghi chú, tiêu đề, dòng trống, dòng chỉ có tên nhóm.
            5. Khoảng số (VD: "50-120"): lấy số NHỎ NHẤT.
            6. chucDanh enum: "GS_PGS", "TS", "THS", "KS_CN".
            7. Số thập phân dùng dấu CHẤM. Trích xuất ĐẦY ĐỦ, KHÔNG bỏ sót.

            === VÍ DỤ ĐẦU RA JSON ===
            Bảng PA — dòng "Tham dự Seminar | Lần/năm | 3 | 3 | 6 | 6":
            [
              {"phuongAn": null, "tieuChiName": "Tham dự Seminar", "chucDanh": "GS_PGS", "donViTinh": "Lần/năm", "dinhMucToiThieu": 3, "gioQuyDoiPerUnit": null, "year": "2025", "sortOrder": 2},
              {"phuongAn": null, "tieuChiName": "Tham dự Seminar", "chucDanh": "TS",     "donViTinh": "Lần/năm", "dinhMucToiThieu": 3, "gioQuyDoiPerUnit": null, "year": "2025", "sortOrder": 2},
              {"phuongAn": null, "tieuChiName": "Tham dự Seminar", "chucDanh": "THS",    "donViTinh": "Lần/năm", "dinhMucToiThieu": 6, "gioQuyDoiPerUnit": null, "year": "2025", "sortOrder": 2},
              {"phuongAn": null, "tieuChiName": "Tham dự Seminar", "chucDanh": "KS_CN",  "donViTinh": "Lần/năm", "dinhMucToiThieu": 6, "gioQuyDoiPerUnit": null, "year": "2025", "sortOrder": 2}
            ]

            Bảng Phụ lục 2 — dòng "Bài báo WoS | Giờ/bài | 210":
            {"phuongAn": null, "tieuChiName": "Bài báo WoS", "chucDanh": null, "donViTinh": "Giờ/bài", "dinhMucToiThieu": null, "gioQuyDoiPerUnit": 210.0, "year": "2025", "sortOrder": 3}

            Trả về JSON array.
            """;

    private static final Schema RESPONSE_SCHEMA = Schema.builder()
            .type(Type.Known.ARRAY)
            .items(Schema.builder()
                    .type(Type.Known.OBJECT)
                    .properties(Map.of(
                            "phuongAn", Schema.builder().type(Type.Known.INTEGER).nullable(true)
                                    .description("Số phương án 1-6, hoặc null nếu Phụ lục 2").build(),
                            "tieuChiName", Schema.builder().type(Type.Known.STRING)
                                    .description("Tên tiêu chí CHÍNH XÁC như trong bảng").build(),
                            "chucDanh", Schema.builder().type(Type.Known.STRING).nullable(true)
                                    .format("enum").enum_(List.of("GS_PGS", "TS", "THS", "KS_CN"))
                                    .description("Chức danh hoặc null").build(),
                            "donViTinh", Schema.builder().type(Type.Known.STRING).nullable(true)
                                    .description("Đơn vị tính").build(),
                            "dinhMucToiThieu", Schema.builder().type(Type.Known.NUMBER).nullable(true)
                                    .description("Định mức tối thiểu (bảng PA)").build(),
                            "gioQuyDoiPerUnit", Schema.builder().type(Type.Known.NUMBER).nullable(true)
                                    .description("Giờ quy đổi / đơn vị (Phụ lục 2)").build(),
                            "year", Schema.builder().type(Type.Known.STRING)
                                    .description("Năm").build(),
                            "sortOrder", Schema.builder().type(Type.Known.INTEGER).nullable(true)
                                    .description("Thứ tự dòng").build()))
                    .required(List.of("tieuChiName", "year"))
                    .build())
            .build();

    private static final LinkedHashMap<String, String> TIEU_CHI_CODE_MAP = new LinkedHashMap<>();
    static {
        // ── Seminar ──────────────────────────────────────────────
        TIEU_CHI_CODE_MAP.put("trinh bay seminar", NckhTieuChiConstants.SEMINAR_TRINH_BAY);
        TIEU_CHI_CODE_MAP.put("trinh bay seminar chuyen de", NckhTieuChiConstants.SEMINAR_TRINH_BAY);
        TIEU_CHI_CODE_MAP.put("tham du seminar", NckhTieuChiConstants.SEMINAR_THAM_DU);
        TIEU_CHI_CODE_MAP.put("tham du seminar co phan bien", NckhTieuChiConstants.SEMINAR_THAM_DU);
        TIEU_CHI_CODE_MAP.put("seminar co phan bien", NckhTieuChiConstants.SEMINAR_THAM_DU);

        // ── Hội thảo (tổ chức) ─────────────────────────────────
        TIEU_CHI_CODE_MAP.put("to chuc hoi thao quoc te", NckhTieuChiConstants.HT_TC_QUOCTE);
        TIEU_CHI_CODE_MAP.put("to chuc ht quoc te", NckhTieuChiConstants.HT_TC_QUOCTE);
        TIEU_CHI_CODE_MAP.put("hoi thao quoc te", NckhTieuChiConstants.HT_TC_QUOCTE);
        TIEU_CHI_CODE_MAP.put("to chuc hoi thao quoc gia", NckhTieuChiConstants.HT_TC_QUOCGIA);
        TIEU_CHI_CODE_MAP.put("to chuc ht quoc gia", NckhTieuChiConstants.HT_TC_QUOCGIA);
        TIEU_CHI_CODE_MAP.put("hoi thao quoc gia", NckhTieuChiConstants.HT_TC_QUOCGIA);
        TIEU_CHI_CODE_MAP.put("to chuc hoi thao hoc vien", NckhTieuChiConstants.HT_TC_HV);
        TIEU_CHI_CODE_MAP.put("to chuc ht hoc vien", NckhTieuChiConstants.HT_TC_HV);
        TIEU_CHI_CODE_MAP.put("hoi thao hoc vien", NckhTieuChiConstants.HT_TC_HV);
        TIEU_CHI_CODE_MAP.put("hoi thao cap hoc vien", NckhTieuChiConstants.HT_TC_HV);

        // ── Hội thảo (tham gia / tham luận) ────────────────────
        TIEU_CHI_CODE_MAP.put("tham gia hoi thao", NckhTieuChiConstants.HT_THAM_GIA);
        TIEU_CHI_CODE_MAP.put("tham du hoi thao", NckhTieuChiConstants.HT_THAM_GIA);
        TIEU_CHI_CODE_MAP.put("bai tham luan trinh bay tai hoi thao", NckhTieuChiConstants.HT_THAM_LUAN);
        TIEU_CHI_CODE_MAP.put("tham luan quoc te", NckhTieuChiConstants.HT_THAM_LUAN);
        TIEU_CHI_CODE_MAP.put("trinh bay tai hoi thao quoc te", NckhTieuChiConstants.HT_THAM_LUAN);
        TIEU_CHI_CODE_MAP.put("bai tham luan quoc te", NckhTieuChiConstants.HT_THAM_LUAN);
        TIEU_CHI_CODE_MAP.put("tham luan quoc gia", NckhTieuChiConstants.HT_THAM_LUAN);
        TIEU_CHI_CODE_MAP.put("trinh bay tai hoi thao quoc gia", NckhTieuChiConstants.HT_THAM_LUAN);
        TIEU_CHI_CODE_MAP.put("bai tham luan quoc gia", NckhTieuChiConstants.HT_THAM_LUAN);
        TIEU_CHI_CODE_MAP.put("tham luan hoc vien", NckhTieuChiConstants.HT_THAM_LUAN);
        TIEU_CHI_CODE_MAP.put("trinh bay tai hoi thao hoc vien", NckhTieuChiConstants.HT_THAM_LUAN);
        TIEU_CHI_CODE_MAP.put("bai tham luan hoc vien", NckhTieuChiConstants.HT_THAM_LUAN);

        // ── Bài báo quốc tế ─────────────────────────────────────
        TIEU_CHI_CODE_MAP.put("bai bao wos", NckhTieuChiConstants.BB_WOS_SCOPUS);
        TIEU_CHI_CODE_MAP.put("danh muc wos", NckhTieuChiConstants.BB_WOS_SCOPUS);
        TIEU_CHI_CODE_MAP.put("bai bao wos scopus", NckhTieuChiConstants.BB_WOS_SCOPUS);
        TIEU_CHI_CODE_MAP.put("bai bao quoc te danh muc wos scopus", NckhTieuChiConstants.BB_WOS_SCOPUS);
        TIEU_CHI_CODE_MAP.put("bai bao quoc te wos scopus", NckhTieuChiConstants.BB_WOS_SCOPUS);
        TIEU_CHI_CODE_MAP.put("la tac gia chinh wos scopus", NckhTieuChiConstants.BB_WOS_SCOPUS);
        TIEU_CHI_CODE_MAP.put("bai bao scopus", NckhTieuChiConstants.BB_SCOPUS);
        TIEU_CHI_CODE_MAP.put("danh muc scopus", NckhTieuChiConstants.BB_SCOPUS);
        TIEU_CHI_CODE_MAP.put("bai bao tieng anh hoc vien", NckhTieuChiConstants.BB_TA_HOCVIEN);
        TIEU_CHI_CODE_MAP.put("tieng anh tap chi hoc vien", NckhTieuChiConstants.BB_TA_HOCVIEN);
        TIEU_CHI_CODE_MAP.put("bai bao tieng anh tap chi hoc vien", NckhTieuChiConstants.BB_TA_HOCVIEN);
        // Bài báo quốc tế khác (không WoS) — không có code chuẩn, dùng BB_WOS_SCOPUS gần nhất
        TIEU_CHI_CODE_MAP.put("bai bao quoc te khong wos", NckhTieuChiConstants.BB_WOS_SCOPUS);
        TIEU_CHI_CODE_MAP.put("khong thuoc danh muc wos", NckhTieuChiConstants.BB_WOS_SCOPUS);
        TIEU_CHI_CODE_MAP.put("bai bao quoc te khac", NckhTieuChiConstants.BB_WOS_SCOPUS);

        // ── Bài báo tiếng Việt ──────────────────────────────────
        TIEU_CHI_CODE_MAP.put("bai bao tieng viet tap chi hoc vien", NckhTieuChiConstants.BB_TV_HOCVIEN);
        TIEU_CHI_CODE_MAP.put("tieng viet tap chi hoc vien", NckhTieuChiConstants.BB_TV_HOCVIEN);
        TIEU_CHI_CODE_MAP.put("bai bao tieng viet", NckhTieuChiConstants.BB_TV_HOCVIEN);

        // ── Bài tham luận đăng kỷ yếu (full text) ───────────────
        TIEU_CHI_CODE_MAP.put("ky yeu quoc te", NckhTieuChiConstants.BTL_FULL_TEXT);
        TIEU_CHI_CODE_MAP.put("ky yeu hoi thao quoc te", NckhTieuChiConstants.BTL_FULL_TEXT);
        TIEU_CHI_CODE_MAP.put("full text quoc te", NckhTieuChiConstants.BTL_FULL_TEXT);
        TIEU_CHI_CODE_MAP.put("bai tham luan dang ky yeu quoc te", NckhTieuChiConstants.BTL_FULL_TEXT);
        TIEU_CHI_CODE_MAP.put("gio ht quoc gia", NckhTieuChiConstants.BTL_FULL_TEXT);
        TIEU_CHI_CODE_MAP.put("ky yeu quoc gia", NckhTieuChiConstants.BTL_FULL_TEXT);
        TIEU_CHI_CODE_MAP.put("ky yeu hoi thao quoc gia", NckhTieuChiConstants.BTL_FULL_TEXT);
        TIEU_CHI_CODE_MAP.put("full text quoc gia", NckhTieuChiConstants.BTL_FULL_TEXT);
        TIEU_CHI_CODE_MAP.put("bai tham luan dang ky yeu quoc gia", NckhTieuChiConstants.BTL_FULL_TEXT);
        TIEU_CHI_CODE_MAP.put("ky yeu hoc vien", NckhTieuChiConstants.BTL_FULL_TEXT);
        TIEU_CHI_CODE_MAP.put("ky yeu hoi thao hoc vien", NckhTieuChiConstants.BTL_FULL_TEXT);
        TIEU_CHI_CODE_MAP.put("full text hoc vien", NckhTieuChiConstants.BTL_FULL_TEXT);

        // ── Bài tổng quan ───────────────────────────────────────
        TIEU_CHI_CODE_MAP.put("bai tong quan", NckhTieuChiConstants.TONG_QUAN);
        TIEU_CHI_CODE_MAP.put("tong quan ve linh vuc", NckhTieuChiConstants.TONG_QUAN);
        TIEU_CHI_CODE_MAP.put("tong quan linh vuc nghien cuu", NckhTieuChiConstants.TONG_QUAN);

        // ── Tư vấn / Bản tin website ────────────────────────────
        TIEU_CHI_CODE_MAP.put("tu van", NckhTieuChiConstants.TU_VAN_BAN_TIN);
        TIEU_CHI_CODE_MAP.put("ban tin", NckhTieuChiConstants.TU_VAN_BAN_TIN);
        TIEU_CHI_CODE_MAP.put("huong dan ky thuat", NckhTieuChiConstants.TU_VAN_BAN_TIN);
        TIEU_CHI_CODE_MAP.put("hoat dong tu van huong dan ky thuat ban tin", NckhTieuChiConstants.TU_VAN_BAN_TIN);
        TIEU_CHI_CODE_MAP.put("tu van huong dan ban tin website", NckhTieuChiConstants.TU_VAN_BAN_TIN);
        TIEU_CHI_CODE_MAP.put("ban tin website hoc vien", NckhTieuChiConstants.TU_VAN_BAN_TIN);

        // ── Quy trình kỹ thuật ──────────────────────────────────
        TIEU_CHI_CODE_MAP.put("quy trinh ky thuat", NckhTieuChiConstants.QUY_TRINH_KY_THUAT);
        TIEU_CHI_CODE_MAP.put("tieu bo ky thuat", NckhTieuChiConstants.QUY_TRINH_KY_THUAT);
        TIEU_CHI_CODE_MAP.put("tieu chuan ky thuat", NckhTieuChiConstants.QUY_TRINH_KY_THUAT);
        TIEU_CHI_CODE_MAP.put("tien bo ky thuat", NckhTieuChiConstants.QUY_TRINH_KY_THUAT);
        TIEU_CHI_CODE_MAP.put("gop y van ban quy pham phap luat", NckhTieuChiConstants.QUY_TRINH_KY_THUAT);
        TIEU_CHI_CODE_MAP.put("thong tin ket qua nghien cuu", NckhTieuChiConstants.QUY_TRINH_KY_THUAT);

        // ── Đề xuất nhiệm vụ NCKH ──────────────────────────────
        TIEU_CHI_CODE_MAP.put("de xuat cap bo", NckhTieuChiConstants.DE_XUAT_BO);
        TIEU_CHI_CODE_MAP.put("de xuat cap bo va tuong duong", NckhTieuChiConstants.DE_XUAT_BO);
        TIEU_CHI_CODE_MAP.put("danh muc tuyen chon cap bo", NckhTieuChiConstants.DE_XUAT_BO);
        TIEU_CHI_CODE_MAP.put("de xuat nhiem vu nckh", NckhTieuChiConstants.DE_XUAT_BO);
        // Đề xuất quốc gia cũng map vào DE_XUAT_BO (không có code riêng)
        TIEU_CHI_CODE_MAP.put("de xuat quoc gia", NckhTieuChiConstants.DE_XUAT_BO);
        TIEU_CHI_CODE_MAP.put("de xuat cap quoc gia", NckhTieuChiConstants.DE_XUAT_BO);

        // ── Đề tài / Nhiệm vụ KH&CN được phê duyệt ─────────────
        // Cấp Bộ — chủ nhiệm → DT_BO_CHUNHIEM
        TIEU_CHI_CODE_MAP.put("nhiem vu cap bo chu nhiem", NckhTieuChiConstants.DT_BO_CHUNHIEM);
        TIEU_CHI_CODE_MAP.put("de tai cap bo chu nhiem", NckhTieuChiConstants.DT_BO_CHUNHIEM);
        TIEU_CHI_CODE_MAP.put("de tai cap bo va tuong duong chu tri", NckhTieuChiConstants.DT_BO_CHUNHIEM);
        TIEU_CHI_CODE_MAP.put("nhiem vu khcn duoc phe duyet", NckhTieuChiConstants.DT_BO_CHUNHIEM);
        // Cấp Quốc gia / cấp Bộ — thư ký, tham gia
        TIEU_CHI_CODE_MAP.put("nhiem vu quoc gia chu nhiem", NckhTieuChiConstants.DT_BO_CHUNHIEM);
        TIEU_CHI_CODE_MAP.put("de tai cap quoc gia chu nhiem", NckhTieuChiConstants.DT_BO_CHUNHIEM);
        TIEU_CHI_CODE_MAP.put("nhiem vu cap bo thu ky", NckhTieuChiConstants.DT_BO_CHUNHIEM);
        TIEU_CHI_CODE_MAP.put("nhiem vu cap bo tham gia", NckhTieuChiConstants.DT_BO_CHUNHIEM);
        TIEU_CHI_CODE_MAP.put("nhiem vu quoc gia thu ky", NckhTieuChiConstants.DT_BO_CHUNHIEM);
        TIEU_CHI_CODE_MAP.put("nhiem vu quoc gia tham gia", NckhTieuChiConstants.DT_BO_CHUNHIEM);
        // Cấp Học viện
        TIEU_CHI_CODE_MAP.put("nhiem vu hoc vien chu nhiem", NckhTieuChiConstants.DT_BO_CHUNHIEM);
        TIEU_CHI_CODE_MAP.put("nhiem vu hoc vien tham gia", NckhTieuChiConstants.DT_BO_CHUNHIEM);
        TIEU_CHI_CODE_MAP.put("de tai cap hoc vien tham gia", NckhTieuChiConstants.DT_BO_CHUNHIEM);

        // ── Hướng dẫn SV NCKH ───────────────────────────────────
        TIEU_CHI_CODE_MAP.put("huong dan sv nckh", NckhTieuChiConstants.HD_SVNCKH);
        TIEU_CHI_CODE_MAP.put("huong dan sinh vien", NckhTieuChiConstants.HD_SVNCKH);
        TIEU_CHI_CODE_MAP.put("huong dan nhom sinh vien nckh", NckhTieuChiConstants.HD_SVNCKH);
        TIEU_CHI_CODE_MAP.put("hop dong khcn tap huan", NckhTieuChiConstants.HD_SVNCKH);
        TIEU_CHI_CODE_MAP.put("hop dong nckh khac tap huan de an", NckhTieuChiConstants.HD_SVNCKH);

        // ── Hội đồng tư vấn ─────────────────────────────────────
        TIEU_CHI_CODE_MAP.put("hoi dong tu van", NckhTieuChiConstants.HOI_DONG_TU_VAN);
        TIEU_CHI_CODE_MAP.put("thanh vien hoi dong", NckhTieuChiConstants.HOI_DONG_TU_VAN);
        TIEU_CHI_CODE_MAP.put("to chuc hoi dong tu van khoa hoc", NckhTieuChiConstants.HOI_DONG_TU_VAN);
        TIEU_CHI_CODE_MAP.put("tham du hoi dong tu van khoa hoc", NckhTieuChiConstants.HOI_DONG_TU_VAN);
        TIEU_CHI_CODE_MAP.put("tu van dinh huong nghien cuu xay dung thuyet minh", NckhTieuChiConstants.HOI_DONG_TU_VAN);

        // ── Mời / Tham dự chuyên gia ─────────────────────────────
        TIEU_CHI_CODE_MAP.put("moi chuyen gia", NckhTieuChiConstants.MOI_CHUYEN_GIA);
        TIEU_CHI_CODE_MAP.put("moi chuyen gia trinh bay seminar", NckhTieuChiConstants.MOI_CHUYEN_GIA);
        TIEU_CHI_CODE_MAP.put("tham du seminar chuyen de do chuyen gia", NckhTieuChiConstants.MOI_CHUYEN_GIA);

        // ── Xây dựng đề án Học viện ─────────────────────────────
        TIEU_CHI_CODE_MAP.put("de an hoc vien", NckhTieuChiConstants.XD_DE_AN_HV);
        TIEU_CHI_CODE_MAP.put("xd de an hoc vien", NckhTieuChiConstants.XD_DE_AN_HV);
        TIEU_CHI_CODE_MAP.put("xay dung de an nhiem vu hoc vien", NckhTieuChiConstants.XD_DE_AN_HV);

        // ── Sản phẩm KH&CN thương hiệu Học viện ─────────────────
        TIEU_CHI_CODE_MAP.put("san pham khcn hoc vien", NckhTieuChiConstants.SP_KHCN_HOCVIEN);
        TIEU_CHI_CODE_MAP.put("san pham kh cn mang thuong hieu hoc vien", NckhTieuChiConstants.SP_KHCN_HOCVIEN);
        TIEU_CHI_CODE_MAP.put("bai quang ba", NckhTieuChiConstants.SP_KHCN_HOCVIEN);
        TIEU_CHI_CODE_MAP.put("bai quang ba khcn", NckhTieuChiConstants.SP_KHCN_HOCVIEN);
    }
    public List<NckhTieuChiDinhMucRequest> scanFiles(List<MultipartFile> files, String year) {
        String effectiveYear = (year != null && !year.isBlank())
                ? year
                : String.valueOf(Year.now().getValue());

        List<NckhTieuChiDinhMucRequest> paRows = new ArrayList<>();
        List<NckhTieuChiDinhMucRequest> pl2Rows = new ArrayList<>();

        for (MultipartFile file : files) {
            try {
                if (file.isEmpty())
                    continue;
                FileHint hint = detectFileHint(file.getOriginalFilename());
                List<NckhTieuChiDinhMucRequest> fileResults = processSingleFile(file, effectiveYear, hint);

                if (hint.type == FileHint.DocType.PHU_LUC_2) {
                    pl2Rows.addAll(fileResults);
                } else {
                    paRows.addAll(fileResults);
                }
            } catch (ClientException ce) {
                String msg = ce.getMessage();
                boolean isRateLimit = msg != null
                        && (msg.contains("429") || msg.toLowerCase().contains("too many requests"));
                logger.error("AI ClientException scanning {}: {}. rateLimit={}",
                        file.getOriginalFilename(), msg, isRateLimit, ce);
                if (isRateLimit) {
                    throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS,
                            "Hệ thống AI đang quá tải hoặc hết hạn mức. Vui lòng thử lại sau.", ce);
                }
            } catch (Exception e) {
                logger.error("Lỗi khi quét file {}: {}", file.getOriginalFilename(), e.getMessage());
            }
        }

        List<NckhTieuChiDinhMucRequest> result;
        if (!paRows.isEmpty() && !pl2Rows.isEmpty()) {
            result = mergePaDriven(paRows, pl2Rows);
        } else if (!paRows.isEmpty()) {
            result = paRows;
        } else {
            result = pl2Rows;
        }

        assignTieuChiCodes(result);
        return result;
    }


    /**
     * PA-DRIVEN merge: Iterate PA rows (the plan criteria), look up gioQuyDoiPerUnit from PL2.
     * Output = exactly the PA rows, with gioQuyDoiPerUnit filled where a PL2 match is found.
     * PL2-only rows are DROPPED — they are not part of this plan.
     *
     * Example: PA1 has 50 criteria, PL2 has 150 → output is 50 rows (PA1 criteria only).
     */
    private List<NckhTieuChiDinhMucRequest> mergePaDriven(
            List<NckhTieuChiDinhMucRequest> paRows,
            List<NckhTieuChiDinhMucRequest> pl2Rows) {

        // Build PL2 lookup: normalizedKey → PL2 row
        Map<String, NckhTieuChiDinhMucRequest> pl2Index = new LinkedHashMap<>();
        for (NckhTieuChiDinhMucRequest pl2 : pl2Rows) {
            String key = normalizeForMatch(pl2.tieuChiName);
            pl2Index.put(key, pl2);
        }

        List<NckhTieuChiDinhMucRequest> result = new ArrayList<>();
        int matched = 0, notFound = 0;

        for (NckhTieuChiDinhMucRequest pa : paRows) {
            NckhTieuChiDinhMucRequest merged = new NckhTieuChiDinhMucRequest();
            // Copy all PA fields
            merged.phuongAn        = pa.phuongAn;
            merged.tieuChiName     = pa.tieuChiName;
            merged.chucDanh        = pa.chucDanh;
            merged.donViTinh       = pa.donViTinh;
            merged.dinhMucToiThieu = pa.dinhMucToiThieu;
            merged.sortOrder       = pa.sortOrder;
            merged.year            = pa.year;

            // Look up gioQuyDoiPerUnit from PL2
            String paKey = normalizeForMatch(pa.tieuChiName);
            NckhTieuChiDinhMucRequest pl2Match = findBestPl2Match(paKey, pl2Index);
            if (pl2Match != null) {
                merged.gioQuyDoiPerUnit = pl2Match.gioQuyDoiPerUnit;
                // If donViTinh is missing from PA, take from PL2
                if (merged.donViTinh == null || merged.donViTinh.isBlank()) {
                    merged.donViTinh = pl2Match.donViTinh;
                }
                matched++;
            } else {
                merged.gioQuyDoiPerUnit = null;
                notFound++;
                logger.warn("PA '{}' (key='{}') → không tìm thấy PL2 tương ứng, gioQuyDoiPerUnit=null",
                        pa.tieuChiName, paKey);
            }

            result.add(merged);
        }

        logger.info("PA-driven merge: {} PA rows, {} matched PL2, {} unmatched → {} output rows",
                paRows.size(), matched, notFound, result.size());
        return result;
    }

    /**
     * Find the best matching PL2 row for a given PA key using word-overlap scoring.
     */
    private NckhTieuChiDinhMucRequest findBestPl2Match(
            String paKey, Map<String, NckhTieuChiDinhMucRequest> pl2Index) {

        // 1. Exact match first
        if (pl2Index.containsKey(paKey)) {
            return pl2Index.get(paKey);
        }

        // 2. Substring match
        for (Map.Entry<String, NckhTieuChiDinhMucRequest> entry : pl2Index.entrySet()) {
            if (paKey.contains(entry.getKey()) || entry.getKey().contains(paKey)) {
                return entry.getValue();
            }
        }

        // 3. Word-overlap fuzzy match
        Set<String> paWords = significantWords(paKey);
        String bestKey = null;
        int bestScore = 0;

        for (String pl2Key : pl2Index.keySet()) {
            Set<String> pl2Words = significantWords(pl2Key);
            int score = 0;
            for (String w : paWords) {
                if (pl2Words.contains(w)) score++;
            }
            if (score > bestScore) {
                bestScore = score;
                bestKey = pl2Key;
            }
        }

        if (bestScore < 2) return null;
        logger.debug("PA '{}' fuzzy-matched PL2 '{}' (score={})", paKey, bestKey, bestScore);
        return pl2Index.get(bestKey);
    }


    private static final Set<String> STOP_WORDS = Set.of(
            "cac", "cua", "va", "cho", "voi", "trong",
            "la", "co", "duoc", "den", "hoac", "mot", "nam");

    private Set<String> significantWords(String normalizedText) {
        Set<String> words = new HashSet<>(Arrays.asList(normalizedText.split(" ")));
        words.removeAll(STOP_WORDS);
        words.removeIf(w -> w.length() <= 1);
        return words;
    }

    // ═══════════════════════════════════════════════════════════════
    // NORMALIZE + CODE ASSIGNMENT
    // ═══════════════════════════════════════════════════════════════

    private String normalizeForMatch(String text) {
        if (text == null)
            return "";
        String nfd = Normalizer.normalize(text.trim().toLowerCase(), Normalizer.Form.NFD);
        String noDiacritics = DIACRITICS_PATTERN.matcher(nfd).replaceAll("");
        return noDiacritics
                .replace("đ", "d").replace("Đ", "d")
                .replaceAll("[^a-z0-9 ]", " ")
                .replaceAll("\\s+", " ")
                .trim();
    }

    private static final Pattern DIACRITICS_PATTERN = Pattern.compile("\\p{InCombiningDiacriticalMarks}+");

    private void assignTieuChiCodes(List<NckhTieuChiDinhMucRequest> rows) {
        for (NckhTieuChiDinhMucRequest r : rows) {
            if (r.tieuChiName == null)
                continue;
            String normalized = normalizeForMatch(r.tieuChiName);
            String code = lookupTieuChiCode(normalized);
            if (code != null) {
                r.tieuChiCode = code;
            } else if (r.tieuChiCode == null || r.tieuChiCode.isBlank()) {
                r.tieuChiCode = generateFallbackCode(normalized);
                logger.warn("tieuChiCode not found for '{}', fallback: {}", r.tieuChiName, r.tieuChiCode);
            }
        }
    }

    private String lookupTieuChiCode(String normalizedName) {
        for (Map.Entry<String, String> entry : TIEU_CHI_CODE_MAP.entrySet()) {
            if (normalizedName.contains(entry.getKey())) {
                return entry.getValue();
            }
        }
        return null;
    }

    private String generateFallbackCode(String normalizedName) {
        return normalizedName.toUpperCase()
                .replaceAll("[^A-Z0-9 ]", "")
                .trim()
                .replaceAll("\\s+", "_");
    }

    // ═══════════════════════════════════════════════════════════════
    // XỬ LÝ TỪNG FILE
    // ═══════════════════════════════════════════════════════════════

    private List<NckhTieuChiDinhMucRequest> processSingleFile(MultipartFile file, String year, FileHint hint) {
        try {
            byte[] bytes = file.getBytes();
            String mimeType = resolveMimeType(file);
            String fileName = file.getOriginalFilename();

            String prompt = buildPrompt(hint, year);

            Content content = Content.fromParts(
                    Part.fromText(prompt),
                    Part.fromBytes(bytes, mimeType));

            GenerateContentConfig config = GenerateContentConfig.builder()
                    .temperature(0.05f)
                    .maxOutputTokens(65536)
                    .responseMimeType("application/json")
                    .responseSchema(RESPONSE_SCHEMA)
                    .build();

            GenerateContentResponse response;
            try {
                response = client.models.generateContent(model, content, config);
            } catch (ClientException ce) {
                logger.error("ClientException from AI when processing '{}': {}", fileName, ce.getMessage(), ce);
                throw ce;
            }
            String aiText = response.text();

            logger.info("AI scan response for '{}' (first 800 chars): {}",
                    fileName,
                    aiText != null && aiText.length() > 800 ? aiText.substring(0, 800) + "..." : aiText);

            List<NckhTieuChiDinhMucRequest> rows = parseRows(aiText, year);
            applyFileHint(rows, hint);
            logger.info("Parsed {} valid rows from file '{}' (hint: {})", rows.size(), fileName, hint);
            return rows;

        } catch (ClientException ce) {
            throw ce;
        } catch (Exception e) {
            logger.error("DinhMucAiScanService error for '{}': {}", file.getOriginalFilename(), e.getMessage(), e);
            throw new RuntimeException("Không thể quét file: " + e.getMessage());
        }
    }

    private String buildPrompt(FileHint hint, String year) {
        String base;
        if (hint.type == FileHint.DocType.PHUONG_AN) {
            base = String.format(PA_PROMPT, year);
        } else if (hint.type == FileHint.DocType.PHU_LUC_2) {
            base = String.format(PL2_PROMPT, year);
        } else {
            base = String.format(GENERIC_PROMPT, year);
        }
        if (hint.hintText != null) {
            base += "\n" + hint.hintText;
        }
        return base;
    }

    // ═══════════════════════════════════════════════════════════════
    // FILE HINT: nhận dạng loại bảng từ tên file
    // ═══════════════════════════════════════════════════════════════

    private static class FileHint {
        enum DocType {
            PHUONG_AN, PHU_LUC_2, UNKNOWN
        }

        DocType type = DocType.UNKNOWN;
        Integer phuongAn;
        String hintText;

        @Override
        public String toString() {
            return type + (phuongAn != null ? " PA" + phuongAn : "");
        }
    }

    private FileHint detectFileHint(String fileName) {
        FileHint hint = new FileHint();
        if (fileName == null || fileName.isBlank())
            return hint;

        String lower = fileName.toLowerCase().replaceAll("\\s+", "");

        java.util.regex.Matcher paMatcher = java.util.regex.Pattern
                .compile("pa(\\d)").matcher(lower);
        if (paMatcher.find()) {
            int num = Integer.parseInt(paMatcher.group(1));
            if (num >= 1 && num <= 6) {
                hint.type = FileHint.DocType.PHUONG_AN;
                hint.phuongAn = num;
                hint.hintText = String.format("Tên file: \"%s\" → BẢNG PHƯƠNG ÁN %d. phuongAn = %d.",
                        fileName, num, num);
                return hint;
            }
        }

        if (lower.contains("pl2") || lower.contains("phuluc2") || lower.contains("phu_luc_2")) {
            hint.type = FileHint.DocType.PHU_LUC_2;
            hint.hintText = String.format("Tên file: \"%s\" → PHỤ LỤC 2.", fileName);
            return hint;
        }
        return hint;
    }

    private void applyFileHint(List<NckhTieuChiDinhMucRequest> rows, FileHint hint) {
        if (hint.type == FileHint.DocType.PHUONG_AN && hint.phuongAn != null) {
            for (NckhTieuChiDinhMucRequest r : rows) {
                r.phuongAn = hint.phuongAn;
            }
        } else if (hint.type == FileHint.DocType.PHU_LUC_2) {
            for (NckhTieuChiDinhMucRequest r : rows) {
                r.phuongAn = null;
                r.chucDanh = null;
                r.dinhMucToiThieu = null;
            }
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // PARSE + VALIDATE
    // ═══════════════════════════════════════════════════════════════

    private String resolveMimeType(MultipartFile file) {
        String name = (file.getOriginalFilename() != null)
                ? file.getOriginalFilename().toLowerCase()
                : "";
        if (name.endsWith(".pdf"))
            return "application/pdf";
        if (name.endsWith(".png"))
            return "image/png";
        if (name.endsWith(".jpg") || name.endsWith(".jpeg"))
            return "image/jpeg";
        if (name.endsWith(".webp"))
            return "image/webp";
        if (name.endsWith(".heic"))
            return "image/heic";
        String ct = file.getContentType();
        return ct != null ? ct : "image/jpeg";
    }

    private List<NckhTieuChiDinhMucRequest> parseRows(String aiText, String fallbackYear) {
        if (aiText == null || aiText.isBlank())
            return List.of();

        try {
            com.google.gson.JsonArray arr = com.google.gson.JsonParser
                    .parseString(aiText).getAsJsonArray();

            List<NckhTieuChiDinhMucRequest> result = new ArrayList<>();
            for (int i = 0; i < arr.size(); i++) {
                com.google.gson.JsonObject obj = arr.get(i).getAsJsonObject();
                NckhTieuChiDinhMucRequest req = new NckhTieuChiDinhMucRequest();

                req.phuongAn = getInt(obj, "phuongAn");
                req.tieuChiName = getString(obj, "tieuChiName");
                req.chucDanh = normalizeChucDanh(getString(obj, "chucDanh"));
                req.donViTinh = getString(obj, "donViTinh");
                req.dinhMucToiThieu = getPositiveBigDecimal(obj, "dinhMucToiThieu");
                req.gioQuyDoiPerUnit = getPositiveBigDecimal(obj, "gioQuyDoiPerUnit");
                req.sortOrder = getInt(obj, "sortOrder");
                req.year = getString(obj, "year");

                if (req.year == null || req.year.isBlank())
                    req.year = fallbackYear;
                if (!isValidRow(req, i + 1))
                    continue;

                result.add(req);
            }
            logger.info("Parsed {} valid rows from AI response (raw: {}).", result.size(), arr.size());
            return result;
        } catch (Exception e) {
            logger.error("parseRows error: {}", e.getMessage());
            return List.of();
        }
    }

    private boolean isValidRow(NckhTieuChiDinhMucRequest req, int rowIndex) {
        if (req.tieuChiName == null || req.tieuChiName.isBlank()) {
            logger.warn("Row {} skipped: tieuChiName is empty", rowIndex);
            return false;
        }
        String nameLower = req.tieuChiName.toLowerCase();
        if (nameLower.contains("trừ giờ") || nameLower.contains("tru gio")) {
            logger.info("Row {} '{}': skipping 'Trừ giờ' row", rowIndex, req.tieuChiName);
            return false;
        }
        if (req.chucDanh != null && !VALID_CHUC_DANH.contains(req.chucDanh)) {
            logger.warn("Row {} '{}': invalid chucDanh '{}', setting null", rowIndex, req.tieuChiName, req.chucDanh);
            req.chucDanh = null;
        }
        if (req.dinhMucToiThieu == null && req.gioQuyDoiPerUnit == null) {
            logger.warn("Row {} '{}': no numeric data, skipping", rowIndex, req.tieuChiName);
            return false;
        }
        if (req.phuongAn != null && (req.phuongAn < 1 || req.phuongAn > 6)) {
            logger.warn("Row {} '{}': phuongAn {} out of range, setting null", rowIndex, req.tieuChiName, req.phuongAn);
            req.phuongAn = null;
        }
        return true;
    }

    private String normalizeChucDanh(String raw) {
        if (raw == null || raw.isBlank())
            return null;
        String upper = raw.trim().toUpperCase().replace(" ", "_").replace("/", "_");
        if (VALID_CHUC_DANH.contains(upper))
            return upper;
        if (upper.contains("GS") || upper.contains("PGS"))
            return "GS_PGS";
        if (upper.contains("TIEN SI") || upper.equals("TS"))
            return "TS";
        if (upper.contains("THAC SI") || upper.equals("THS"))
            return "THS";
        if (upper.contains("KY SU") || upper.contains("CU NHAN") || upper.contains("KS") || upper.contains("CN"))
            return "KS_CN";
        logger.warn("Cannot normalize chucDanh: '{}'", raw);
        return raw.trim();
    }

    private String getString(com.google.gson.JsonObject obj, String key) {
        if (!obj.has(key) || obj.get(key).isJsonNull())
            return null;
        return obj.get(key).getAsString();
    }

    private Integer getInt(com.google.gson.JsonObject obj, String key) {
        if (!obj.has(key) || obj.get(key).isJsonNull())
            return null;
        try {
            return obj.get(key).getAsInt();
        } catch (Exception e) {
            return null;
        }
    }

    private BigDecimal getPositiveBigDecimal(com.google.gson.JsonObject obj, String key) {
        if (!obj.has(key) || obj.get(key).isJsonNull())
            return null;
        try {
            BigDecimal val = obj.get(key).getAsBigDecimal();
            return val.compareTo(BigDecimal.ZERO) >= 0 ? val : null;
        } catch (Exception e) {
            return null;
        }
    }
}
