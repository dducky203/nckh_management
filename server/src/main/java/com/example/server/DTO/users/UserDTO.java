package com.example.server.DTO.users;

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
    private Boolean inActive;
    private Boolean isDeleted;

}
