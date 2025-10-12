package com.example.server.mapper;

import com.example.server.DTO.UserDTO;
import com.example.server.domain.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {
    @Mapping(source = "idResume.email", target = "email")
    @Mapping(source = "idRole.name", target = "role")
    @Mapping(source = "idTitle.name", target = "title")
    UserDTO toDTO(User user);
}
