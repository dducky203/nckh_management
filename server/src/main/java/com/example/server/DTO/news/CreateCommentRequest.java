package com.example.server.DTO.news;

import lombok.Data;

@Data
public class CreateCommentRequest {
    private Integer newsId;
    private String content;
}