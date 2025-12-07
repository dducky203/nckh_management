package com.example.server.DTO.response;

import com.example.server.domain.ResearchGroup;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
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
    }

    public static ResearchGroupDTO fromEntity(ResearchGroup group) {
        return ResearchGroupDTO.builder()
                .id(group.getId())
                .groupName(group.getGroupName())
                .topicName(group.getTopicName())
                .description(group.getDescription())
                .status(group.getStatus().name())
                .createdAt(group.getCreatedAt())
                .updatedAt(group.getUpdatedAt())
                .leader(UserSimpleDTO.builder()
                        .id(group.getLeader().getId())
                        .name(group.getLeader().getName())
                        .email(group.getLeader().getIdResume().getEmail())
                        .username(group.getLeader().getUsername())
                        .title(group.getLeader().getIdTitle().getName())
                        .build())
                .advisor(group.getAdvisor() != null ? UserSimpleDTO.builder()
                        .id(group.getAdvisor().getId())
                        .name(group.getAdvisor().getName())
                        .email(group.getAdvisor().getIdResume().getEmail())
                        .username(group.getAdvisor().getUsername())
                        .title(group.getAdvisor().getIdTitle().getName())
                        .build() : null)
                .members(group.getMembers().stream()
                        .map(user -> UserSimpleDTO.builder()
                                .id(user.getId())
                                .name(user.getName())
                                .email(user.getIdResume().getEmail())
                                .username(user.getUsername())
                                .title(user.getIdTitle().getName())
                                .build())
                        .collect(Collectors.toSet()))
                .build();
    }
}
