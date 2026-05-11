package com.example.server.service;

import java.time.LocalDateTime;
import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.server.domain.LikeNews;
import com.example.server.repository.LikeNewsRepository;
import com.example.server.repository.NewsRepository;

@Service
public class LikeNewsService {

    @Autowired
    private LikeNewsRepository likeNewsRepository;

    @Autowired
    private NewsRepository newsRepository;

//    public int toggleLike(Integer userId, Integer newsId) {
//        // Kiểm tra xem đã like hay chưa
//        Optional<LikeNews> existingLike = likeNewsRepository.findByIdUserAndIdNews(userId, newsId);
//
//        if (existingLike.isPresent()) {
//            // Nếu đã like, thì xóa like (Unlike)
//            likeNewsRepository.delete(existingLike.get());
//        } else {
//            // Nếu chưa like, thì thêm mới
//            LikeNews newLike = new LikeNews();
//            newLike.setIdUser(userId);
//            newLike.setIdNews(newsId);
//            newLike.setTime(LocalDateTime.now());
//
//            likeNewsRepository.save(newLike);
//        }
//
//        // Trả về tổng số like mới nhất cho bài viết
//        return (int) likeNewsRepository.countByIdNews(newsId);
//    }
public Map<String, Object> toggleLike(Integer userId, Integer newsId) {
    Map<String, Object> result = new HashMap<>();
    boolean liked;

    Optional<LikeNews> existingLike = likeNewsRepository.findByIdUserAndIdNews(userId, newsId);

    if (existingLike.isPresent()) {
        likeNewsRepository.delete(existingLike.get());
        liked = false;
    } else {
        LikeNews newLike = new LikeNews();
        newLike.setIdUser(userId);
        newLike.setIdNews(newsId);
        newLike.setTime(LocalDateTime.now());

        likeNewsRepository.save(newLike);
        liked = true;
    }

    int likeCount = (int) likeNewsRepository.countByIdNews(newsId);

    result.put("liked", liked);
    result.put("likeCount", likeCount);
    return result;
}

}
