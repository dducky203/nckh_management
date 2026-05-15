package com.example.server.service;

import java.io.IOException;
import java.time.Duration;
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
import com.google.gson.*;
import okhttp3.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class GeminiChatService {

    private static final Logger logger = LoggerFactory.getLogger(GeminiChatService.class);
    private static final int MAX_RETRIES = 3;
    private static final long INITIAL_WAIT_MS = 2000;

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

    @Autowired
    private ChatHistoryRepository chatHistoryRepository;

    @Autowired
    private UserRepository userRepository;

    private final Map<String, JsonArray> conversationHistory = new ConcurrentHashMap<>();

    public ChatResponse chat(String userMessage, String conversationId) {
        try {
            logger.info("Processing chat request. Message length: {}", userMessage.length());

            if (conversationId == null || conversationId.isEmpty()) {
                conversationId = UUID.randomUUID().toString();
            }

            JsonArray history = conversationHistory.computeIfAbsent(
                    conversationId,
                    k -> new JsonArray()
            );

            if (history.isEmpty()) {
                JsonObject systemContent = new JsonObject();
                JsonArray systemParts = new JsonArray();
                JsonObject systemText = new JsonObject();
                systemText.addProperty("text", Constants.SYSTEM_CONTEXT);
                systemParts.add(systemText);
                systemContent.add("parts", systemParts);
                systemContent.addProperty("role", "user");
                history.add(systemContent);
            }

            JsonObject userContent = new JsonObject();
            JsonArray userParts = new JsonArray();
            JsonObject userText = new JsonObject();
            userText.addProperty("text", userMessage);
            userParts.add(userText);
            userContent.add("parts", userParts);
            userContent.addProperty("role", "user");
            history.add(userContent);

            JsonObject requestBody = new JsonObject();
            requestBody.add("contents", history);

            JsonObject generationConfig = new JsonObject();
            generationConfig.addProperty("temperature", 0.7);
            generationConfig.addProperty("maxOutputTokens", 8192); // Tăng giới hạn token để tránh cắt chữ
            requestBody.add("generationConfig", generationConfig);

            String url = endpoint + model + ":generateContent?key=" + apiKey;

            RequestBody body = RequestBody.create(
                    requestBody.toString(),
                    MediaType.parse("application/json")
            );

            Request request = new Request.Builder()
                    .url(url)
                    .post(body)
                    .build();

            int retryCount = 0;
            long currentWaitTime = INITIAL_WAIT_MS;

            while (true) {
                try (Response response = client.newCall(request).execute()) {
                    if (response.isSuccessful()) {
                        assert response.body() != null;
                        String responseBody = response.body().string();
                        JsonObject jsonResponse = gson.fromJson(responseBody, JsonObject.class);

                        String aiResponse = extractResponse(jsonResponse);

                        JsonObject aiContent = new JsonObject();
                        JsonArray aiParts = new JsonArray();
                        JsonObject aiText = new JsonObject();
                        aiText.addProperty("text", aiResponse);
                        aiParts.add(aiText);
                        aiContent.add("parts", aiParts);
                        aiContent.addProperty("role", "model");
                        history.add(aiContent);

                        if (history.size() > 20) {
                            JsonArray newHistory = new JsonArray();
                            for (int i = history.size() - 20; i < history.size(); i++) {
                                newHistory.add(history.get(i));
                            }
                            conversationHistory.put(conversationId, newHistory);
                        }

                        // Lưu vào Database
                        Integer currentUserId = SecurityUtils.getCurrentUserId();
                        User user = null;
                        if (currentUserId != null) {
                            user = userRepository.findById(currentUserId).orElse(null);
                        }
                        ChatHistory chatHistory = ChatHistory.builder()
                                .user(user)
                                .conversationId(conversationId)
                                .userMessage(userMessage)
                                .botResponse(aiResponse)
                                .build();
                        chatHistoryRepository.save(chatHistory);

                        return ChatResponse.builder()
                                .response(aiResponse)
                                .conversationId(conversationId)
                                .timestamp(System.currentTimeMillis())
                                .build();
                    }

                    if ((response.code() == 503 || response.code() == 429) && retryCount < MAX_RETRIES) {
                        logger.warn("Gemini overloaded (Status {}). Retrying {}/{}...", response.code(), retryCount + 1, MAX_RETRIES);

                        try {
                            Thread.sleep(currentWaitTime);
                        } catch (InterruptedException ie) {
                            Thread.currentThread().interrupt();
                            throw new IOException("Interrupted during retry wait", ie);
                        }

                        currentWaitTime *= 2;
                        retryCount++;
                        continue;
                    }

                    String errorBody = response.body() != null ? response.body().string() : "No error body";
                    logger.error("Gemini API error: {}", errorBody);
                    throw new IOException("Unexpected response: " + response.code() + " - " + errorBody);
                }
            }

        } catch (Exception e) {
            logger.error("Error in chat method: {}", e.getMessage(), e);
            throw new RuntimeException("Lỗi khi gọi Gemini API: " + e.getMessage(), e);
        }
    }

    private String extractResponse(JsonObject jsonResponse) {
        try {
            JsonArray candidates = jsonResponse.getAsJsonArray("candidates");
            if (candidates != null && !candidates.isEmpty()) {
                JsonObject candidate = candidates.get(0).getAsJsonObject();

                JsonObject content = candidate.getAsJsonObject("content");
                if (content == null) return "";

                JsonArray parts = content.getAsJsonArray("parts");
                if (parts == null || parts.isEmpty()) return "";

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
        try {
            chatHistoryRepository.deleteByConversationId(conversationId);
        } catch (Exception e) {
            logger.error("Error deleting conversation history from DB: {}", e.getMessage());
        }
    }

    public String analyzeUserHistory(String historyText) {
        try {
            JsonObject userContent = new JsonObject();
            JsonArray userParts = new JsonArray();
            JsonObject userText = new JsonObject();
            userText.addProperty("text", 
                "Hãy đóng vai là một chuyên gia phân tích hành vi người dùng (UX Researcher) và quản trị hệ thống. Dưới đây là danh sách các câu hỏi mà một User đã gửi cho Chatbot của hệ thống Quản lý Nghiên cứu khoa học. " +
                "Nhiệm vụ của bạn là đọc và phân tích kỹ các câu hỏi này để rút ra kết luận: Người dùng này đang quan tâm đến chức năng nào? Họ đang gặp khó khăn, vướng mắc hay có sự nhầm lẫn gì khi sử dụng hệ thống? " +
                "BẮT BUỘC trả về duy nhất 1 object JSON hợp lệ có 2 key sau (không kèm markdown block):\n" +
                "{\n" +
                "  \"identifiedProblems\": \"Mô tả vấn đề đang gặp phải...\",\n" +
                "  \"suggestedSolutions\": \"Mô tả đề xuất giải pháp...\"\n" +
                "}\n\n" +
                "Lịch sử chat:\n" + historyText
            );
            userParts.add(userText);
            userContent.add("parts", userParts);
            userContent.addProperty("role", "user");

            JsonArray contents = new JsonArray();
            contents.add(userContent);

            JsonObject requestBody = new JsonObject();
            requestBody.add("contents", contents);

            JsonObject generationConfig = new JsonObject();
            generationConfig.addProperty("temperature", 0.5);
            generationConfig.addProperty("maxOutputTokens", 4096);
            requestBody.add("generationConfig", generationConfig);

            String url = endpoint + model + ":generateContent?key=" + apiKey;

            RequestBody body = RequestBody.create(
                    requestBody.toString(),
                    MediaType.parse("application/json")
            );

            Request request = new Request.Builder()
                    .url(url)
                    .post(body)
                    .build();

            try (Response response = client.newCall(request).execute()) {
                if (response.isSuccessful()) {
                    assert response.body() != null;
                    String responseBody = response.body().string();
                    JsonObject jsonResponse = gson.fromJson(responseBody, JsonObject.class);
                    return extractResponse(jsonResponse);
                }
                return "Không thể phân tích: " + response.code();
            }
        } catch (Exception e) {
            logger.error("Error analyzing user history: {}", e.getMessage(), e);
            return "Lỗi trong quá trình phân tích: " + e.getMessage();
        }
    }
}