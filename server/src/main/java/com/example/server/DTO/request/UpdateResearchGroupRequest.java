package com.example.server.DTO.request;

import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.Set;

@Data
public class UpdateResearchGroupRequest {

    @Size(max = 200, message = "Tên nhóm không được vượt quá 200 ký tự")
    private String groupName;

    @Size(max = 500, message = "Tên đề tài không được vượt quá 500 ký tự")
    private String topicName;

    @Size(max = 2000, message = "Mô tả không được vượt quá 2000 ký tự")
    private String description;

    private Integer advisorId;

    private Set<Integer> memberIds;
}
