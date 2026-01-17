package com.example.server.domain.nckh;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "nckh_activity_contributor", uniqueConstraints = @UniqueConstraint(name = "uq_act_user", columnNames = {
        "activity_id", "user_id" }))
public class NckhActivityContributor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "activity_id", nullable = false)
    private Long activityId;

    @Column(name = "user_id", nullable = false)
    private Integer userId;

    @Enumerated(EnumType.STRING)
    @Column(name = "contrib_role", nullable = false)
    private Role role;

    @Column(name = "participants_n", nullable = false)
    private Integer participantsN = 1;

    @Column(name = "hours_share", nullable = false)
    private Double hoursShare = 0.0;

    @Column(name = "equiv_qty", nullable = false)
    private Double equivQty = 0.0;

    @Column(name = "note")
    private String note;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum Role {
        MAIN, MEMBER
    }

    // getters/setters
    public Long getId() {
        return id;
    }

    public Long getActivityId() {
        return activityId;
    }

    public void setActivityId(Long activityId) {
        this.activityId = activityId;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public Integer getParticipantsN() {
        return participantsN;
    }

    public void setParticipantsN(Integer participantsN) {
        this.participantsN = participantsN;
    }

    public Double getHoursShare() {
        return hoursShare;
    }

    public void setHoursShare(Double hoursShare) {
        this.hoursShare = hoursShare;
    }

    public Double getEquivQty() {
        return equivQty;
    }

    public void setEquivQty(Double equivQty) {
        this.equivQty = equivQty;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }
}
