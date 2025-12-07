package com.example.server.controller.user;

import com.example.server.domain.News;
import com.example.server.domain.NewsComment;
import com.example.server.domain.User;
import com.example.server.repository.NewsCommentRepository;
import com.example.server.repository.NewsRepository;
import com.example.server.repository.UserRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/comments")
public class NewsCommentController {

    @Autowired
    private NewsCommentRepository commentRepository;

    @Autowired
    private NewsRepository newsRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/{newsId}")
    public ResponseEntity<?> addComment(@PathVariable Integer newsId,
                                        @RequestParam String comment,
                                        HttpSession session) {
        User user = (User) session.getAttribute("saveUser");
        if (user == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        News news = newsRepository.findById(newsId).orElse(null);
        if (news == null) return ResponseEntity.notFound().build();

        NewsComment nc = new NewsComment();
        nc.setComment(comment);
        nc.setIdNews(news);
        nc.setIdUser(user);
        commentRepository.save(nc);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{newsId}")
    public List<Map<String, String>> getComments(@PathVariable Integer newsId) {
        News news = newsRepository.findById(newsId).orElse(null);
        if (news == null) return List.of();

        return commentRepository.findByIdNewsOrderByCreatedAtDesc(news).stream()
                .map(c -> Map.of(
                        "user", c.getIdUser().getName(),
                        "comment", c.getComment()
                ))
                .toList();
    }

}

