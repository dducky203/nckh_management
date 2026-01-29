package com.example.server.mapper;


import com.example.server.DTO.users.UserDetailsDTO;
import com.example.server.DTO.users.UserRequest;
import com.example.server.domain.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import java.util.List;

@Mapper(componentModel = "spring")
public interface UserMapper {


    @Mapping(source = "idResume.email", target = "email")
    @Mapping(source = "idResume.phone", target = "phone")
    @Mapping(source = "idResume.address", target = "address")
    @Mapping(source = "idResume.birthday", target = "birthday")
    @Mapping(source = "idRole.name", target = "role")
    @Mapping(source = "idTitle.name", target = "title")
    UserDetailsDTO toUserDetailDTO(User user);

    @Mapping(source = "idResume.email", target = "email")
    @Mapping(source = "idResume.phone", target = "phone")
    @Mapping(source = "idResume.address", target = "address")
    @Mapping(source = "idResume.birthday", target = "birthday")
    @Mapping(source = "idRole.name", target = "role")
    @Mapping(source = "idTitle.name", target = "title")
    List<UserDetailsDTO> toUserDetailDTO(List<User> users);

    User toEntity(UserRequest user);

}
