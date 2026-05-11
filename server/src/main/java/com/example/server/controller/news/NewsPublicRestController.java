package com.example.server.controller.news;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.server.DTO.SuccessResponseDTO;
import com.example.server.DTO.news.NewsDTO;
import com.example.server.service.NewsService;

@RestController
@RequestMapping("/public/news")
@CrossOrigin(origins = "*")
public class NewsPublicRestController {

    @Autowired
    private NewsService newsService;

    @GetMapping
    public ResponseEntity<?> getNews(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        try {
            Map<String, Object> response = newsService.getNewsWithPagination(search, page, size);
            return ResponseEntity.ok(
                    new SuccessResponseDTO<>(response, "Lấy danh sách tin tức thành công"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Có lỗi xảy ra: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getNewsById(@PathVariable Integer id) {
        try {
            NewsDTO news = newsService.getNewsById(id);
            return ResponseEntity.ok(
                    new SuccessResponseDTO<>(news, "Lấy chi tiết tin tức thành công"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Có lỗi xảy ra: " + e.getMessage());
        }
    }
}