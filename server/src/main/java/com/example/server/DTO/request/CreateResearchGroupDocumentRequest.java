package com.example.server.DTO.request;

import lombok.Data;

@Data
public class CreateResearchGroupDocumentRequest {
    private String documentName;
    private String documentType;
    private String description;
}



