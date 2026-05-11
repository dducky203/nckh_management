package com.example.server.domain.nckh;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
@Table(name = "nckh_activity")
public class NckhActivity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "academic_year", nullable = false)
    private Integer academicYear;

    @Column(name = "research_group_id")
    private Integer researchGroupId; // int(11) theo DB bạn

    @Column(name = "catalog_code", nullable = false, length = 50)
    private String catalogCode;

    @Column(name = "qty", nullable = false)
    private Double qty = 1.0;

    @Column(name = "quota_hours_snapshot", nullable = false)
    private Double quotaHoursSnapshot; // S snapshot

    @Column(name = "title")
    private String title;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "publication_name")
    private String publicationName;

    @Column(name = "activity_date")
    private LocalDate activityDate;

    @Column(name = "venue")
    private String venue;

    @Column(name = "identifier_code")
    private String identifierCode;

    @Column(name = "external_link")
    private String externalLink;

    @Column(name = "proof_file_url")
    private String proofFileUrl;

    @Column(name = "proof_image_url")
    private String proofImageUrl;

    @Column(name = "details_json", columnDefinition = "TEXT")
    private String detailsJson;

    @Column(name = "main_author_user_id")
    private Integer mainAuthorUserId;

    @Column(name = "member_user_ids", columnDefinition = "TEXT")
    private String memberUserIds;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private Status status = Status.DRAFT;

    @Column(name = "created_by_user_id", nullable = false)
    private Integer createdByUserId;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

    @Column(name = "approved_by_user_id")
    private Integer approvedByUserId;

    @Column(name = "approved_at")
    private LocalDateTime approvedAt;

    public enum Status {
        DRAFT, SUBMITTED, APPROVED, REJECTED
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // getters/setters
    public Long getId() {
        return id;
    }

    public Integer getAcademicYear() {
        return academicYear;
    }

    public void setAcademicYear(Integer academicYear) {
        this.academicYear = academicYear;
    }

    public Integer getResearchGroupId() {
        return researchGroupId;
    }

    public void setResearchGroupId(Integer researchGroupId) {
        this.researchGroupId = researchGroupId;
    }

    public String getCatalogCode() {
        return catalogCode;
    }

    public void setCatalogCode(String catalogCode) {
        this.catalogCode = catalogCode;
    }

    public Double getQty() {
        return qty;
    }

    public void setQty(Double qty) {
        this.qty = qty;
    }

    public Double getQuotaHoursSnapshot() {
        return quotaHoursSnapshot;
    }

    public void setQuotaHoursSnapshot(Double quotaHoursSnapshot) {
        this.quotaHoursSnapshot = quotaHoursSnapshot;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getPublicationName() {
        return publicationName;
    }

    public void setPublicationName(String publicationName) {
        this.publicationName = publicationName;
    }

    public LocalDate getActivityDate() {
        return activityDate;
    }

    public void setActivityDate(LocalDate activityDate) {
        this.activityDate = activityDate;
    }

    public String getVenue() {
        return venue;
    }

    public void setVenue(String venue) {
        this.venue = venue;
    }

    public String getIdentifierCode() {
        return identifierCode;
    }

    public void setIdentifierCode(String identifierCode) {
        this.identifierCode = identifierCode;
    }

    public String getExternalLink() {
        return externalLink;
    }

    public void setExternalLink(String externalLink) {
        this.externalLink = externalLink;
    }

    public String getProofFileUrl() {
        return proofFileUrl;
    }

    public void setProofFileUrl(String proofFileUrl) {
        this.proofFileUrl = proofFileUrl;
    }

    public String getProofImageUrl() {
        return proofImageUrl;
    }

    public void setProofImageUrl(String proofImageUrl) {
        this.proofImageUrl = proofImageUrl;
    }

    public String getDetailsJson() {
        return detailsJson;
    }

    public void setDetailsJson(String detailsJson) {
        this.detailsJson = detailsJson;
    }

    public Integer getMainAuthorUserId() {
        return mainAuthorUserId;
    }

    public void setMainAuthorUserId(Integer mainAuthorUserId) {
        this.mainAuthorUserId = mainAuthorUserId;
    }

    public String getMemberUserIds() {
        return memberUserIds;
    }

    public void setMemberUserIds(String memberUserIds) {
        this.memberUserIds = memberUserIds;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public Integer getCreatedByUserId() {
        return createdByUserId;
    }

    public void setCreatedByUserId(Integer createdByUserId) {
        this.createdByUserId = createdByUserId;
    }

    public Integer getApprovedByUserId() {
        return approvedByUserId;
    }

    public void setApprovedByUserId(Integer approvedByUserId) {
        this.approvedByUserId = approvedByUserId;
    }

    public LocalDateTime getApprovedAt() {
        return approvedAt;
    }

    public void setApprovedAt(LocalDateTime approvedAt) {
        this.approvedAt = approvedAt;
    }
}
