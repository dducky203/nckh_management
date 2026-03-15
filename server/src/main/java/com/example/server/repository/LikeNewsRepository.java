package com.example.server.repository;

import com.example.server.domain.LikeNews;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LikeNewsRepository extends JpaRepository<LikeNews, Integer> {
    Optional<LikeNews> findByIdUserAndIdNews(Integer idUser, Integer idNews);
    Integer countByIdNews(Integer idNews);

    boolean existsByIdUserAndIdNews(Integer idUser, Integer idNews);

//    List<LikeNews> findAllByIdNews(Integer newsId);

    List<LikeNews> findByIdNews(Integer newsId);
}

