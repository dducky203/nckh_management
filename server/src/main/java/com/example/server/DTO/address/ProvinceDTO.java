package com.example.server.DTO.address;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProvinceDTO {
    private String code;
    private String name;
    private String fullName;
}
