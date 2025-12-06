package com.example.server.service;

import com.example.server.DTO.news.CreateCommentRequest;
import com.example.server.DTO.news.NewsCommentDTO;
import java.util.List;

public interface NewsCommentService {
    List<NewsCommentDTO> getCommentsByNewsId(Integer newsId);

    NewsCommentDTO createComment(CreateCommentRequest request, Integer userId);

    NewsCommentDTO updateComment(Integer commentId, String content, Integer userId);

    void deleteComment(Integer commentId, Integer userId);
}