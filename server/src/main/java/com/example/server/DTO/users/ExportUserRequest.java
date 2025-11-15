package com.example.server.DTO.users;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExportUserRequest {

    /**
     * Danh sách ID của những người dùng cần export
     */
    private List<Integer> userIds;

    /**
     * Tên file (optional)
     */
    private String fileName;

    /**
     * Có bao gồm thông tin chi tiết hay không
     */
    private Boolean includeDetails = true;

    /**
     * Format ngày tháng (optional)
     * Mặc định: dd/MM/yyyy HH:mm
     */
    private String dateFormat = "dd/MM/yyyy HH:mm";
}