package com.example.server.controller.news;

import com.example.server.DTO.SuccessResponseDTO;
import com.example.server.DTO.news.CreateNewsRequest;
import com.example.server.DTO.news.NewsDTO;
import com.example.server.service.NewsService;
import com.example.server.utils.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/news")
@CrossOrigin(origins = "*")
public class NewsAdminRestController {

    @Autowired
    private NewsService newsService;

    @PostMapping
    public ResponseEntity<?> createNews(@RequestBody CreateNewsRequest request) {
        try {
            Integer userId = SecurityUtils.getCurrentUserId();
            if (userId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Vui lòng đăng nhập");
            }

            NewsDTO news = newsService.createNews(request, userId);
            return ResponseEntity.ok(
                    new SuccessResponseDTO<>(news, "Tạo tin tức thành công"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Có lỗi xảy ra: " + e.getMessage());
        }
    }

    @PutMapping("/{newsId}")
    public ResponseEntity<?> updateNews(
            @PathVariable Integer newsId,
            @RequestBody CreateNewsRequest request) {
        try {
            Integer userId = SecurityUtils.getCurrentUserId();
            if (userId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Vui lòng đăng nhập");
            }

            NewsDTO news = newsService.updateNews(newsId, request, userId);
            return ResponseEntity.ok(
                    new SuccessResponseDTO<>(news, "Cập nhật tin tức thành công"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Có lỗi xảy ra: " + e.getMessage());
        }
    }

    @DeleteMapping("/{newsId}")
    public ResponseEntity<?> deleteNews(@PathVariable Integer newsId) {
        try {
            Integer userId = SecurityUtils.getCurrentUserId();
            if (userId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Vui lòng đăng nhập");
            }

            newsService.deleteNews(newsId, userId);
            return ResponseEntity.ok(
                    new SuccessResponseDTO<>(null, "Xóa tin tức thành công"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Có lỗi xảy ra: " + e.getMessage());
        }
    }
}
