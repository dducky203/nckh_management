package com.example.server.service;

import java.time.Year;
import java.util.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.server.DTO.nckh.NckhTieuChiDinhMucRequest;
import com.google.gson.*;
import okhttp3.*;

/**
 * Quét file ảnh / PDF bằng Gemini Vision để trích xuất dữ liệu định mức.
 */
@Service
public class DinhMucAiScanService {

    private static final Logger logger = LoggerFactory.getLogger(DinhMucAiScanService.class);

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.model}")
    private String model;

    @Value("${gemini.api.endpoint}")
    private String endpoint;

    private final OkHttpClient client = new OkHttpClient.Builder()
            .connectTimeout(java.time.Duration.ofSeconds(30))
            .writeTimeout(java.time.Duration.ofSeconds(120))
            .readTimeout(java.time.Duration.ofSeconds(120))
            .build();

    private final Gson gson = new Gson();

    private static final String PROMPT_TEMPLATE = """
Bạn là một trợ lý trích xuất dữ liệu định mức NCKH từ bảng biểu.
Hãy đọc toàn bộ nội dung bảng trong ảnh/tài liệu và trả về JSON array theo đúng định dạng dưới đây.
KHÔNG thêm bất kỳ markdown, giải thích hay ký tự thừa nào, CHỈ trả về JSON thuần.

QUY TẮC XÁC ĐỊNH phuongAn (BẮT BUỘC):
- Nếu tài liệu có nhiều bảng được đánh số: Bảng 1 → phuongAn = 1, ..., Bảng 6 → phuongAn = 6.
- Nếu tài liệu ghi rõ "Phương án 1", "PA1", "Bảng 1" hoặc tương tự → phuongAn tương ứng số đó.
- Nếu không xác định được → phuongAn = null.

QUY TẮC chucDanh (BẮT BUỘC – chỉ dùng đúng 4 giá trị sau):
- Giáo sư / Phó Giáo sư → "GS_PGS"
- Tiến sĩ → "TS"
- Thạc sĩ → "THS"
- Kỹ sư / Cử nhân → "KS_CN"

Mỗi phần tử trong mảng là một object:
{
  "phuongAn": <số nguyên 1–6, null nếu không xác định>,
  "tieuChiCode": "<mã code VIẾT_HOA_GACH_DUOI tiếng Anh không dấu, VD: SEMINAR_TRINH_BAY>",
  "tieuChiName": "<tên tiêu chí đầy đủ như trong bảng>",
  "chucDanh": "<GS_PGS hoặc TS hoặc THS hoặc KS_CN – BẮT BUỘC dùng đúng format này>",
  "donViTinh": "<đơn vị tính, ví dụ: bài, giờ, đề tài, buổi...>",
  "dinhMucToiThieu": <số thập phân, null nếu không có>,
  "gioQuyDoiPerUnit": <số thập phân, null nếu không có>,
  "year": "%s",
  "sortOrder": <số thứ tự dòng trong bảng, bắt đầu từ 1>
}

Chú ý quan trọng:
- Nếu cùng 1 tiêu chí có hệ số KHÁC NHAU theo chức danh, hãy tạo NHIỀU DÒNG RIÊNG BIỆT cho từng chức danh có giá trị.
- Bỏ qua dòng "Tổng", "Ghi chú", dòng tiêu đề bảng.
- Giá trị "—", "-", ô trống = null (không tạo dòng cho chức danh đó nếu không có giá trị).
- Cột "Giờ quy đổi" hoặc "Hệ số quy đổi" = gioQuyDoiPerUnit.
- Cột "Định mức tối thiểu" hoặc "Số lượng tối thiểu" = dinhMucToiThieu.
- Đảm bảo trích xuất ĐẦY ĐỦ tất cả các dòng trong bảng, không bỏ sót.
""";

    /**
     * Quét nhiều file và trả về danh sách định mức đề xuất.
     */
    public List<NckhTieuChiDinhMucRequest> scanFiles(List<MultipartFile> files, String year) {
        List<NckhTieuChiDinhMucRequest> allResults = new ArrayList<>();
        String effectiveYear = (year != null && !year.isBlank())
                ? year
                : String.valueOf(Year.now().getValue());

        for (MultipartFile file : files) {
            try {
                if (file.isEmpty()) continue;
                List<NckhTieuChiDinhMucRequest> fileResults = processSingleFile(file, effectiveYear);
                allResults.addAll(fileResults);
            } catch (Exception e) {
                logger.error("Lỗi khi quét file {}: {}", file.getOriginalFilename(), e.getMessage());
                // Tiếp tục quét các file khác
            }
        }
        return allResults;
    }

    private List<NckhTieuChiDinhMucRequest> processSingleFile(MultipartFile file, String year) {
        try {
            byte[] bytes = file.getBytes();
            String base64 = Base64.getEncoder().encodeToString(bytes);
            String mimeType = resolveMimeType(file);

            String prompt = String.format(PROMPT_TEMPLATE, year);

            // Build Gemini vision request
            JsonObject textPart = new JsonObject();
            textPart.addProperty("text", prompt);

            JsonObject inlineData = new JsonObject();
            inlineData.addProperty("mimeType", mimeType);
            inlineData.addProperty("data", base64);

            JsonObject imagePart = new JsonObject();
            imagePart.add("inlineData", inlineData);

            JsonArray parts = new JsonArray();
            parts.add(textPart);
            parts.add(imagePart);

            JsonObject content = new JsonObject();
            content.addProperty("role", "user");
            content.add("parts", parts);

            JsonArray contents = new JsonArray();
            contents.add(content);

            JsonObject generationConfig = new JsonObject();
            generationConfig.addProperty("temperature", 0.1);
            generationConfig.addProperty("maxOutputTokens", 32768);

            JsonObject requestBody = new JsonObject();
            requestBody.add("contents", contents);
            requestBody.add("generationConfig", generationConfig);

            String url = endpoint + model + ":generateContent?key=" + apiKey;
            RequestBody body = RequestBody.create(
                    requestBody.toString(),
                    MediaType.parse("application/json")
            );
            Request request = new Request.Builder().url(url).post(body).build();

            try (Response response = client.newCall(request).execute()) {
                if (!response.isSuccessful()) {
                    String errBody = response.body() != null ? response.body().string() : "no body";
                    throw new RuntimeException("Gemini API error: " + response.code() + " - " + errBody);
                }

                String rawJson = response.body().string();
                JsonObject jsonResponse = gson.fromJson(rawJson, JsonObject.class);
                String aiText = extractText(jsonResponse);

                logger.info("Gemini AI scan raw response (first 500 chars): {}",
                        aiText.length() > 500 ? aiText.substring(0, 500) : aiText);

                return parseRows(aiText);
            }

        } catch (Exception e) {
            logger.error("DinhMucAiScanService error: {}", e.getMessage(), e);
            throw new RuntimeException("Không thể quét file: " + e.getMessage());
        }
    }

    // ------------------------------------------------------------------
    // Helpers
    // ------------------------------------------------------------------

    private String resolveMimeType(MultipartFile file) {
        String name = (file.getOriginalFilename() != null)
                ? file.getOriginalFilename().toLowerCase() : "";
        if (name.endsWith(".pdf"))          return "application/pdf";
        if (name.endsWith(".png"))          return "image/png";
        if (name.endsWith(".jpg") || name.endsWith(".jpeg")) return "image/jpeg";
        if (name.endsWith(".webp"))         return "image/webp";
        if (name.endsWith(".heic"))         return "image/heic";
        // Fallback
        String ct = file.getContentType();
        return ct != null ? ct : "image/jpeg";
    }

    private String extractText(JsonObject jsonResponse) {
        try {
            JsonArray candidates = jsonResponse.getAsJsonArray("candidates");
            if (candidates == null || candidates.isEmpty()) return "[]";
            JsonObject candidate = candidates.get(0).getAsJsonObject();
            JsonObject content   = candidate.getAsJsonObject("content");
            if (content == null) return "[]";
            JsonArray parts = content.getAsJsonArray("parts");
            if (parts == null || parts.isEmpty()) return "[]";
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < parts.size(); i++) {
                JsonObject p = parts.get(i).getAsJsonObject();
                if (p.has("text")) sb.append(p.get("text").getAsString());
            }
            return sb.toString().trim();
        } catch (Exception e) {
            logger.error("extractText error: {}", e.getMessage());
            return "[]";
        }
    }

    private List<NckhTieuChiDinhMucRequest> parseRows(String aiText) {
        // Strip possible markdown code fences
        String cleaned = aiText
                .replaceAll("(?s)```json\\s*", "")
                .replaceAll("(?s)```\\s*", "")
                .trim();

        // Find first '['
        int start = cleaned.indexOf('[');
        if (start == -1) {
            logger.warn("AI did not return a JSON array. Raw (first 300): {}",
                    cleaned.length() > 300 ? cleaned.substring(0, 300) : cleaned);
            return List.of();
        }

        int end = cleaned.lastIndexOf(']');
        String jsonStr;

        if (end == -1 || end <= start) {
            // JSON bị cắt giữa chừng → cố gắng salvage
            logger.warn("Gemini response truncated. Attempting to salvage incomplete JSON...");
            jsonStr = salvageIncompleteJson(cleaned.substring(start));
        } else {
            jsonStr = cleaned.substring(start, end + 1);
        }

        try {
            JsonArray arr = JsonParser.parseString(jsonStr).getAsJsonArray();
            List<NckhTieuChiDinhMucRequest> result = new ArrayList<>();

            for (int i = 0; i < arr.size(); i++) {
                JsonObject obj = arr.get(i).getAsJsonObject();
                NckhTieuChiDinhMucRequest req = new NckhTieuChiDinhMucRequest();

                req.phuongAn     = getInt(obj, "phuongAn");
                req.tieuChiCode  = getString(obj, "tieuChiCode");
                req.tieuChiName  = getString(obj, "tieuChiName");
                req.chucDanh     = getString(obj, "chucDanh");
                req.donViTinh    = getString(obj, "donViTinh");
                req.dinhMucToiThieu   = getBigDecimal(obj, "dinhMucToiThieu");
                req.gioQuyDoiPerUnit  = getBigDecimal(obj, "gioQuyDoiPerUnit");
                req.ghiChu       = getString(obj, "ghiChu");
                req.sortOrder    = getInt(obj, "sortOrder");
                req.year         = getString(obj, "year");

                result.add(req);
            }
            logger.info("Parsed {} rows from AI response.", result.size());
            return result;

        } catch (Exception e) {
            logger.error("parseRows JSON error: {}", e.getMessage());
            return List.of();
        }
    }

    /**
     * Cắt bỏ object JSON cuối cùng bị incomplete, đóng mảng lại.
     * Ví dụ: [{...}, {...}, {"foo": "bar  → [{...}, {...}]
     */
    private String salvageIncompleteJson(String partial) {
        // Tìm dấu '}' cuối cùng hoàn chỉnh
        int lastCompleteObj = partial.lastIndexOf("}");
        if (lastCompleteObj == -1) return "[]";
        String truncated = partial.substring(0, lastCompleteObj + 1);
        // Loại bỏ trailing comma nếu có
        truncated = truncated.replaceAll(",\\s*$", "").trim();
        // Đóng mảng
        return truncated + "]";
    }

    private String getString(JsonObject obj, String key) {
        if (!obj.has(key) || obj.get(key).isJsonNull()) return null;
        return obj.get(key).getAsString();
    }

    private Integer getInt(JsonObject obj, String key) {
        if (!obj.has(key) || obj.get(key).isJsonNull()) return null;
        try { return obj.get(key).getAsInt(); } catch (Exception e) { return null; }
    }

    private java.math.BigDecimal getBigDecimal(JsonObject obj, String key) {
        if (!obj.has(key) || obj.get(key).isJsonNull()) return null;
        try { return obj.get(key).getAsBigDecimal(); } catch (Exception e) { return null; }
    }
}
