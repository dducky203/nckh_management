package com.example.server.DTO.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.Set;

@Data
public class CreateResearchGroupRequest {

    // student | lecturer
    @Pattern(regexp = "^(student|lecturer)$", message = "Type phải là student hoặc lecturer")
    private String type;

    /** NCM | XUAT_SAC | TINH_HOA — bắt buộc khi type = lecturer (nhóm định mức NCKH) */
    @Pattern(regexp = "^(NCM|XUAT_SAC|TINH_HOA)?$", message = "groupType phải là NCM, XUAT_SAC hoặc TINH_HOA")
    private String groupType;

    @NotBlank(message = "Tên nhóm không được để trống")
    @Size(max = 200, message = "Tên nhóm không được vượt quá 200 ký tự")
    private String groupName;

    @NotBlank(message = "Tên đề tài không được để trống")
    @Size(max = 500, message = "Tên đề tài không được vượt quá 500 ký tự")
    private String topicName;

    @Size(max = 2000, message = "Mô tả không được vượt quá 2000 ký tự")
    private String description;

    @NotNull(message = "ID người hướng dẫn không được để trống")
    private Integer advisorId;

    @NotNull(message = "Danh sách thành viên không được để trống")
    @Size(min = 1, message = "Nhóm phải có ít nhất 2 thành viên (bao gồm trưởng nhóm)")
    private Set<Integer> memberIds;
}
