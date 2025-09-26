package com.example.server.controller.user;

import com.example.server.domain.LikeNews;
import com.example.server.domain.User;
import com.example.server.repository.LikeNewsRepository;
import com.example.server.repository.UserRepository;
import com.example.server.service.LikeNewsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/likes")
public class LikeNewsController {

    @Autowired
    private LikeNewsRepository likeNewsRepository;
    @Autowired
    LikeNewsService likeNewsService;
    @Autowired
    UserRepository userRepository;
    @Autowired
    LikeNewsService likeService;


    @PostMapping("/{userId}/{newsId}")
    @ResponseBody
    public Map<String, Object> toggleLike(@PathVariable Integer userId, @PathVariable Integer newsId) {
        Optional<LikeNews> existingLike = likeNewsRepository.findByIdUserAndIdNews(userId, newsId);

        boolean userLiked;
        if (existingLike.isPresent()) {
            likeNewsRepository.delete(existingLike.get());
            userLiked = false;
        } else {
            LikeNews newLike = new LikeNews();
            newLike.setIdUser(userId);
            newLike.setIdNews(newsId);
            newLike.setTime(LocalDateTime.now());
            likeNewsRepository.save(newLike);
            userLiked = true;
        }

        int likeCount = (int) likeNewsRepository.countByIdNews(newsId);

        Map<String, Object> result = new HashMap<>();
        result.put("likeCount", likeCount);
        result.put("userLiked", userLiked);
        return result;
    }

    @GetMapping("/users/{newsId}")
    public ResponseEntity<List<Map<String, Object>>> getUsersLiked(@PathVariable Integer newsId) {
        List<LikeNews> likes = likeNewsRepository.findByIdNews(newsId);
        List<Map<String, Object>> users = new ArrayList<>();

        for (LikeNews like : likes) {
            User user = userRepository.findById(like.getIdUser()).orElse(null);
            if (user != null) {
                Map<String, Object> u = new HashMap<>();
                u.put("id", user.getId());
                u.put("name", user.getName()); // đổi nếu dùng username
                users.add(u);
            }
        }

        return ResponseEntity.ok(users);
    }


}

