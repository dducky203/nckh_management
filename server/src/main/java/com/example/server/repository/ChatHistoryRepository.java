package com.example.server.repository;

import com.example.server.domain.ChatHistory;
import com.example.server.domain.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatHistoryRepository extends JpaRepository<ChatHistory, Integer> {
    void deleteByConversationId(String conversationId);

    List<ChatHistory> findByUser_IdOrderByCreatedAtDesc(Integer userId);

    Page<ChatHistory> findByUser_IdOrderByCreatedAtDesc(Integer userId, Pageable pageable);

    long countByUser_Id(Integer userId);

    /**
     * Lấy danh sách User phân biệt (distinct) đã có chat, sắp xếp theo tin nhắn mới nhất.
     * Hỗ trợ tìm kiếm theo tên hoặc username.
     */
    @Query("SELECT DISTINCT ch.user FROM ChatHistory ch " +
           "WHERE ch.user IS NOT NULL " +
           "AND (:search IS NULL OR :search = '' OR " +
           "     LOWER(ch.user.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "     LOWER(ch.user.username) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "ORDER BY ch.user.name ASC")
    Page<User> findDistinctUsersWithChatHistory(@Param("search") String search, Pageable pageable);

    @Query("SELECT COUNT(DISTINCT ch.user) FROM ChatHistory ch WHERE ch.user IS NOT NULL")
    long countDistinctUsersWithChatHistory();

    /** Lấy tất cả tin nhắn user (không lọc theo người), mới nhất trước, dùng cho phân tích tổng quan. */
    @Query("SELECT ch FROM ChatHistory ch WHERE ch.userMessage IS NOT NULL AND ch.userMessage <> '' ORDER BY ch.createdAt DESC")
    List<ChatHistory> findRecentMessagesForGlobalAnalysis(Pageable pageable);

    /** Tổng số tin nhắn toàn hệ thống. */
    @Query("SELECT COUNT(ch) FROM ChatHistory ch WHERE ch.userMessage IS NOT NULL AND ch.userMessage <> ''")
    long countAllUserMessages();
}
