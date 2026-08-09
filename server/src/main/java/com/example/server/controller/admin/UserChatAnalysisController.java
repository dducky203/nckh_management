package com.example.server.controller.admin;

import com.example.server.DTO.response.SuccessResponseDTO;
import com.example.server.domain.ChatHistory;
import com.example.server.domain.User;
import com.example.server.repository.ChatHistoryRepository;
import com.example.server.service.GeminiChatService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Controller phân tích hành vi người dùng dựa trên lịch sử chat với chatbot AI.
 */
@RestController
@RequestMapping("/v1/admin/chat-analysis")
@CrossOrigin(origins = "*")
public class UserChatAnalysisController {

    private static final Logger logger =  LoggerFactory.getLogger(UserChatAnalysisController.class);

    private final ChatHistoryRepository chatHistoryRepository;
    private final GeminiChatService geminiChatService;
    private final ObjectMapper objectMapper;

    public UserChatAnalysisController(
            ChatHistoryRepository chatHistoryRepository,
            GeminiChatService geminiChatService,
            ObjectMapper objectMapper) {
        this.chatHistoryRepository = chatHistoryRepository;
        this.geminiChatService = geminiChatService;
        this.objectMapper = objectMapper;
    }

    /**
     * Lấy danh sách user đã từng chat
     */
    @GetMapping("/users")
    public ResponseEntity<?> getUsersWithChatHistory(
            @RequestParam(required = false, defaultValue = "") String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        try {
            Pageable pageable = PageRequest.of(page, size);

            Page<User> userPage =
                    chatHistoryRepository.findDistinctUsersWithChatHistory(
                            search.isBlank() ? null : search.trim(),
                            pageable
                    );

            List<Map<String, Object>> users =
                    userPage.getContent()
                            .stream()
                            .map(user -> {

                                Map<String, Object> dto = new HashMap<>();

                                dto.put("id", user.getId());
                                dto.put("name", user.getName());
                                dto.put("username", user.getUsername());
                                dto.put("avatar", user.getAvatar());

                                dto.put(
                                        "totalMessages",
                                        chatHistoryRepository.countByUser_Id(user.getId())
                                );

                                dto.put(
                                        "role",
                                        user.getIdRole() != null
                                                ? user.getIdRole().getName()
                                                : null
                                );

                                dto.put(
                                        "title",
                                        user.getIdTitle() != null
                                                ? user.getIdTitle().getName()
                                                : null
                                );

                                return dto;
                            })
                            .collect(Collectors.toList());

            Map<String, Object> response = new HashMap<>();
            response.put("users", users);
            response.put("currentPage", userPage.getNumber());
            response.put("totalPages", userPage.getTotalPages());
            response.put("totalItems", userPage.getTotalElements());

            return ResponseEntity.ok(
                    new SuccessResponseDTO<>(
                            response,
                            "Lấy danh sách người dùng có lịch sử chat thành công"
                    )
            );

        } catch (Exception e) {

            logger.error(
                    "Error fetching users with chat history",
                    e
            );

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Có lỗi xảy ra: " + e.getMessage());
        }
    }

    private static final int CHAT_HISTORY_MAX_PAGE_SIZE = 100;

    /**
     * Lấy lịch sử chat của user (phân trang server).
     * page 0 = khối tin mới nhất; trong mỗi trang, history sắp cũ → mới để hiển thị chat.
     */
    @GetMapping("/users/{userId}/history")
    public ResponseEntity<?> getUserChatHistory(
            @PathVariable Integer userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size) {

        try {

            int safeSize = Math.max(1, Math.min(size, CHAT_HISTORY_MAX_PAGE_SIZE));
            int safePage = Math.max(0, page);

            Pageable pageable =
                    PageRequest.of(
                            safePage,
                            safeSize,
                            Sort.by("createdAt").descending()
                    );

            Page<ChatHistory> historyPage =
                    chatHistoryRepository.findByUser_IdOrderByCreatedAtDesc(
                            userId,
                            pageable
                    );

            List<Map<String, Object>> history =
                    historyPage.getContent()
                            .stream()
                            .map(ch -> {

                                Map<String, Object> item =
                                        new HashMap<>();

                                item.put("id", ch.getId());
                                item.put("conversationId", ch.getConversationId());
                                item.put("userMessage", ch.getUserMessage());
                                item.put("botResponse", ch.getBotResponse());
                                item.put("createdAt", ch.getCreatedAt());

                                return item;
                            })
                            .collect(Collectors.toList());

            // Trang lấy theo DESC; đảo trong trang để UI đọc từ trên xuống (cũ → mới).
            Collections.reverse(history);

            Map<String, Object> response = new HashMap<>();
            response.put("history", history);
            response.put("currentPage", historyPage.getNumber());
            response.put("totalPages", historyPage.getTotalPages());
            response.put("totalItems", historyPage.getTotalElements());
            response.put("pageSize", safeSize);
            response.put("itemsInPage", history.size());
            response.put("hasNext", historyPage.hasNext());
            response.put("hasPrevious", historyPage.hasPrevious());

            return ResponseEntity.ok(
                    new SuccessResponseDTO<>(
                            response,
                            "Lấy lịch sử chat thành công"
                    )
            );

        } catch (Exception e) {

            logger.error(
                    "Error fetching chat history for userId {}",
                    userId,
                    e
            );

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Có lỗi xảy ra: " + e.getMessage());
        }
    }

    /**
     * Phân tích chat của 1 user
     */
    @PostMapping("/users/{userId}/analyze")
    public ResponseEntity<?> analyzeUserChatHistory(
            @PathVariable Integer userId) {

        try {

            List<ChatHistory> allHistory =
                    chatHistoryRepository
                            .findByUser_IdOrderByCreatedAtDesc(userId);

            if (allHistory.isEmpty()) {

                Map<String, Object> result = new HashMap<>();
                result.put(
                        "identifiedProblems",
                        "Người dùng chưa có lịch sử chat."
                );
                result.put(
                        "suggestedSolutions",
                        "Không có dữ liệu để phân tích."
                );

                return ResponseEntity.ok(
                        new SuccessResponseDTO<>(
                                result,
                                "Không có lịch sử chat"
                        )
                );
            }

            StringBuilder historyText = new StringBuilder();

            int limit = Math.min(allHistory.size(), 100);

            for (int i = 0; i < limit; i++) {

                ChatHistory ch = allHistory.get(i);

                historyText.append("Người dùng: ")
                        .append(
                                ch.getUserMessage() == null
                                        ? ""
                                        : ch.getUserMessage()
                        )
                        .append("\n");

                historyText.append("Bot: ")
                        .append(
                                ch.getBotResponse() == null
                                        ? ""
                                        : ch.getBotResponse()
                        )
                        .append("\n\n");
            }

            String rawAnalysis =
                    geminiChatService.analyzeUserHistory(
                            historyText.toString()
                    );

            rawAnalysis = cleanGeminiJson(rawAnalysis);

            Map<String, Object> analysisResult =
                    objectMapper.readValue(
                            rawAnalysis,
                            new TypeReference<Map<String, Object>>() {
                            }
                    );

            return ResponseEntity.ok(
                    new SuccessResponseDTO<>(
                            analysisResult,
                            "Phân tích lịch sử chat thành công"
                    )
            );

        } catch (JsonProcessingException e) {

            logger.error(
                    "Gemini returned invalid JSON for user {}",
                    userId,
                    e
            );

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Gemini trả về JSON không hợp lệ");

        } catch (Exception e) {

            logger.error(
                    "Error analyzing chat history for userId {}",
                    userId,
                    e
            );

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Có lỗi xảy ra khi phân tích: " + e.getMessage());
        }
    }

    /**
     * Phân tích toàn bộ hệ thống
     */
    @PostMapping("/analyze-all")
    public ResponseEntity<?> analyzeAllUsersChatHistory() {

        try {

            int sampleLimit = 500;

            Pageable pageable =
                    PageRequest.of(0, sampleLimit);

            List<ChatHistory> sample =
                    chatHistoryRepository
                            .findRecentMessagesForGlobalAnalysis(
                                    pageable
                            );

            long totalMessages =
                    chatHistoryRepository.countAllUserMessages();

            long totalUsers =
                    chatHistoryRepository
                            .countDistinctUsersWithChatHistory();

            if (sample.isEmpty()) {

                Map<String, Object> emptyResult =
                        new HashMap<>();

                emptyResult.put(
                        "topTopics",
                        "Chưa có dữ liệu chat."
                );

                emptyResult.put(
                        "commonPainPoints",
                        "Không có dữ liệu."
                );

                emptyResult.put(
                        "topQuestions",
                        "Không có dữ liệu."
                );

                emptyResult.put(
                        "usageTrends",
                        "Không có dữ liệu."
                );

                emptyResult.put(
                        "systemRecommendations",
                        "Cần thu thập thêm dữ liệu."
                );

                return ResponseEntity.ok(
                        new SuccessResponseDTO<>(
                                emptyResult,
                                "Chưa có dữ liệu chat"
                        )
                );
            }

            StringBuilder historyText =
                    new StringBuilder();

            for (ChatHistory ch : sample) {

                if (ch.getUserMessage() != null
                        && !ch.getUserMessage().isBlank()) {

                    historyText.append("- ")
                            .append(ch.getUserMessage().trim())
                            .append("\n");
                }
            }

            String rawAnalysis =
                    geminiChatService.analyzeAllUsersHistory(
                            historyText.toString(),
                            (int) totalMessages,
                            (int) totalUsers
                    );

            rawAnalysis = cleanGeminiJson(rawAnalysis);

            Map<String, Object> analysisResult =
                    objectMapper.readValue(
                            rawAnalysis,
                            new TypeReference<Map<String, Object>>() {
                            }
                    );

            Map<String, Object> finalResult =
                    new HashMap<>(analysisResult);

            finalResult.put(
                    "totalMessages",
                    totalMessages
            );

            finalResult.put(
                    "totalUsers",
                    totalUsers
            );

            finalResult.put(
                    "analyzedSample",
                    sample.size()
            );

            return ResponseEntity.ok(
                    new SuccessResponseDTO<>(
                            finalResult,
                            "Phân tích tổng quan hệ thống thành công"
                    )
            );

        } catch (JsonProcessingException e) {

            logger.error(
                    "Gemini returned invalid JSON",
                    e
            );

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Gemini trả về JSON không hợp lệ");

        } catch (Exception e) {

            logger.error(
                    "Error analyzing all users chat history",
                    e
            );

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Có lỗi xảy ra khi phân tích: " + e.getMessage());
        }
    }

    /**
     * Xử lý JSON Gemini trả về dạng markdown
     */
    private String cleanGeminiJson(String json) {

        if (json == null) {
            return "{}";
        }

        return json
                .replace("```json", "")
                .replace("```", "")
                .trim();
    }
}