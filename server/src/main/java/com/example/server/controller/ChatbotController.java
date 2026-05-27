package com.example.server.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.server.DTO.ChatResponse;
import com.example.server.DTO.request.ChatRequest;
import com.example.server.service.GeminiChatService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/public/chatbot")
@CrossOrigin(origins = "*")
public class ChatbotController {

    private static final Logger logger = LoggerFactory.getLogger(ChatbotController.class);

    @Autowired
    private GeminiChatService geminiChatService;

   
    @PostMapping("/chat")
    public ResponseEntity<ChatResponse> chat(@Valid @RequestBody ChatRequest request) {
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
        geminiChatService.clearConversation(conversationId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("Chatbot service is running");
    }
}
