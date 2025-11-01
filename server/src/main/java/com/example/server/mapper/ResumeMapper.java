package com.example.server.mapper;

import com.example.server.DTO.users.UserDetailsDTO;
import com.example.server.DTO.users.UserRequest;
import com.example.server.domain.Resume;
import com.example.server.domain.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ResumeMapper {
//    @Mapping(source = "id", target = "idUser")
    Resume toEntity(UserRequest user);

//    @Mapping(source = "idUser.username", target = "username")
//    @Mapping(source = "idResume.phone", target = "phone")
//    @Mapping(source = "idResume.address", target = "address")
//    @Mapping(source = "idResume.birthday", target = "birthday")
//    @Mapping(source = "idRole.name", target = "role")
//    @Mapping(source = "idTitle.name", target = "title")
//    UserDetailsDTO toUserDetailDTO(Resume resume);
}
