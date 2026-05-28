package com.example.server.DTO;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
public class SuccessResponseDTO <T>{
    private boolean success;
    private String message;
    private T data;
    private LocalDateTime timestamp;

    // Constructor cho trường hợp thành công với data
    public SuccessResponseDTO(T data, String message) {
        this.success = true;
        this.message = message;
        this.data = data;
        this.timestamp = LocalDateTime.now();
    }

    // Constructor cho trường hợp thành công không có data
    public SuccessResponseDTO(String message) {
        this.success = true;
        this.message = message;
        this.timestamp = LocalDateTime.now();
    }
}


