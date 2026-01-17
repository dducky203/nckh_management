package com.example.server.domain.nckh;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_plan_year", uniqueConstraints = @UniqueConstraint(name = "uq_user_year", columnNames = { "user_id",
        "academic_year" }))
public class UserPlanYear {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Integer userId;

    @Column(name = "academic_year", nullable = false)
    private Integer academicYear;

    @Enumerated(EnumType.STRING)
    @Column(name = "plan_code", nullable = false)
    private PlanCode planCode;

    @Column(name = "is_locked", nullable = false)
    private Boolean isLocked = true;

    @Column(name = "selected_at", nullable = false)
    private LocalDateTime selectedAt = LocalDateTime.now();

    @Column(name = "locked_at")
    private LocalDateTime lockedAt;

    @Column(name = "locked_by")
    private Integer lockedBy;

    @Column(name = "updated_by")
    private Integer updatedBy;

    @Column(name = "admin_override_reason")
    private String adminOverrideReason;

    public enum PlanCode {
        PA0, PA1, PA2, PA3, PA4, PA5
    }

    // getters/setters
    public Long getId() {
        return id;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public Integer getAcademicYear() {
        return academicYear;
    }

    public void setAcademicYear(Integer academicYear) {
        this.academicYear = academicYear;
    }

    public PlanCode getPlanCode() {
        return planCode;
    }

    public void setPlanCode(PlanCode planCode) {
        this.planCode = planCode;
    }

    public Boolean getIsLocked() {
        return isLocked;
    }

    public void setIsLocked(Boolean locked) {
        isLocked = locked;
    }

    public LocalDateTime getSelectedAt() {
        return selectedAt;
    }

    public void setSelectedAt(LocalDateTime selectedAt) {
        this.selectedAt = selectedAt;
    }

    public LocalDateTime getLockedAt() {
        return lockedAt;
    }

    public void setLockedAt(LocalDateTime lockedAt) {
        this.lockedAt = lockedAt;
    }

    public Integer getLockedBy() {
        return lockedBy;
    }

    public void setLockedBy(Integer lockedBy) {
        this.lockedBy = lockedBy;
    }

    public Integer getUpdatedBy() {
        return updatedBy;
    }

    public void setUpdatedBy(Integer updatedBy) {
        this.updatedBy = updatedBy;
    }

    public String getAdminOverrideReason() {
        return adminOverrideReason;
    }

    public void setAdminOverrideReason(String adminOverrideReason) {
        this.adminOverrideReason = adminOverrideReason;
    }
}
