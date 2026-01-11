package com.example.server.service;

import com.example.server.DTO.ChatResponse;
import com.example.server.utils.Constants;
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
            if (history.isEmpty()) {
                logger.info("Adding system context to new conversation");
                JsonObject systemMessage = new JsonObject();
                JsonObject systemContent = new JsonObject();
                JsonArray systemParts = new JsonArray();
                JsonObject systemText = new JsonObject();
                systemText.addProperty("text", Constants.SYSTEM_CONTEXT);
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

                assert response.body() != null;
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
            if (candidates != null && !candidates.isEmpty()) {
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
    }
}
