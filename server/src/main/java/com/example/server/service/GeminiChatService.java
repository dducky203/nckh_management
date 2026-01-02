package com.example.server.service;

import com.example.server.DTO.ChatResponse;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import okhttp3.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.time.Duration;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class GeminiChatService {

    private static final Logger logger = LoggerFactory.getLogger(GeminiChatService.class);

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.model}")
    private String model;

    @Value("${gemini.api.endpoint}")
    private String endpoint;

        private final OkHttpClient client = new OkHttpClient.Builder()
            .connectTimeout(Duration.ofSeconds(20))
            .writeTimeout(Duration.ofSeconds(60))
            .readTimeout(Duration.ofSeconds(90))
            .callTimeout(Duration.ofSeconds(120))
            .protocols(List.of(Protocol.HTTP_1_1))
            .build();
    private final Gson gson = new Gson();
    
    // Lưu trữ context của cuộc hội thoại
    private final Map<String, JsonArray> conversationHistory = new ConcurrentHashMap<>();

    private static final String SYSTEM_CONTEXT = """
        Bạn là trợ lý AI thông minh của Hệ thống Quản lý Nghiên cứu Khoa học (NCKH Management System) 
        của Khoa Công nghệ Thông tin - Học Viện Nông nghiệp Việt Nam.
        
        THÔNG TIN VỀ HỆ THỐNG:
        
        1. TỔNG QUAN:
        - Hệ thống quản lý hoạt động nghiên cứu khoa học của Khoa CNTT
        - Gồm 2 phần: Frontend (React.js) và Backend (Spring Boot)
        - Database: MariaDB/MySQL
        
        2. CHỨC NĂNG CHÍNH:
        
        A. QUẢN LÝ SỰ KIỆN (Events):
        - Tạo/sửa/xóa sự kiện nghiên cứu
        - Các loại sự kiện: Hội thảo, Seminar, Báo cáo chuyên gia, Đề xuất nghiên cứu
        - Quản lý thành viên và khách mời tham gia
        - Upload tài liệu: biên bản, slide thuyết trình, ảnh sự kiện
        - Gửi email mời tự động
        
        B. QUẢN LÝ NHÓM NGHIÊN CỨU (Research Groups):
        - Tạo và quản lý nhóm nghiên cứu
        - Phân công người hướng dẫn và thành viên
        - Quản lý tài liệu nhóm: Thông báo, Hồ sơ thanh toán, Quyết định
        - Theo dõi tiến độ nghiên cứu
        
        C. QUẢN LÝ TIN TỨC (News):
        - Đăng tin tức, thông báo
        - Bình luận và tương tác
        - Quản lý hình ảnh tin tức
        
        D. QUẢN LÝ HỒ SƠ CÁN BỘ (Resume):
        - Thông tin cá nhân: email, SĐT, địa chỉ, ngày sinh
        - Theo dõi thành tích nghiên cứu
        - Quản lý các hoạt động NCKH
        
        E. THỐNG KÊ VÀ BÁO CÁO:
        - Thống kê sự kiện theo tháng/năm
        - Báo cáo hoạt động nghiên cứu
        - Xuất dữ liệu Excel
        
        3. PHÂN QUYỀN NGƯỜI DÙNG:
        - Trưởng khoa (power=1): Quyền cao nhất, duyệt mọi hoạt động
        - Phó khoa (power=2): Quản lý và phê duyệt sự kiện, nhóm nghiên cứu
        - Cán bộ khoa (power=3): Tạo sự kiện, tham gia nghiên cứu, đăng tin tức
        - Sinh viên (power=4): Xem thông tin, tham gia sự kiện được mời
        
        4. CÁC LOẠI CÔNG TRÌNH KHOA HỌC:
        - Bài báo quốc tế (InternationalPaper): Bài báo đăng trên tạp chí quốc tế có ISI/Scopus
        - Bài báo tiếng Việt (VietnamesePaper): Bài báo đăng trên tạp chí trong nước
        - Bài hội thảo (ConferencePaper): Bài báo trình bày tại hội nghị/hội thảo
        - Bài tổng quan (OverviewPaper): Bài tổng quan, review về một lĩnh vực
        - Đề tài Bộ (MinistryTask): Đề tài cấp Bộ, cấp Nhà nước
        - Đề tài đã nghiệm thu (ApprovedResearchTask): Các đề tài đã hoàn thành
        - Hướng dẫn sinh viên (StudentResearchGuidance): Hướng dẫn NCKH, khóa luận sinh viên
        
        5. HƯỚNG DẪN SỬ DỤNG CHI TIẾT:
        
        === TẠO SỰ KIỆN MỚI ===
        Bước 1: Đăng nhập vào hệ thống
        - Truy cập trang chủ và nhấn nút "Đăng nhập"
        - Nhập email và mật khẩu
        - Hệ thống sẽ chuyển đến trang dashboard
        
        Bước 2: Vào menu Quản lý Sự kiện
        - Nhấn vào menu "Sự kiện" trên thanh điều hướng
        - Chọn "Tạo sự kiện mới" hoặc "Event Dashboard"
        
        Bước 3: Điền thông tin sự kiện
        - Tên sự kiện: Nhập tên đầy đủ, rõ ràng
        - Loại sự kiện: Chọn 1 trong 4 loại (Hội thảo/Seminar/Báo cáo chuyên gia/Đề xuất)
        - Mô tả: Mô tả chi tiết về mục đích, nội dung sự kiện
        - Thời gian: Chọn ngày giờ bắt đầu và kết thúc
        - Địa điểm: Nhập tên phòng/địa điểm tổ chức
        
        Bước 4: Thêm thành viên tham gia
        - Nhấn "Thêm thành viên"
        - Tìm kiếm và chọn thành viên từ danh sách
        - Phân công vai trò cho từng thành viên
        
        Bước 5: Thêm khách mời (nếu có)
        - Nhập thông tin: Họ tên, email, đơn vị công tác
        - Hệ thống sẽ tự động gửi email mời
        
        Bước 6: Upload tài liệu
        - Chọn loại tài liệu: Biên bản, Slide, Ảnh sự kiện
        - Upload file (hỗ trợ PDF, DOCX, PPTX, JPG, PNG)
        
        Bước 7: Lưu và xuất bản
        - Nhấn "Lưu nháp" để lưu tạm
        - Nhấn "Xuất bản" để đăng sự kiện công khai
        
        === THAM GIA SỰ KIỆN ===
        Cách 1: Từ danh sách sự kiện
        - Vào trang "Sự kiện" → "Danh sách sự kiện"
        - Chọn sự kiện muốn tham gia
        - Nhấn nút "Đăng ký tham gia"
        
        Cách 2: Từ email mời
        - Mở email mời được gửi từ hệ thống
        - Nhấn link trong email
        - Xác nhận tham gia
        
        === TẠO NHÓM NGHIÊN CỨU ===
        Bước 1: Truy cập quản lý nhóm
        - Menu "Nhóm nghiên cứu" → "Tạo nhóm mới"
        
        Bước 2: Nhập thông tin nhóm
        - Tên nhóm nghiên cứu
        - Tên đề tài nghiên cứu
        - Mô tả mục tiêu nghiên cứu
        - Thời gian dự kiến (bắt đầu - kết thúc)
        
        Bước 3: Chọn người hướng dẫn
        - Tìm và chọn giảng viên hướng dẫn
        - Một nhóm có thể có nhiều người hướng dẫn
        
        Bước 4: Thêm thành viên
        - Tìm kiếm và thêm thành viên vào nhóm
        - Phân công nhiệm vụ cho từng thành viên
        
        Bước 5: Upload tài liệu
        - Quyết định thành lập nhóm
        - Đề cương nghiên cứu
        - Các tài liệu liên quan
        
        === QUẢN LÝ HỒ SƠ CÁ NHÂN ===
        - Vào "Hồ sơ" → "Thông tin cá nhân"
        - Cập nhật: Email, SĐT, Địa chỉ, Ngày sinh
        - Thêm thành tích NCKH:
          + Bài báo đã công bố
          + Đề tài đã tham gia
          + Hướng dẫn sinh viên
          + Các hoạt động NCKH khác
        
        === XEM THỐNG KÊ BÁO CÁO ===
        - Menu "Thống kê" → Chọn loại báo cáo
        - Lọc theo: Thời gian, Loại sự kiện, Người tham gia
        - Xuất báo cáo Excel: Nhấn nút "Xuất Excel"
        
        6. LIÊN HỆ HỖ TRỢ:
        - Email: 44444ace@gmail.com
        - Địa chỉ: Khoa Công nghệ Thông tin - Đại học Nông nghiệp Việt Nam
        - Trâu Quỳ, Gia Lâm, Hà Nội
        
        7. CÂU HỎI THƯỜNG GẶP:
        
        Q: Làm sao để reset mật khẩu?
        A: Vào trang đăng nhập → Nhấn "Quên mật khẩu" → Nhập email → Check email để lấy link reset
        
        Q: Tôi không thể tạo sự kiện?
        A: Bạn cần có quyền Cán bộ khoa trở lên (power ≤ 3). Liên hệ quản trị viên để được cấp quyền.
        
        Q: Làm sao để thêm tài liệu vào sự kiện?
        A: Vào chi tiết sự kiện → Phần "Tài liệu" → Nhấn "Upload" → Chọn loại tài liệu và file
        
        Q: Tôi có thể xóa sự kiện không?
        A: Chỉ người tạo sự kiện hoặc Trưởng/Phó khoa mới có quyền xóa sự kiện
        
        Q: Email mời không được gửi?
        A: Kiểm tra địa chỉ email khách mời có đúng không. Nếu vẫn lỗi, liên hệ admin.
        
        HÃY TRẢ LỜI CÂU HỎI CỦA NGƯỜI DÙNG:
        - Thân thiện, nhiệt tình
        - Chi tiết, có ví dụ cụ thể
        - Sử dụng tiếng Việt dễ hiểu
        - Format markdown: **in đậm**, *in nghiêng*, bullet points
        - Gợi ý thêm thông tin liên quan nếu cần
        - Nếu không biết chính xác, nói thẳng và gợi ý liên hệ admin
        """;

    public ChatResponse chat(String userMessage, String conversationId) {
        try {
            logger.info("Processing chat request. Message length: {}", userMessage.length());
            
            // Tạo hoặc lấy conversationId
            if (conversationId == null || conversationId.isEmpty()) {
                conversationId = UUID.randomUUID().toString();
                logger.info("Created new conversation ID: {}", conversationId);
            }

            // Lấy hoặc tạo history cho conversation
            JsonArray history = conversationHistory.computeIfAbsent(
                conversationId, 
                k -> new JsonArray()
            );

            // Thêm context hệ thống nếu là tin nhắn đầu tiên
            if (history.size() == 0) {
                logger.info("Adding system context to new conversation");
                JsonObject systemMessage = new JsonObject();
                JsonObject systemContent = new JsonObject();
                JsonArray systemParts = new JsonArray();
                JsonObject systemText = new JsonObject();
                systemText.addProperty("text", SYSTEM_CONTEXT);
                systemParts.add(systemText);
                systemContent.add("parts", systemParts);
                systemContent.addProperty("role", "user");
                history.add(systemContent);
            }

            // Thêm tin nhắn người dùng
            JsonObject userContent = new JsonObject();
            JsonArray userParts = new JsonArray();
            JsonObject userText = new JsonObject();
            userText.addProperty("text", userMessage);
            userParts.add(userText);
            userContent.add("parts", userParts);
            userContent.addProperty("role", "user");
            history.add(userContent);

            // Tạo request body
            JsonObject requestBody = new JsonObject();
            requestBody.add("contents", history);
            
            JsonObject generationConfig = new JsonObject();
            generationConfig.addProperty("temperature", 0.7);
            generationConfig.addProperty("maxOutputTokens", 2048);
            requestBody.add("generationConfig", generationConfig);

            // Gọi API
            String url = endpoint + model + ":generateContent?key=" + apiKey;
            logger.info("Calling Gemini API: {}", url.replace(apiKey, "***"));
            
            RequestBody body = RequestBody.create(
                requestBody.toString(),
                MediaType.parse("application/json")
            );

            Request request = new Request.Builder()
                    .url(url)
                    .post(body)
                    .build();

            try (Response response = client.newCall(request).execute()) {
                logger.info("Received response from Gemini API. Status: {}", response.code());
                
                if (!response.isSuccessful()) {
                    String errorBody = response.body() != null ? response.body().string() : "No error body";
                    logger.error("Gemini API error: {}", errorBody);
                    throw new IOException("Unexpected response: " + response.code() + " - " + errorBody);
                }

                String responseBody = response.body().string();
                JsonObject jsonResponse = gson.fromJson(responseBody, JsonObject.class);

                // Parse response
                String aiResponse = extractResponse(jsonResponse);
                logger.info("Successfully extracted AI response. Length: {}", aiResponse.length());

                // Thêm response của AI vào history
                JsonObject aiContent = new JsonObject();
                JsonArray aiParts = new JsonArray();
                JsonObject aiText = new JsonObject();
                aiText.addProperty("text", aiResponse);
                aiParts.add(aiText);
                aiContent.add("parts", aiParts);
                aiContent.addProperty("role", "model");
                history.add(aiContent);

                // Giới hạn history (chỉ giữ 20 tin nhắn gần nhất)
                if (history.size() > 20) {
                    JsonArray newHistory = new JsonArray();
                    for (int i = history.size() - 20; i < history.size(); i++) {
                        newHistory.add(history.get(i));
                    }
                    conversationHistory.put(conversationId, newHistory);
                }

                return ChatResponse.builder()
                        .response(aiResponse)
                        .conversationId(conversationId)
                        .timestamp(System.currentTimeMillis())
                        .build();
            }

        } catch (Exception e) {
            logger.error("Error in chat method: {}", e.getMessage(), e);
            throw new RuntimeException("Lỗi khi gọi Gemini API: " + e.getMessage(), e);
        }
    }

    private String extractResponse(JsonObject jsonResponse) {
        try {
            logger.debug("Extracting response from JSON");
            JsonArray candidates = jsonResponse.getAsJsonArray("candidates");
            if (candidates != null && candidates.size() > 0) {
                JsonObject candidate = candidates.get(0).getAsJsonObject();

                if (candidate.has("finishReason")) {
                    try {
                        logger.info("Gemini finishReason: {}", candidate.get("finishReason").getAsString());
                    } catch (Exception ignored) {
                        // ignore finishReason parsing
                    }
                }

                JsonObject content = candidate.getAsJsonObject("content");
                if (content == null) return "";

                JsonArray parts = content.getAsJsonArray("parts");
                if (parts == null || parts.size() == 0) return "";

                StringBuilder combined = new StringBuilder();
                for (int i = 0; i < parts.size(); i++) {
                    JsonObject part = parts.get(i).getAsJsonObject();
                    if (part == null || !part.has("text") || part.get("text").isJsonNull()) continue;
                    combined.append(part.get("text").getAsString());
                }

                String result = combined.toString().trim();
                if (!result.isEmpty()) {
                    return result;
                }
            }
        } catch (Exception e) {
            logger.error("Error extracting response from JSON: {}", e.getMessage(), e);
        }
        return "Xin lỗi, tôi không thể xử lý câu hỏi của bạn lúc này.";
    }

    public void clearConversation(String conversationId) {
        conversationHistory.remove(conversationId);
    }
}
