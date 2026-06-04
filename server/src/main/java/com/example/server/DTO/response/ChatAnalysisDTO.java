package com.example.server.DTO.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatAnalysisDTO {
    private Integer userId;
    private String userName;
    private String userAvatar;
    private String userEmail;
    private long totalMessages;
    private String identifiedProblems;
    private String suggestedSolutions;
}
