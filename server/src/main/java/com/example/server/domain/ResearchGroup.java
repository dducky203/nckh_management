package com.example.server.domain;

import com.example.server.domain.EntityBase;
import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

@Entity
@Table(name = "research_group")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResearchGroup extends EntityBase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 200)
    private String groupName;

    @Column(nullable = false, length = 500)
    private String topicName;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String googleSheetLink;

    /** student | lecturer — loại nhóm SV / GV */
    @Column(length = 500)
    private String type;

    /** NCM | XUAT_SAC | TINH_HOA — phương án định mức (chỉ nhóm GV) */
    @Column(name = "group_type", length = 50)
    private String groupType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private GroupStatus status = GroupStatus.PENDING;

    // Trưởng nhóm
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "leader_id", nullable = false)
    private User leader;

    // Người hướng dẫn
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "advisor_id")
    private User advisor;

    // Danh sách thành viên

    public enum GroupStatus {
        PENDING,          // Chờ duyệt (cũ - nhóm GV)
        PENDING_ADVISOR,  // Chờ giảng viên hướng dẫn duyệt (nhóm SV)
        PENDING_ADMIN,    // Giảng viên đã duyệt, chờ Admin duyệt (nhóm SV)
        APPROVED,         // Đã duyệt
        REJECTED          // Bị từ chối
    }

    public boolean isLeader(User user) {
        return this.leader != null && this.leader.getId().equals(user.getId());
    }
}
