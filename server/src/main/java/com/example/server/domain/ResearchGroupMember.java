package com.example.server.domain;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;

@Entity
@Table(name = "research_group_members")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@IdClass(ResearchGroupMember.ResearchGroupMemberId.class)
public class ResearchGroupMember implements Serializable {

    @Id
    @Column(name = "group_id")
    private Integer groupId;

    @Id
    @Column(name = "user_id")
    private Integer userId;

    @Column(name = "role", length = 50)
    @Builder.Default
    private String role = "Thành viên"; // Trưởng nhóm, Thư ký, Thành viên

    @Column(name = "participation_rate")
    @Builder.Default
    private Integer participationRate = 100; // Tỷ lệ tham gia (%)

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "group_id", insertable = false, updatable = false)
    private ResearchGroup group;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private User user;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ResearchGroupMemberId implements Serializable {
        private Integer groupId;
        private Integer userId;
    }
}
