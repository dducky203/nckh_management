package com.example.server.DTO;

import com.example.server.domain.Role;
import com.example.server.domain.Title;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserDTO {
    private Integer id;
    private String username;
    private String name;
    private String email;
    private String role;
    private Integer power;
    private String title;

}
