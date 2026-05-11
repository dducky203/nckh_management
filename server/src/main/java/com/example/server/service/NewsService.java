package com.example.server.service;

import java.util.Map;

import com.example.server.DTO.news.CreateNewsRequest;
import com.example.server.DTO.news.NewsDTO;

public interface NewsService {
    Map<String, Object> getNewsWithPagination(String search, int page, int size);

    NewsDTO getNewsById(Integer id);

    NewsDTO createNews(CreateNewsRequest request, Integer userId);

    NewsDTO updateNews(Integer newsId, CreateNewsRequest request, Integer userId);

    void deleteNews(Integer newsId, Integer userId);
}