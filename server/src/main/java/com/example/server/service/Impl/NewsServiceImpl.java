package com.example.server.service.Impl;

import com.example.server.DTO.news.CreateNewsRequest;
import com.example.server.DTO.news.NewsDTO;
import com.example.server.domain.News;
import com.example.server.domain.User;
import com.example.server.repository.NewsRepository;
import com.example.server.repository.UserRepository;
import com.example.server.service.NewsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class NewsServiceImpl implements NewsService {
    
    private NewsRepository newsRepository;
    private UserRepository userRepository;

    @Override
    public Map<String, Object> getNewsWithPagination(String search, int page, int size) {
        // Lấy tất cả news có status = 2 (approved)
        List<News> allNews = newsRepository.findAll().stream()
                .filter(news -> news.getStatus() != null && news.getStatus() == 2)
                .collect(Collectors.toList());

        // Filter theo search term
        if (search != null && !search.trim().isEmpty()) {
            String searchLower = search.toLowerCase();
            allNews = allNews.stream()
                    .filter(news -> (news.getTitle() != null && news.getTitle().toLowerCase().contains(searchLower)) ||
                            (news.getContent() != null && news.getContent().toLowerCase().contains(searchLower)))
                    .collect(Collectors.toList());
        }

        // Sắp xếp theo thời gian tạo mới nhất
        allNews.sort((n1, n2) -> {
            if (n1.getCreatedAt() == null)
                return 1;
            if (n2.getCreatedAt() == null)
                return -1;
            return n2.getCreatedAt().compareTo(n1.getCreatedAt());
        });

        // Pagination
        int totalItems = allNews.size();
        int totalPages = (int) Math.ceil((double) totalItems / size);
        int startIndex = page * size;
        int endIndex = Math.min(startIndex + size, totalItems);

        List<News> paginatedNews = allNews.subList(
                Math.min(startIndex, totalItems),
                Math.min(endIndex, totalItems));

        List<NewsDTO> newsDTOs = paginatedNews.stream()
                .map(this::mapToNewsDTO)
                .collect(Collectors.toList());

        // Tạo response
        Map<String, Object> response = new HashMap<>();
        response.put("news", newsDTOs);
        response.put("currentPage", page);
        response.put("totalPages", totalPages);
        response.put("totalItems", totalItems);
        response.put("itemsPerPage", size);
        response.put("hasNext", page < totalPages - 1);
        response.put("hasPrevious", page > 0);

        return response;
    }

    @Override
    public NewsDTO getNewsById(Integer id) {
        News news = newsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tin tức với ID: " + id));

        if (news.getStatus() == null || news.getStatus() != 2) {
            throw new RuntimeException("Tin tức không khả dụng");
        }

        return mapToNewsDTO(news);
    }

    private NewsDTO mapToNewsDTO(News news) {
        NewsDTO dto = new NewsDTO();
        dto.setId(news.getId());
        dto.setTitle(news.getTitle());
        dto.setContent(news.getContent());
        dto.setTime(news.getTime());
        dto.setCreatedAt(news.getCreatedAt());
        dto.setStatus(news.getStatus());

        if (news.getUser() != null) {
            dto.setAuthor(news.getUser().getName());
            dto.setAuthorId(news.getUser().getId());
        }

        // Tạo summary từ content (200 ký tự đầu)
        if (news.getContent() != null && news.getContent().length() > 200) {
            dto.setSummary(news.getContent().substring(0, 200) + "...");
        } else {
            dto.setSummary(news.getContent());
        }

        return dto;
    }

    @Override
    public NewsDTO createNews(CreateNewsRequest request, Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        // Kiểm tra quyền admin
        if (user.getIdRole() == null || !"ADMIN".equalsIgnoreCase(user.getIdRole().getName())) {
            throw new RuntimeException("Bạn không có quyền tạo tin tức");
        }

        News news = new News();
        news.setTitle(request.getTitle());
        news.setContent(request.getContent());
        news.setUser(user);
        news.setStatus(request.getStatus() != null ? request.getStatus() : 2);
        news.setTime(LocalDateTime.now());

        News savedNews = newsRepository.save(news);
        return mapToNewsDTO(savedNews);
    }

    @Override
    public NewsDTO updateNews(Integer newsId, CreateNewsRequest request, Integer userId) {
        News news = newsRepository.findById(newsId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tin tức"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        // Kiểm tra quyền: chỉ admin hoặc tác giả mới được sửa
        boolean isAdmin = user.getIdRole() != null && "ADMIN".equalsIgnoreCase(user.getIdRole().getName());
        boolean isAuthor = news.getUser() != null && news.getUser().getId().equals(userId);

        if (!isAdmin && !isAuthor) {
            throw new RuntimeException("Bạn không có quyền chỉnh sửa tin tức này");
        }

        news.setTitle(request.getTitle());
        news.setContent(request.getContent());
        if (request.getStatus() != null) {
            news.setStatus(request.getStatus());
        }
        news.setTime(LocalDateTime.now());

        News updatedNews = newsRepository.save(news);
        return mapToNewsDTO(updatedNews);
    }

    @Override
    public void deleteNews(Integer newsId, Integer userId) {
        News news = newsRepository.findById(newsId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tin tức"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        // Kiểm tra quyền: chỉ admin mới được xóa
        if (user.getIdRole() == null || !"ADMIN".equalsIgnoreCase(user.getIdRole().getName())) {
            throw new RuntimeException("Bạn không có quyền xóa tin tức");
        }

        newsRepository.delete(news);
    }
}