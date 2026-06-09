package com.example.server.repository;

import com.example.server.domain.ResearchGroup;
import com.example.server.domain.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Repository
public interface ResearchGroupRepository extends JpaRepository<ResearchGroup, Integer> {


    // Tìm nhóm theo leader
    @EntityGraph(attributePaths = {"leader", "advisor"})
    List<ResearchGroup> findByLeader(User leader);

    // Tìm nhóm có chứa member
    @EntityGraph(attributePaths = {"leader", "advisor"})
    @Query("SELECT DISTINCT rgm.group FROM ResearchGroupMember rgm WHERE rgm.userId = :userId")
    List<ResearchGroup> findGroupsByMemberId(@Param("userId") Integer userId);

    // Tìm nhóm theo advisor
    List<ResearchGroup> findByAdvisor(User advisor);

    // Tìm nhóm theo advisor và status
    List<ResearchGroup> findByAdvisorAndStatus(User advisor, ResearchGroup.GroupStatus status);

    // Tìm nhóm theo advisor (tất cả status)
    @Query("SELECT rg FROM ResearchGroup rg WHERE rg.advisor = :advisor AND (:status IS NULL OR rg.status = :status)")
    List<ResearchGroup> findByAdvisorWithStatus(@Param("advisor") User advisor, @Param("status") ResearchGroup.GroupStatus status);

    // Tìm kiếm theo keyword, status, type, startDate, endDate
    @EntityGraph(attributePaths = {"leader", "advisor"})
    @Query("SELECT rg FROM ResearchGroup rg WHERE " +
            "(:keyword IS NULL OR :keyword = '' OR LOWER(rg.groupName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(rg.topicName) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
            "AND (:status IS NULL OR rg.status = :status) " +
            "AND rg.type = :type " +
            "AND (rg.createdAt >= :startDate) " +
            "AND (rg.createdAt <= :endDate)")
    Page<ResearchGroup> searchWithFilters(
            @Param("keyword") String keyword,
            @Param("type") String type,
            @Param("status") ResearchGroup.GroupStatus status,
            @Param("startDate") Date startDate,
            @Param("endDate") Date endDate,
            Pageable pageable
    );

    @EntityGraph(attributePaths = {"leader", "advisor"})
    @Query("SELECT rg FROM ResearchGroup rg WHERE " +
            "(:keyword IS NULL OR :keyword = '' OR LOWER(rg.groupName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(rg.topicName) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
            "AND (:status IS NULL OR rg.status = :status) " +
            "AND rg.type = :type ")

    Page<ResearchGroup> searchWithFilters(
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
