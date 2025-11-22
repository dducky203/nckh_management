package com.example.server.DTO.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventRegistrationDTO {
    private String fullName;
    private String email;
    private String phone;
    private String organization;
    private String note;
}
