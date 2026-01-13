package com.example.server.domain;

import com.example.server.domain.EntityBase;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
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

    @Column(length = 500)
    private String type;

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
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "research_group_members", joinColumns = @JoinColumn(name = "group_id"), inverseJoinColumns = @JoinColumn(name = "user_id"))
    private Set<User> members = new HashSet<>();

    public enum GroupStatus {
        PENDING, // Chờ duyệt
        APPROVED, // Đã duyệt
        REJECTED // Bị từ chối
    }

    // Helper methods
    public void addMember(User user) {
        this.members.add(user);
    }

    public void removeMember(User user) {
        this.members.remove(user);
    }

    public boolean isMember(User user) {
        return this.members.contains(user);
    }

    public boolean isLeader(User user) {
        return this.leader != null && this.leader.getId().equals(user.getId());
    }
}
