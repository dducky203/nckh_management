package com.example.server.repository;

import com.example.server.domain.ResearchGroupJoinRequest;
import com.example.server.domain.ResearchGroupJoinRequest.JoinRequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ResearchGroupJoinRequestRepository extends JpaRepository<ResearchGroupJoinRequest, Long> {

    List<ResearchGroupJoinRequest> findByGroupIdAndStatus(Integer groupId, JoinRequestStatus status);

    List<ResearchGroupJoinRequest> findByUserIdOrderByCreatedAtDesc(Integer userId);

    Optional<ResearchGroupJoinRequest> findByGroupIdAndUserIdAndStatus(
            Integer groupId, Integer userId, JoinRequestStatus status);

    boolean existsByGroupIdAndUserIdAndStatus(Integer groupId, Integer userId, JoinRequestStatus status);
}
