package com.example.server.repository;

import com.example.server.domain.News;
import com.example.server.domain.NewsImage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NewsImageRepository extends JpaRepository<NewsImage, Integer> {
    // get by idNews
    List<NewsImage> findNewsImageByIdNews(News idNews);
}
