package com.example.server.domain.nckh;

import com.example.server.domain.EntityBase;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "user_plan_year", uniqueConstraints = @UniqueConstraint(name = "uq_user_year", columnNames = { "user_id",
        "academic_year" }))
public class UserPlanYear extends EntityBase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Integer userId;

    @Column(name = "academic_year", nullable = false)
    private Integer academicYear;

    @Column(name = "plan_id", nullable = false)
    private Integer planId;

    @Column(name = "is_locked", nullable = false)
    private Boolean isLocked = true;

    @Column(name = "selected_at", nullable = false)
    private LocalDateTime selectedAt = LocalDateTime.now();

    @Column(name = "locked_at")
    private LocalDateTime lockedAt;

    @Column(name = "locked_by")
    private Integer lockedBy;

    @Column(name = "admin_override_reason")
    private String adminOverrideReason;



}
