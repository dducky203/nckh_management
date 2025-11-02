package com.example.server.DTO.users;

import com.example.server.domain.Role;
import com.example.server.domain.Title;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.Date;

@Getter
@Setter
public class UserRequest {
    private Integer id;

    @NotBlank(message = "Username không được bỏ trống")
    private String username;

    @NotBlank(message = "Name không được bỏ trống")
    private String name;

    @NotBlank(message = "Email không được bỏ trống")
    @Email(message = "Email không đúng định dạng")
    private String email;

    private Role idRole;

    @NotNull(message = "Power không được bỏ trống")
    private Integer power;

    @NotNull(message = "Title không được bỏ trống")
    private Title idTitle;
    private String address;
    private Boolean inActive;
    private LocalDate birthday;
//    @Pattern(regexp = "^[0-9]{10}$", message = "Số điện thoại chứa ký tự")
    private String phone;
}
