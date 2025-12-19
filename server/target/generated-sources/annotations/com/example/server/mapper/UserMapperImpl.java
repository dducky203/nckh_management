package com.example.server.mapper;

import com.example.server.DTO.users.UserDetailsDTO;
import com.example.server.DTO.users.UserRequest;
import com.example.server.domain.Resume;
import com.example.server.domain.Role;
import com.example.server.domain.Title;
import com.example.server.domain.User;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-12-18T17:51:30+0700",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.44.0.v20251118-1623, environment: Java 21.0.9 (Eclipse Adoptium)"
)
@Component
public class UserMapperImpl implements UserMapper {

    @Override
    public UserDetailsDTO toUserDetailDTO(User user) {
        if ( user == null ) {
            return null;
        }

        UserDetailsDTO userDetailsDTO = new UserDetailsDTO();

        userDetailsDTO.setEmail( userIdResumeEmail( user ) );
        userDetailsDTO.setPhone( userIdResumePhone( user ) );
        userDetailsDTO.setAddress( userIdResumeAddress( user ) );
        LocalDate birthday = userIdResumeBirthday( user );
        if ( birthday != null ) {
            userDetailsDTO.setBirthday( Date.from( birthday.atStartOfDay( ZoneOffset.UTC ).toInstant() ) );
        }
        userDetailsDTO.setRole( userIdRoleName( user ) );
        userDetailsDTO.setTitle( userIdTitleName( user ) );
        userDetailsDTO.setCreatedAt( user.getCreatedAt() );
        userDetailsDTO.setId( user.getId() );
        userDetailsDTO.setInActive( user.getInActive() );
        userDetailsDTO.setIsDeleted( user.getIsDeleted() );
        userDetailsDTO.setName( user.getName() );
        userDetailsDTO.setPower( user.getPower() );
        userDetailsDTO.setUpdatedAt( user.getUpdatedAt() );
        userDetailsDTO.setUsername( user.getUsername() );

        return userDetailsDTO;
    }

    @Override
    public List<UserDetailsDTO> toUserDetailDTO(List<User> users) {
        if ( users == null ) {
            return null;
        }

        List<UserDetailsDTO> list = new ArrayList<UserDetailsDTO>( users.size() );
        for ( User user : users ) {
            list.add( toUserDetailDTO( user ) );
        }

        return list;
    }

    @Override
    public User toEntity(UserRequest user) {
        if ( user == null ) {
            return null;
        }

        User user1 = new User();

        user1.setId( user.getId() );
        user1.setIdRole( user.getIdRole() );
        user1.setIdTitle( user.getIdTitle() );
        user1.setInActive( user.getInActive() );
        user1.setName( user.getName() );
        user1.setPower( user.getPower() );
        user1.setUsername( user.getUsername() );

        return user1;
    }

    private String userIdResumeEmail(User user) {
        if ( user == null ) {
            return null;
        }
        Resume idResume = user.getIdResume();
        if ( idResume == null ) {
            return null;
        }
        String email = idResume.getEmail();
        if ( email == null ) {
            return null;
        }
        return email;
    }

    private String userIdResumePhone(User user) {
        if ( user == null ) {
            return null;
        }
        Resume idResume = user.getIdResume();
        if ( idResume == null ) {
            return null;
        }
        String phone = idResume.getPhone();
        if ( phone == null ) {
            return null;
        }
        return phone;
    }

    private String userIdResumeAddress(User user) {
        if ( user == null ) {
            return null;
        }
        Resume idResume = user.getIdResume();
        if ( idResume == null ) {
            return null;
        }
        String address = idResume.getAddress();
        if ( address == null ) {
            return null;
        }
        return address;
    }

    private LocalDate userIdResumeBirthday(User user) {
        if ( user == null ) {
            return null;
        }
        Resume idResume = user.getIdResume();
        if ( idResume == null ) {
            return null;
        }
        LocalDate birthday = idResume.getBirthday();
        if ( birthday == null ) {
            return null;
        }
        return birthday;
    }

    private String userIdRoleName(User user) {
        if ( user == null ) {
            return null;
        }
        Role idRole = user.getIdRole();
        if ( idRole == null ) {
            return null;
        }
        String name = idRole.getName();
        if ( name == null ) {
            return null;
        }
        return name;
    }

    private String userIdTitleName(User user) {
        if ( user == null ) {
            return null;
        }
        Title idTitle = user.getIdTitle();
        if ( idTitle == null ) {
            return null;
        }
        String name = idTitle.getName();
        if ( name == null ) {
            return null;
        }
        return name;
    }
}
