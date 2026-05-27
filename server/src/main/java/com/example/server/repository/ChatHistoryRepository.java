package com.example.server.repository;

import com.example.server.domain.ChatHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatHistoryRepository extends JpaRepository<ChatHistory, Integer> {
    void deleteByConversationId(String conversationId);
}
