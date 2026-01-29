package com.example.server.repository;

import com.example.server.domain.ResearchGroup;
import com.example.server.domain.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ResearchGroupRepository extends JpaRepository<ResearchGroup, Integer> {


    // Tìm nhóm theo leader
    List<ResearchGroup> findByLeader(User leader);

    // Tìm nhóm có chứa member
        @Query("SELECT DISTINCT rgm.group FROM ResearchGroupMember rgm WHERE rgm.userId = :userId")
        List<ResearchGroup> findGroupsByMemberId(@Param("userId") Integer userId);

    // Tìm nhóm theo advisor
    List<ResearchGroup> findByAdvisor(User advisor);

    // Tìm kiếm theo tên nhóm hoặc tên đề tài
    @Query("SELECT rg FROM ResearchGroup rg WHERE " +
            "(LOWER(rg.groupName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(rg.topicName) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
            "AND rg.type = :type")
    Page<ResearchGroup> searchByKeyword(
            @Param("keyword") String keyword,
            @Param("type") String type,
            Pageable pageable
    );

    // Tìm kiếm theo keyword và status
    @Query("SELECT rg FROM ResearchGroup rg WHERE " +
            "(LOWER(rg.groupName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(rg.topicName) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
            "AND rg.status = :status " +
            "AND rg.type = :type"
    )
    Page<ResearchGroup> searchByKeywordAndStatus(
            @Param("keyword") String keyword,
            @Param("type") String type,
            @Param("status") ResearchGroup.GroupStatus status,
            Pageable pageable
    );

    // Đếm số nhóm theo status
    long countByStatus(ResearchGroup.GroupStatus status);

    Page<ResearchGroup> findByStatusAndType(ResearchGroup.GroupStatus groupStatus, String type, Pageable pageable);

    Page<ResearchGroup> findAllByType(String type, Pageable pageable);
}
