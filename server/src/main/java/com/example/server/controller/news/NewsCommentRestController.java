package com.example.server.controller.news;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.server.DTO.response.SuccessResponseDTO;
import com.example.server.DTO.news.CreateCommentRequest;
import com.example.server.DTO.news.NewsCommentDTO;
import com.example.server.service.NewsCommentService;
import com.example.server.utils.SecurityUtils;

@RestController
@RequestMapping("/public/news")
@CrossOrigin(origins = "*")
public class NewsCommentRestController {

    @Autowired
    private NewsCommentService commentService;

    @GetMapping("/{newsId}/comments")
    public ResponseEntity<?> getComments(@PathVariable Integer newsId) {
        try {
            List<NewsCommentDTO> comments = commentService.getCommentsByNewsId(newsId);
            return ResponseEntity.ok(
                    new SuccessResponseDTO<>(comments, "Lấy danh sách comment thành công"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Có lỗi xảy ra: " + e.getMessage());
        }
    }

    @PostMapping("/{newsId}/comments")
    public ResponseEntity<?> createComment(
            @PathVariable Integer newsId,
            @RequestBody CreateCommentRequest request) {
        try {
            // Lấy userId từ SecurityContext
            Integer userId = SecurityUtils.getCurrentUserId();
            if (userId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Vui lòng đăng nhập để comment");
            }
            NewsCommentDTO comment = commentService.createComment(request, userId);
            return ResponseEntity.ok(
                    new SuccessResponseDTO<>(comment, "Tạo comment thành công"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Có lỗi xảy ra: " + e.getMessage());
        }
    }

    @PutMapping("/comments/{commentId}")
    public ResponseEntity<?> updateComment(
            @PathVariable Integer commentId,
            @RequestBody CreateCommentRequest request) {
        try {
            Integer userId = SecurityUtils.getCurrentUserId();
            if (userId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Vui lòng đăng nhập");
            }

            NewsCommentDTO comment = commentService.updateComment(commentId, request.getContent(), userId);
            return ResponseEntity.ok(
                    new SuccessResponseDTO<>(comment, "Cập nhật comment thành công"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Có lỗi xảy ra: " + e.getMessage());
        }
    }

    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<?> deleteComment(@PathVariable Integer commentId) {
        try {
            Integer userId = SecurityUtils.getCurrentUserId();
            if (userId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Vui lòng đăng nhập");
            }

            commentService.deleteComment(commentId, userId);
            return ResponseEntity.ok(
                    new SuccessResponseDTO<>(null, "Xóa comment thành công"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Có lỗi xảy ra: " + e.getMessage());
        }
    }
}