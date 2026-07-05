package com.example.server.mapper;


import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.example.server.DTO.users.UserDetailsDTO;
import com.example.server.DTO.users.UserRequest;
import com.example.server.domain.User;

@Mapper(componentModel = "spring")
public interface UserMapper {


    @Mapping(source = "idResume.email", target = "email")
    @Mapping(source = "idResume.phone", target = "phone")
    @Mapping(source = "idResume.address", target = "address")
    @Mapping(source = "idResume.provinceCode", target = "provinceCode")
    @Mapping(source = "idResume.wardCode", target = "wardCode")
    @Mapping(source = "idResume.addressDetail", target = "addressDetail")
    @Mapping(source = "idResume.birthday", target = "birthday")
    @Mapping(source = "idRole.name", target = "role")
    @Mapping(source = "idRole.id", target = "idRole")
    @Mapping(source = "idTitle.name", target = "title")
    UserDetailsDTO toUserDetailDTO(User user);

    @Mapping(source = "idResume.email", target = "email")
    @Mapping(source = "idResume.phone", target = "phone")
    @Mapping(source = "idResume.address", target = "address")
    @Mapping(source = "idResume.provinceCode", target = "provinceCode")
    @Mapping(source = "idResume.wardCode", target = "wardCode")
    @Mapping(source = "idResume.addressDetail", target = "addressDetail")
    @Mapping(source = "idResume.birthday", target = "birthday")
    @Mapping(source = "idRole.name", target = "role")
    @Mapping(source = "idRole.id", target = "idRole")
    @Mapping(source = "idTitle.name", target = "title")
    List<UserDetailsDTO> toUserDetailDTO(List<User> users);

    User toEntity(UserRequest user);

}
