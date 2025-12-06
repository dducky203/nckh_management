package com.example.server.DTO.news;

import lombok.Data;

@Data
public class CreateNewsRequest {
    private String title;
    private String content;
    private String author;
    private Integer status = 2; // Default: approved
}
