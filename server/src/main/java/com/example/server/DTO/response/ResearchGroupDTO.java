package com.example.server.DTO.response;

import com.example.server.domain.ResearchGroup;
import com.example.server.domain.ResearchGroupMember;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResearchGroupDTO {

    private Integer id;
    private String groupName;
    private String topicName;
    private String description;
    private String googleSheetLink;
    private String status;
    private Date createdAt;
    private Date updatedAt;

    // Leader info
    private UserSimpleDTO leader;

    // Advisor info
    private UserSimpleDTO advisor;

    // Members
    private Set<UserSimpleDTO> members;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserSimpleDTO {
        private Integer id;
        private String name;
        private String email;
        private String username;
        private String title;
        private String address; // Đơn vị/địa chỉ
        private String role; // Nhiệm vụ: Trưởng nhóm, Thư ký, Thành viên
        private Integer participationRate; // Tỷ lệ tham gia (%)
    }

    public static ResearchGroupDTO fromEntity(ResearchGroup group) {
        return ResearchGroupDTO.builder()
                .id(group.getId())
                .groupName(group.getGroupName())
                .topicName(group.getTopicName())
                .description(group.getDescription())
                .googleSheetLink(group.getGoogleSheetLink())
                .status(group.getStatus().name())
                .createdAt(group.getCreatedAt())
                .updatedAt(group.getUpdatedAt())
                .leader(UserSimpleDTO.builder()
                        .id(group.getLeader().getId())
                        .name(group.getLeader().getName())
                        .email(group.getLeader().getIdResume() != null
                                ? group.getLeader().getIdResume().getEmail()
                                : null)
                        .username(group.getLeader().getUsername())
                        .title(group.getLeader().getIdTitle() != null
                                ? group.getLeader().getIdTitle().getName()
                                : null)
                        .address(group.getLeader().getIdResume() != null
                                ? group.getLeader().getIdResume().getAddress()
                                : null)
                        .build())
                .advisor(group.getAdvisor() != null ? UserSimpleDTO.builder()
                        .id(group.getAdvisor().getId())
                        .name(group.getAdvisor().getName())
                        .email(group.getAdvisor().getIdResume() != null
                                ? group.getAdvisor().getIdResume().getEmail()
                                : null)
                        .username(group.getAdvisor().getUsername())
                        .title(group.getAdvisor().getIdTitle() != null
                                ? group.getAdvisor().getIdTitle().getName()
                                : null)
                        .address(group.getAdvisor().getIdResume() != null
                                ? group.getAdvisor().getIdResume().getAddress()
                                : null)
                        .build() : null)
                .members(group.getMembers().stream()
                        .map(user -> UserSimpleDTO.builder()
                                .id(user.getId())
                                .name(user.getName())
                                .email(user.getIdResume() != null
                                        ? user.getIdResume().getEmail()
                                        : null)
                                .username(user.getUsername())
                                .title(user.getIdTitle() != null
                                        ? user.getIdTitle().getName()
                                        : null)
                                .address(user.getIdResume() != null
                                        ? user.getIdResume().getAddress()
                                        : null)
                                .role(null) // Sẽ được set bên ngoài
                                .participationRate(null) // Sẽ được set bên ngoài
                                .build())
                        .collect(Collectors.toSet()))
                .build();
    }

    public static ResearchGroupDTO fromEntity(ResearchGroup group, List<ResearchGroupMember> memberInfos) {
        ResearchGroupDTO dto = fromEntity(group);

        // Tạo map để tra cứu nhanh role và participationRate
        Map<Integer, ResearchGroupMember> memberInfoMap = memberInfos.stream()
                .collect(Collectors.toMap(ResearchGroupMember::getUserId, m -> m));

        // Cập nhật role và participationRate cho từng member
        if (dto.getMembers() != null) {
            dto.getMembers().forEach(member -> {
                ResearchGroupMember memberInfo = memberInfoMap.get(member.getId());
                if (memberInfo != null) {
                    member.setRole(memberInfo.getRole());
                    member.setParticipationRate(memberInfo.getParticipationRate());
                } else {
                    // Mặc định nếu không tìm thấy
                    member.setRole("Thành viên");
                    member.setParticipationRate(100);
                }

                // Xác định role dựa trên leader/advisor
                if (dto.getLeader() != null && dto.getLeader().getId().equals(member.getId())) {
                    member.setRole("Trưởng nhóm");
                } else if (dto.getAdvisor() != null
                        && dto.getAdvisor().getId().equals(member.getId())) {
                    // Advisor có thể là Thư ký hoặc giữ nguyên role từ memberInfo
                    if (memberInfo == null || "Thành viên".equals(member.getRole())) {
                        member.setRole("Thư ký");
                    }
                }
            });
        }

        return dto;
    }
}
