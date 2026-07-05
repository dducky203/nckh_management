package com.example.server.DTO.users;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class UserDetailsDTO {
    private Integer id;
    private String username;
    private String name;
    private String email;
    private String role;
    /** ID bản ghi trong bảng `role` (admin / user / assistant …). */
    private Integer idRole;
    private Integer power;
    private String title;
    private Boolean inActive;
    private Boolean isDeleted;
    private String address;
    private String provinceCode;
    private String wardCode;
    private String addressDetail;
    private String avatar;
    private Date birthday;
    private String phone;
    private Date createdAt;
    private Date updatedAt;
}
