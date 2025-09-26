package com.example.server.repository;

import com.example.server.domain.News;
import com.example.server.domain.NewsComment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NewsCommentRepository extends JpaRepository<NewsComment, Integer> {
    List<NewsComment> findByIdNewsOrderByTimeDesc(News news);
}
