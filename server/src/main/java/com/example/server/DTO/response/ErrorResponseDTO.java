package com.example.server.DTO;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ErrorResponseDTO {
    private boolean success;
    private String message;
    private LocalDateTime timestamp;

    public ErrorResponseDTO(String message) {
        this.success = false;
        this.message = message;
        this.timestamp = LocalDateTime.now();
    }

}
