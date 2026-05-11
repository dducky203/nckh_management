package com.example.server.service;

import java.io.IOException;
import java.time.Duration;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.example.server.DTO.ChatResponse;
import com.example.server.utils.Constants;
import com.google.gson.*;

import okhttp3.*;

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
            generationConfig.addProperty("maxOutputTokens", 2048);
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
    }
}