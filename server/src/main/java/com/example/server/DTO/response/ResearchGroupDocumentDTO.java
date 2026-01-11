package com.example.server.DTO.response;

import com.example.server.domain.ResearchGroupDocument;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResearchGroupDocumentDTO {
    private Integer id;
    private String documentName;
    private String documentType;
    private String fileUrl;
    private String description;
    private Integer researchGroupId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static ResearchGroupDocumentDTO fromEntity(ResearchGroupDocument document) {
        return ResearchGroupDocumentDTO.builder()
                .id(document.getId())
                .documentName(document.getDocumentName())
                .documentType(document.getDocumentType())
                .fileUrl(document.getFileUrl())
                .description(document.getDescription())
                .researchGroupId(
                        document.getResearchGroup() != null
                                ? document.getResearchGroup().getId()
                                : null)
                .createdAt(toLocalDateTime(document.getCreatedAt()))
                .updatedAt(toLocalDateTime(document.getUpdatedAt()))
                .build();
    }

    private static LocalDateTime toLocalDateTime(Date date) {
        return date == null ? null
                : date.toInstant()
                        .atZone(ZoneId.systemDefault())
                        .toLocalDateTime();
    }
}


