package com.example.server.DTO.login;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class LoginRequestDTO {
    @NotBlank(message = "Tài khoản không được để trống !")
    @Size(min = 5, message = "Tài khoản phải có ít nhất 5 ký tự !")
    private String username;

    @NotBlank(message = "Mật khẩu không được để trống !")
    private String password;
}
