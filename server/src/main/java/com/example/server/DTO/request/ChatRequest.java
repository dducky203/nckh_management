package com.example.server.DTO.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatRequest {
    
    @NotBlank(message = "Tin nhắn không được để trống")
    private String message;
    
    private String conversationId; // Để theo dõi cuộc hội thoại
}
