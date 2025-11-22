package com.example.server.DTO.users;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExportUserRequest {

    
    private List<Integer> userIds;
   
    private String fileName;

    private Boolean includeDetails = true;

    private String dateFormat = "dd/MM/yyyy HH:mm";
}