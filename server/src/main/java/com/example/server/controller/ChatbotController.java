package com.example.server.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.server.DTO.ChatResponse;
import com.example.server.DTO.request.ChatRequest;
import com.example.server.service.GeminiChatService;
import com.example.server.utils.SecurityUtils;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/chatbot")
@CrossOrigin(origins = "*")
public class ChatbotController {

    private static final Logger logger = LoggerFactory.getLogger(ChatbotController.class);

    private final GeminiChatService geminiChatService;

    public ChatbotController(GeminiChatService geminiChatService) {
        this.geminiChatService = geminiChatService;
    }

    @PostMapping("/chat")
    public ResponseEntity<ChatResponse> chat(@Valid @RequestBody ChatRequest request) {
        if (SecurityUtils.getCurrentUserId() == null) {
            return unauthorizedChatResponse();
        }
        try {
            logger.info("Received chat request: {}", request.getMessage());
            ChatResponse response = geminiChatService.chat(
                request.getMessage(),
                request.getConversationId()
            );
            logger.info("Chat response generated successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error processing chat request: {}", e.getMessage(), e);
            return ResponseEntity.status(500)
                .body(ChatResponse.builder()
                    .response("Xin lỗi, đã có lỗi xảy ra: " + e.getMessage())
                    .timestamp(System.currentTimeMillis())
                    .build());
        }
    }

    @DeleteMapping("/conversation/{conversationId}")
    public ResponseEntity<Void> clearConversation(@PathVariable String conversationId) {
        if (SecurityUtils.getCurrentUserId() == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        geminiChatService.clearConversation(conversationId);
        return ResponseEntity.ok().build();
    }

    private ResponseEntity<ChatResponse> unauthorizedChatResponse() {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ChatResponse.builder()
                        .response("Vui lòng đăng nhập để sử dụng trợ lý chat.")
                        .timestamp(System.currentTimeMillis())
                        .build());
    }

    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("Chatbot service is running");
    }
}
