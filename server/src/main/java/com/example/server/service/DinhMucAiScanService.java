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
Trích xuất TOÀN BỘ dòng dữ liệu từ bảng phương án NCKH trong ảnh/PDF. Trả về JSON array.
NĂM: year = "%s".

QUY TẮC:
- Mỗi dòng trong bảng → 1 object JSON.
- Tạo dòng RIÊNG cho từng chức danh (GS/PGS, TS, ThS, KS/CN) nếu giá trị khác nhau.
- Cột "Định mức" trong bảng này = dinhMucToiThieu.
- gioQuyDoiPerUnit = null (bảng PA không có giờ quy đổi).
- BỎ QUA: dòng tổng, ghi chú, tiêu đề cột, dòng trống.
- Số thập phân dùng dấu CHẤM.
- Trích xuất ĐẦY ĐỦ, KHÔNG bỏ sót.
""";

    private static final String PL2_PROMPT = """
Trích xuất TOÀN BỘ dòng dữ liệu từ bảng Phụ lục 2 (Quy đổi giờ NCKH) trong ảnh/PDF. Trả về JSON array.
NĂM: year = "%s".

QUY TẮC:
- Mỗi dòng tiêu chí → 1 object JSON. CHỈ 1 dòng mỗi tiêu chí.
- Cột "Định mức" trong bảng này = gioQuyDoiPerUnit (giờ quy đổi / đơn vị).
- phuongAn = null, chucDanh = null, dinhMucToiThieu = null.
- BỎ QUA: dòng "Trừ giờ", dòng tổng, ghi chú, tiêu đề cột, dòng trống.
- Số thập phân dùng dấu CHẤM.
- Trích xuất ĐẦY ĐỦ, KHÔNG bỏ sót.
""";

    private static final String GENERIC_PROMPT = """
Trích xuất TOÀN BỘ dòng dữ liệu từ bảng định mức NCKH trong ảnh/PDF. Trả về JSON array.
NĂM: year = "%s".

Xác định loại bảng:
- Bảng Phương án (1-6): có cột chức danh → dinhMucToiThieu = cột "Định mức", gioQuyDoiPerUnit = null.
- Phụ lục 2: không có chức danh → gioQuyDoiPerUnit = cột "Định mức", dinhMucToiThieu = null.

BỎ QUA: dòng tổng, ghi chú, tiêu đề cột, dòng trống, dòng "Trừ giờ".
Số thập phân dùng dấu CHẤM. Trích xuất ĐẦY ĐỦ, KHÔNG bỏ sót.
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
        TIEU_CHI_CODE_MAP.put("trinh bay seminar", "SEMINAR_TRINH_BAY");

        TIEU_CHI_CODE_MAP.put("to chuc hoi thao quoc te", "HT_TO_CHUC_QUOC_TE");
        TIEU_CHI_CODE_MAP.put("to chuc ht quoc te", "HT_TO_CHUC_QUOC_TE");
        TIEU_CHI_CODE_MAP.put("to chuc hoi thao quoc gia", "HT_TO_CHUC_QUOC_GIA");
        TIEU_CHI_CODE_MAP.put("to chuc ht quoc gia", "HT_TO_CHUC_QUOC_GIA");
        TIEU_CHI_CODE_MAP.put("to chuc hoi thao hoc vien", "HT_TO_CHUC_HOC_VIEN");
        TIEU_CHI_CODE_MAP.put("to chuc ht hoc vien", "HT_TO_CHUC_HOC_VIEN");
        TIEU_CHI_CODE_MAP.put("tham gia hoi thao", "HT_THAM_GIA");

        TIEU_CHI_CODE_MAP.put("tham luan quoc te", "HT_THAM_LUAN_QUOC_TE");
        TIEU_CHI_CODE_MAP.put("trinh bay tai hoi thao quoc te", "HT_THAM_LUAN_QUOC_TE");
        TIEU_CHI_CODE_MAP.put("tham luan quoc gia", "HT_THAM_LUAN_QUOC_GIA");
        TIEU_CHI_CODE_MAP.put("trinh bay tai hoi thao quoc gia", "HT_THAM_LUAN_QUOC_GIA");
        TIEU_CHI_CODE_MAP.put("tham luan hoc vien", "HT_THAM_LUAN_HOC_VIEN");
        TIEU_CHI_CODE_MAP.put("trinh bay tai hoi thao hoc vien", "HT_THAM_LUAN_HOC_VIEN");

        TIEU_CHI_CODE_MAP.put("bai bao wos", "BB_WOS");
        TIEU_CHI_CODE_MAP.put("danh muc wos", "BB_WOS");
        TIEU_CHI_CODE_MAP.put("bai bao scopus", "BB_SCOPUS");
        TIEU_CHI_CODE_MAP.put("danh muc scopus", "BB_SCOPUS");
        TIEU_CHI_CODE_MAP.put("bai bao tieng anh hoc vien", "BB_TA_HOCVIEN");
        TIEU_CHI_CODE_MAP.put("tieng anh tap chi hoc vien", "BB_TA_HOCVIEN");
        TIEU_CHI_CODE_MAP.put("bai bao quoc te khong wos", "BB_QUOC_TE_KHAC");
        TIEU_CHI_CODE_MAP.put("khong thuoc danh muc wos", "BB_QUOC_TE_KHAC");
        TIEU_CHI_CODE_MAP.put("trich dan bai bao", "BB_TRICH_DAN_TA");

        TIEU_CHI_CODE_MAP.put("bai bao tieng viet tap chi hoc vien", "BB_TV_HOCVIEN");
        TIEU_CHI_CODE_MAP.put("tieng viet tap chi hoc vien", "BB_TV_HOCVIEN");
        TIEU_CHI_CODE_MAP.put("bai bao tieng viet tap chi khac", "BB_TV_KHAC");
        TIEU_CHI_CODE_MAP.put("tieng viet cac tap chi khac", "BB_TV_KHAC");

        TIEU_CHI_CODE_MAP.put("ky yeu quoc te", "BTL_QUOC_TE");
        TIEU_CHI_CODE_MAP.put("ky yeu hoi thao quoc te", "BTL_QUOC_TE");
        TIEU_CHI_CODE_MAP.put("full text quoc te", "BTL_QUOC_TE");
        TIEU_CHI_CODE_MAP.put("ky yeu quoc gia", "BTL_QUOC_GIA");
        TIEU_CHI_CODE_MAP.put("ky yeu hoi thao quoc gia", "BTL_QUOC_GIA");
        TIEU_CHI_CODE_MAP.put("full text quoc gia", "BTL_QUOC_GIA");
        TIEU_CHI_CODE_MAP.put("ky yeu hoc vien", "BTL_HOC_VIEN");
        TIEU_CHI_CODE_MAP.put("ky yeu hoi thao hoc vien", "BTL_HOC_VIEN");
        TIEU_CHI_CODE_MAP.put("full text hoc vien", "BTL_HOC_VIEN");

        TIEU_CHI_CODE_MAP.put("bai tong quan", "TONG_QUAN");
        TIEU_CHI_CODE_MAP.put("tong quan ve linh vuc", "TONG_QUAN");
        TIEU_CHI_CODE_MAP.put("tu van", "TU_VAN_BAN_TIN");
        TIEU_CHI_CODE_MAP.put("ban tin", "TU_VAN_BAN_TIN");
        TIEU_CHI_CODE_MAP.put("huong dan ky thuat", "TU_VAN_BAN_TIN");
        TIEU_CHI_CODE_MAP.put("quy trinh ky thuat", "QUY_TRINH_KY_THUAT");
        TIEU_CHI_CODE_MAP.put("tieu bo ky thuat", "QUY_TRINH_KY_THUAT");
        TIEU_CHI_CODE_MAP.put("tieu chuan ky thuat", "QUY_TRINH_KY_THUAT");
        TIEU_CHI_CODE_MAP.put("de xuat quoc gia", "DE_XUAT_QG");
        TIEU_CHI_CODE_MAP.put("de xuat cap bo", "DE_XUAT_BO");
        TIEU_CHI_CODE_MAP.put("danh muc tuyen chon cap bo", "DE_XUAT_BO");

        TIEU_CHI_CODE_MAP.put("nhiem vu quoc gia chu nhiem", "NHIEM_VU_QG_CHU");
        TIEU_CHI_CODE_MAP.put("nhiem vu quoc gia thu ky", "NHIEM_VU_QG_TK");
        TIEU_CHI_CODE_MAP.put("nhiem vu quoc gia tham gia", "NHIEM_VU_QG_TG");
        TIEU_CHI_CODE_MAP.put("nhiem vu cap bo chu nhiem", "NHIEM_VU_BO_CHU");
        TIEU_CHI_CODE_MAP.put("nhiem vu cap bo thu ky", "NHIEM_VU_BO_TK");
        TIEU_CHI_CODE_MAP.put("nhiem vu cap bo tham gia", "NHIEM_VU_BO_TG");
        TIEU_CHI_CODE_MAP.put("nhiem vu hoc vien chu nhiem", "NHIEM_VU_HV_CHU");
        TIEU_CHI_CODE_MAP.put("nhiem vu hoc vien tham gia", "NHIEM_VU_HV_TG");

        TIEU_CHI_CODE_MAP.put("huong dan sv nckh", "HD_SVNCKH");
        TIEU_CHI_CODE_MAP.put("huong dan sinh vien", "HD_SVNCKH");
        TIEU_CHI_CODE_MAP.put("hoi dong tu van", "HOI_DONG_TV");
        TIEU_CHI_CODE_MAP.put("thanh vien hoi dong", "HOI_DONG_TV");
        TIEU_CHI_CODE_MAP.put("moi chuyen gia", "MOI_CHUYEN_GIA");

        TIEU_CHI_CODE_MAP.put("chuong sach", "CHUONG_SACH");
        TIEU_CHI_CODE_MAP.put("giao trinh", "GIAO_TRINH");
        TIEU_CHI_CODE_MAP.put("sach chuyen khao", "SACH_CHUYEN_KHAO");
        TIEU_CHI_CODE_MAP.put("sach tham khao", "SACH_THAM_KHAO");
        TIEU_CHI_CODE_MAP.put("hop dong khcn", "HOP_DONG_KHCN");
        TIEU_CHI_CODE_MAP.put("hop dong kh&cn", "HOP_DONG_KHCN");
        TIEU_CHI_CODE_MAP.put("de an hoc vien", "DE_AN_HV");
        TIEU_CHI_CODE_MAP.put("bai quang ba", "BAI_QUANG_BA");
    }

    // ═══════════════════════════════════════════════════════════════
    //  LOGIC CHÍNH: scan → PL2-driven merge → gán code
    // ═══════════════════════════════════════════════════════════════

    public List<NckhTieuChiDinhMucRequest> scanFiles(List<MultipartFile> files, String year) {
        String effectiveYear = (year != null && !year.isBlank())
                ? year
                : String.valueOf(Year.now().getValue());

        List<NckhTieuChiDinhMucRequest> paRows = new ArrayList<>();
        List<NckhTieuChiDinhMucRequest> pl2Rows = new ArrayList<>();

        for (MultipartFile file : files) {
            try {
                if (file.isEmpty()) continue;
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
            result = mergePl2Driven(paRows, pl2Rows);
        } else if (!paRows.isEmpty()) {
            result = paRows;
        } else {
            result = pl2Rows;
        }

        assignTieuChiCodes(result);
        return result;
    }

    // ═══════════════════════════════════════════════════════════════
    //  PL2-DRIVEN MERGE: PL2 là master, PA bổ sung dinhMucToiThieu
    //
    //  PL2 "WoS" (210 giờ) + PA "WoS/Scopus" (GS=0.6, TS=0.4)
    //  → BB_WOS, GS_PGS, đm=0.6, giờ=210
    //  → BB_WOS, TS,     đm=0.4, giờ=210
    // ═══════════════════════════════════════════════════════════════

    private List<NckhTieuChiDinhMucRequest> mergePl2Driven(
            List<NckhTieuChiDinhMucRequest> paRows,
            List<NckhTieuChiDinhMucRequest> pl2Rows) {

        Map<String, List<NckhTieuChiDinhMucRequest>> paGroups = new LinkedHashMap<>();
        for (NckhTieuChiDinhMucRequest pa : paRows) {
            String key = normalizeForMatch(pa.tieuChiName);
            paGroups.computeIfAbsent(key, k -> new ArrayList<>()).add(pa);
        }

        List<NckhTieuChiDinhMucRequest> result = new ArrayList<>();
        int matched = 0, unmatched = 0;

        for (NckhTieuChiDinhMucRequest pl2 : pl2Rows) {
            String pl2Key = normalizeForMatch(pl2.tieuChiName);
            List<NckhTieuChiDinhMucRequest> bestPaGroup = findBestPaMatch(pl2Key, paGroups);

            if (bestPaGroup != null && !bestPaGroup.isEmpty()) {
                for (NckhTieuChiDinhMucRequest pa : bestPaGroup) {
                    NckhTieuChiDinhMucRequest merged = new NckhTieuChiDinhMucRequest();
                    merged.tieuChiName     = pl2.tieuChiName;
                    merged.gioQuyDoiPerUnit = pl2.gioQuyDoiPerUnit;
                    merged.donViTinh       = pl2.donViTinh;
                    merged.sortOrder       = pl2.sortOrder;
                    merged.phuongAn        = pa.phuongAn;
                    merged.chucDanh        = pa.chucDanh;
                    merged.dinhMucToiThieu = pa.dinhMucToiThieu;
                    merged.year            = pa.year != null ? pa.year : pl2.year;
                    result.add(merged);
                }
                matched++;
            } else {
                result.add(pl2);
                unmatched++;
                logger.warn("PL2 '{}' (key='{}') → không tìm thấy PA tương ứng", pl2.tieuChiName, pl2Key);
            }
        }

        logger.info("PL2-driven merge: {} PL2 matched, {} unmatched → {} output rows",
                matched, unmatched, result.size());
        return result;
    }

    private List<NckhTieuChiDinhMucRequest> findBestPaMatch(
            String pl2Key, Map<String, List<NckhTieuChiDinhMucRequest>> paGroups) {

        Set<String> pl2Words = significantWords(pl2Key);
        String bestKey = null;
        int bestScore = 0;

        for (String paKey : paGroups.keySet()) {
            Set<String> paWords = significantWords(paKey);
            int score = 0;
            for (String w : pl2Words) {
                if (paWords.contains(w)) score++;
            }
            if (score > bestScore) {
                bestScore = score;
                bestKey = paKey;
            }
        }

        if (bestScore < 2) return null;
        logger.debug("PL2 '{}' matched PA '{}' (score={})", pl2Key, bestKey, bestScore);
        return paGroups.get(bestKey);
    }

    private static final Set<String> STOP_WORDS = Set.of(
            "cac", "cua", "va", "cho", "voi", "trong",
            "la", "co", "duoc", "den", "hoac", "mot", "nam"
    );

    private Set<String> significantWords(String normalizedText) {
        Set<String> words = new HashSet<>(Arrays.asList(normalizedText.split(" ")));
        words.removeAll(STOP_WORDS);
        words.removeIf(w -> w.length() <= 1);
        return words;
    }

    // ═══════════════════════════════════════════════════════════════
    //  NORMALIZE + CODE ASSIGNMENT
    // ═══════════════════════════════════════════════════════════════

    private String normalizeForMatch(String text) {
        if (text == null) return "";
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
            if (r.tieuChiName == null) continue;
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
    //  XỬ LÝ TỪNG FILE
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
    //  FILE HINT: nhận dạng loại bảng từ tên file
    // ═══════════════════════════════════════════════════════════════

    private static class FileHint {
        enum DocType { PHUONG_AN, PHU_LUC_2, UNKNOWN }
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
        if (fileName == null || fileName.isBlank()) return hint;

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
    //  PARSE + VALIDATE
    // ═══════════════════════════════════════════════════════════════

    private String resolveMimeType(MultipartFile file) {
        String name = (file.getOriginalFilename() != null)
                ? file.getOriginalFilename().toLowerCase() : "";
        if (name.endsWith(".pdf"))  return "application/pdf";
        if (name.endsWith(".png"))  return "image/png";
        if (name.endsWith(".jpg") || name.endsWith(".jpeg")) return "image/jpeg";
        if (name.endsWith(".webp")) return "image/webp";
        if (name.endsWith(".heic")) return "image/heic";
        String ct = file.getContentType();
        return ct != null ? ct : "image/jpeg";
    }

    private List<NckhTieuChiDinhMucRequest> parseRows(String aiText, String fallbackYear) {
        if (aiText == null || aiText.isBlank()) return List.of();

        try {
            com.google.gson.JsonArray arr = com.google.gson.JsonParser
                    .parseString(aiText).getAsJsonArray();

            List<NckhTieuChiDinhMucRequest> result = new ArrayList<>();
            for (int i = 0; i < arr.size(); i++) {
                com.google.gson.JsonObject obj = arr.get(i).getAsJsonObject();
                NckhTieuChiDinhMucRequest req = new NckhTieuChiDinhMucRequest();

                req.phuongAn         = getInt(obj, "phuongAn");
                req.tieuChiName      = getString(obj, "tieuChiName");
                req.chucDanh         = normalizeChucDanh(getString(obj, "chucDanh"));
                req.donViTinh        = getString(obj, "donViTinh");
                req.dinhMucToiThieu  = getPositiveBigDecimal(obj, "dinhMucToiThieu");
                req.gioQuyDoiPerUnit = getPositiveBigDecimal(obj, "gioQuyDoiPerUnit");
                req.sortOrder        = getInt(obj, "sortOrder");
                req.year             = getString(obj, "year");

                if (req.year == null || req.year.isBlank()) req.year = fallbackYear;
                if (!isValidRow(req, i + 1)) continue;

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
        if (raw == null || raw.isBlank()) return null;
        String upper = raw.trim().toUpperCase().replace(" ", "_").replace("/", "_");
        if (VALID_CHUC_DANH.contains(upper)) return upper;
        if (upper.contains("GS") || upper.contains("PGS")) return "GS_PGS";
        if (upper.contains("TIEN SI") || upper.equals("TS")) return "TS";
        if (upper.contains("THAC SI") || upper.equals("THS")) return "THS";
        if (upper.contains("KY SU") || upper.contains("CU NHAN") || upper.contains("KS") || upper.contains("CN"))
            return "KS_CN";
        logger.warn("Cannot normalize chucDanh: '{}'", raw);
        return raw.trim();
    }

    private String getString(com.google.gson.JsonObject obj, String key) {
        if (!obj.has(key) || obj.get(key).isJsonNull()) return null;
        return obj.get(key).getAsString();
    }

    private Integer getInt(com.google.gson.JsonObject obj, String key) {
        if (!obj.has(key) || obj.get(key).isJsonNull()) return null;
        try { return obj.get(key).getAsInt(); } catch (Exception e) { return null; }
    }

    private BigDecimal getPositiveBigDecimal(com.google.gson.JsonObject obj, String key) {
        if (!obj.has(key) || obj.get(key).isJsonNull()) return null;
        try {
            BigDecimal val = obj.get(key).getAsBigDecimal();
            return val.compareTo(BigDecimal.ZERO) >= 0 ? val : null;
        } catch (Exception e) { return null; }
    }
}
