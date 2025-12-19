package com.example.server.mapper;

import com.example.server.DTO.users.UserRequest;
import com.example.server.domain.Resume;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-12-20T04:34:50+0700",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.44.0.v20251118-1623, environment: Java 21.0.9 (Eclipse Adoptium)"
)
@Component
public class ResumeMapperImpl implements ResumeMapper {

    @Override
    public Resume toEntity(UserRequest user) {
        if ( user == null ) {
            return null;
        }

        Resume resume = new Resume();

        resume.setAddress( user.getAddress() );
        resume.setBirthday( user.getBirthday() );
        resume.setEmail( user.getEmail() );
        resume.setId( user.getId() );
        resume.setPhone( user.getPhone() );

        return resume;
    }
}
