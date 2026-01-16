package com.example.server.repository;

import com.example.server.domain.ResearchGroupMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ResearchGroupMemberRepository
        extends JpaRepository<ResearchGroupMember, ResearchGroupMember.ResearchGroupMemberId> {

    List<ResearchGroupMember> findByGroupId(Integer groupId);

    Optional<ResearchGroupMember> findByGroupIdAndUserId(Integer groupId, Integer userId);

    void deleteByGroupIdAndUserId(Integer groupId, Integer userId);

    @Query("SELECT rgm FROM ResearchGroupMember rgm WHERE rgm.groupId = :groupId")
    List<ResearchGroupMember> findAllByGroupId(@Param("groupId") Integer groupId);

    List<ResearchGroupMember> findAllByUserId(Integer userId);
}
