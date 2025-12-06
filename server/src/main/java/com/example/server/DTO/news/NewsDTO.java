package com.example.server.DTO.news;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.Date;

@Data
public class NewsDTO {
    private Integer id;
    private String title;
    private String content;
    private String summary;
    private LocalDateTime time;
    private Date createdAt;
    private String author;
    private Integer authorId;
    private Integer status;
}