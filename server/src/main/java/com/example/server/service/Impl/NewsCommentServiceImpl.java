package com.example.server.service.Impl;

import com.example.server.DTO.news.CreateCommentRequest;
import com.example.server.DTO.news.NewsCommentDTO;
import com.example.server.domain.News;
import com.example.server.domain.NewsComment;
import com.example.server.domain.User;
import com.example.server.repository.NewsCommentRepository;
import com.example.server.repository.NewsRepository;
import com.example.server.repository.UserRepository;
import com.example.server.service.NewsCommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class NewsCommentServiceImpl implements NewsCommentService {

    @Autowired
    private NewsCommentRepository commentRepository;

    @Autowired
    private NewsRepository newsRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public List<NewsCommentDTO> getCommentsByNewsId(Integer newsId) {
        News news = newsRepository.findById(newsId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tin tức"));

        List<NewsComment> comments = commentRepository.findByIdNewsOrderByCreatedAtDesc(news);

        return comments.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public NewsCommentDTO createComment(CreateCommentRequest request, Integer userId) {
        News news = newsRepository.findById(request.getNewsId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tin tức"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        NewsComment comment = new NewsComment();
        comment.setIdNews(news);
        comment.setIdUser(user);
        comment.setComment(request.getContent());

        NewsComment savedComment = commentRepository.save(comment);
        return mapToDTO(savedComment);
    }

    @Override
    public NewsCommentDTO updateComment(Integer commentId, String content, Integer userId) {
        NewsComment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy comment"));

        User currentUser = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        // Kiểm tra quyền: chỉ cho phép chỉnh sửa comment của chính mình hoặc admin
        boolean isOwner = comment.getIdUser().getId().equals(userId);
        boolean isAdmin = currentUser.getIdRole() != null && 
                         "ADMIN".equalsIgnoreCase(currentUser.getIdRole().getName());
        
        if (!isOwner && !isAdmin) {
            throw new RuntimeException("Bạn không có quyền sửa comment này");
        }

        comment.setComment(content);
        NewsComment updatedComment = commentRepository.save(comment);
        return mapToDTO(updatedComment);
    }

    @Override
    public void deleteComment(Integer commentId, Integer userId) {
        NewsComment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy comment"));

        User currentUser = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        // Kiểm tra quyền: chỉ cho phép xóa comment của chính mình hoặc admin
        boolean isOwner = comment.getIdUser().getId().equals(userId);
        boolean isAdmin = currentUser.getIdRole() != null && 
                         "ADMIN".equalsIgnoreCase(currentUser.getIdRole().getName());
        
        if (!isOwner && !isAdmin) {
            throw new RuntimeException("Bạn không có quyền xóa comment này");
        }

        commentRepository.delete(comment);
    }

    private NewsCommentDTO mapToDTO(NewsComment comment) {
        NewsCommentDTO dto = new NewsCommentDTO();
        dto.setId(comment.getId());
        dto.setNewsId(comment.getIdNews().getId());
        dto.setUserId(comment.getIdUser().getId());
        dto.setUserName(comment.getIdUser().getName());
        dto.setUserAvatar(comment.getIdUser().getAvatar());
        dto.setContent(comment.getComment());
        dto.setCreatedAt(comment.getCreatedAt());
        dto.setUpdatedAt(comment.getUpdatedAt());
        return dto;
    }
}