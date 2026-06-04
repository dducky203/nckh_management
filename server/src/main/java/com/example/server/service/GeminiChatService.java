package com.example.server.service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;

import com.example.server.domain.ChatHistory;
import com.example.server.domain.User;
import com.example.server.repository.ChatHistoryRepository;
import com.example.server.repository.UserRepository;
import com.example.server.utils.SecurityUtils;
import com.example.server.DTO.ChatResponse;
import com.example.server.utils.Constants;

import com.google.genai.Client;
import com.google.genai.types.*;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class GeminiChatService {

    private static final Logger logger = LoggerFactory.getLogger(GeminiChatService.class);
    private static final int MAX_HISTORY_TURNS = 20;

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.model}")
    private String model;

    private Client geminiClient;

    @Autowired
    private ChatHistoryRepository chatHistoryRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SystemKnowledgeService systemKnowledgeService;

    private final Map<String, List<Content>> conversationHistory = new ConcurrentHashMap<>();

    @PostConstruct
    private void init() {
        geminiClient = Client.builder()
                .apiKey(apiKey)
                .httpOptions(HttpOptions.builder()
                        .timeout(90_000)
                        .retryOptions(HttpRetryOptions.builder()
                                .attempts(3)
                                .httpStatusCodes(429, 503)
                                .build())
                        .build())
                .build();
    }

    public ChatResponse chat(String userMessage, String conversationId) {
        if (SecurityUtils.getCurrentUserId() == null) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Vui lòng đăng nhập để sử dụng trợ lý chat.");
        }
        try {
            logger.info("Processing chat request. Message length: {}", userMessage.length());

            if (conversationId == null || conversationId.isEmpty()) {
                conversationId = UUID.randomUUID().toString();
            }

            List<Content> history = conversationHistory.computeIfAbsent(
                    conversationId, k -> new ArrayList<>());

            if (history.isEmpty()) {
                history.add(Content.fromParts(Part.fromText(Constants.SYSTEM_CONTEXT)));
            }

            history.add(Content.fromParts(Part.fromText(userMessage)));

            Optional<String> localAnswer = systemKnowledgeService.answer(userMessage);
            if (localAnswer.isPresent()) {
                String responseText = localAnswer.get();
                appendModelResponse(history, responseText);
                saveChatHistory(conversationId, userMessage, responseText);
                return ChatResponse.builder()
                        .response(responseText)
                        .conversationId(conversationId)
                        .timestamp(System.currentTimeMillis())
                        .build();
            }

            GenerateContentConfig config = GenerateContentConfig.builder()
                    .temperature(0.7f)
                    .maxOutputTokens(8192)
                    .build();

            GenerateContentResponse response = geminiClient.models.generateContent(
                    model, history, config);

            String aiResponse = response.text();
            if (aiResponse == null || aiResponse.isBlank()) {
                aiResponse = "Xin lỗi, tôi không thể xử lý câu hỏi của bạn lúc này.";
            }

            appendModelResponse(history, aiResponse);
            saveChatHistory(conversationId, userMessage, aiResponse);

            return ChatResponse.builder()
                    .response(aiResponse)
                    .conversationId(conversationId)
                    .timestamp(System.currentTimeMillis())
                    .build();

        } catch (Exception e) {
            logger.error("Error in chat method: {}", e.getMessage(), e);
            throw new RuntimeException("Lỗi khi gọi Gemini API: " + e.getMessage(), e);
        }
    }

    public void clearConversation(String conversationId) {
        conversationHistory.remove(conversationId);
        try {
            chatHistoryRepository.deleteByConversationId(conversationId);
        } catch (Exception e) {
            logger.error("Error deleting conversation history from DB: {}", e.getMessage());
        }
    }

    public String analyzeUserHistory(String historyText) {
        try {
            String prompt = "Hãy đóng vai là một chuyên gia phân tích hành vi người dùng (UX Researcher) và quản trị hệ thống. "
                    + "Dưới đây là danh sách các câu hỏi mà một User đã gửi cho "
                    + Constants.CHAT_ASSISTANT_DISPLAY_NAME
                    + " (vai trò: " + Constants.CHAT_ASSISTANT_ROLE + ") của hệ thống Quản lý Nghiên cứu khoa học. "
                    + "Nhiệm vụ của bạn là đọc và phân tích kỹ các câu hỏi này để rút ra kết luận: "
                    + "Người dùng này đang quan tâm đến chức năng nào? Họ đang gặp khó khăn, vướng mắc hay có sự nhầm lẫn gì khi sử dụng hệ thống?\n\n"
                    + "Lịch sử chat:\n" + historyText;

            Schema schema = Schema.builder()
                    .type(Type.Known.OBJECT)
                    .properties(Map.of(
                            "identifiedProblems", Schema.builder().type(Type.Known.STRING)
                                    .description("Mô tả vấn đề đang gặp phải").build(),
                            "suggestedSolutions", Schema.builder().type(Type.Known.STRING)
                                    .description("Mô tả đề xuất giải pháp").build()))
                    .required(List.of("identifiedProblems", "suggestedSolutions"))
                    .build();

            GenerateContentConfig config = GenerateContentConfig.builder()
                    .temperature(0.5f)
                    .maxOutputTokens(4096)
                    .responseMimeType("application/json")
                    .responseSchema(schema)
                    .build();

            GenerateContentResponse response = geminiClient.models.generateContent(
                    model, prompt, config);

            String text = response.text();
            return (text != null && !text.isBlank()) ? text : "Không thể phân tích lịch sử.";

        } catch (Exception e) {
            logger.error("Error analyzing user history: {}", e.getMessage(), e);
            return "Lỗi trong quá trình phân tích: " + e.getMessage();
        }
    }

    /**
     * Phân tích tổng hợp toàn bộ lịch sử chat của TẤT CẢ người dùng.
     * Mục tiêu: tìm ra xu hướng, chủ đề phổ biến, vấn đề đa số gặp phải.
     */
    public String analyzeAllUsersHistory(String historyText, int totalMessages, int totalUsers) {
        try {
            String prompt = "Bạn là một chuyên gia phân tích dữ liệu người dùng (Data Analyst) và quản trị hệ thống thông tin học thuật. "
                    + "Dưới đây là tổng hợp lịch sử chat của " + totalUsers + " người dùng ("
                    + totalMessages + " tin nhắn) với "
                    + Constants.CHAT_ASSISTANT_DISPLAY_NAME
                    + " — chatbot của hệ thống Quản lý Nghiên cứu Khoa học. "
                    + "Nhiệm vụ của bạn là phân tích toàn bộ để trả lời: "
                    + "Đa số người dùng đang hỏi về điều gì? Chức năng nào được quan tâm nhiều nhất? "
                    + "Vấn đề / nỗi đau phổ biến nhất là gì? Hệ thống cần cải thiện điều gì? "
                    + "Hãy đưa ra nhận định dựa trên dữ liệu, súc tích và có thể hành động được (actionable insights).\n\n"
                    + "Dữ liệu chat tổng hợp:\n" + historyText;

            Schema schema = Schema.builder()
                    .type(Type.Known.OBJECT)
                    .properties(Map.of(
                            "topTopics", Schema.builder().type(Type.Known.STRING)
                                    .description("Các chủ đề / chức năng được hỏi nhiều nhất (liệt kê theo thứ tự ưu tiên)").build(),
                            "commonPainPoints", Schema.builder().type(Type.Known.STRING)
                                    .description("Vấn đề / khó khăn phổ biến nhất mà đa số người dùng gặp phải").build(),
                            "topQuestions", Schema.builder().type(Type.Known.STRING)
                                    .description("Các câu hỏi điển hình được đặt ra nhiều nhất (trích dẫn hoặc tổng hợp)").build(),
                            "usageTrends", Schema.builder().type(Type.Known.STRING)
                                    .description("Xu hướng sử dụng hệ thống, thói quen và mẫu hành vi nổi bật").build(),
                            "systemRecommendations", Schema.builder().type(Type.Known.STRING)
                                    .description("Đề xuất cải thiện hệ thống dựa trên dữ liệu: tính năng cần thêm, UX cần cải thiện, tài liệu cần bổ sung").build()
                    ))
                    .required(List.of("topTopics", "commonPainPoints", "topQuestions", "usageTrends", "systemRecommendations"))
                    .build();

            GenerateContentConfig config = GenerateContentConfig.builder()
                    .temperature(0.4f)
                    .maxOutputTokens(8192)
                    .responseMimeType("application/json")
                    .responseSchema(schema)
                    .build();

            GenerateContentResponse response = geminiClient.models.generateContent(model, prompt, config);
            String text = response.text();
            return (text != null && !text.isBlank()) ? text : "Không thể phân tích tổng quan.";

        } catch (Exception e) {
            logger.error("Error analyzing all users history: {}", e.getMessage(), e);
            return "Lỗi trong quá trình phân tích: " + e.getMessage();
        }
    }

    private void appendModelResponse(List<Content> history, String responseText) {
        Content modelContent = Content.builder()
                .role("model")
                .parts(Part.fromText(responseText))
                .build();
        history.add(modelContent);

        while (history.size() > MAX_HISTORY_TURNS) {
            history.remove(0);
        }
    }

    private void saveChatHistory(String conversationId, String userMessage, String botResponse) {
        Integer currentUserId = SecurityUtils.getCurrentUserId();
        User user = null;
        if (currentUserId != null) {
            user = userRepository.findById(currentUserId).orElse(null);
        }
        ChatHistory chatHistory = ChatHistory.builder()
                .user(user)
                .conversationId(conversationId)
                .userMessage(userMessage)
                .botResponse(botResponse)
                .build();
        chatHistoryRepository.save(chatHistory);
    }
}
