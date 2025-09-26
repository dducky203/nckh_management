package com.example.server.repository;


import com.example.server.domain.News;
import com.example.server.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NewsRepository extends JpaRepository<News, Integer> {
    // your news
    List<News> findByUser(User user);
}
