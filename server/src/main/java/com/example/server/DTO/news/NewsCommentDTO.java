package com.example.server.DTO.news;

import lombok.Data;
import java.util.Date;

@Data
public class NewsCommentDTO {
    private Integer id;
    private Integer newsId;
    private Integer userId;
    private String userName;
    private String userAvatar;
    private String content;
    private Date createdAt;
}