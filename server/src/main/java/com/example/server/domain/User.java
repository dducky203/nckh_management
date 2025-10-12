package com.example.server.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.checkerframework.common.aliasing.qual.Unique;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.security.core.userdetails.UserDetails;

import java.io.Serializable;
import java.time.Instant;
import java.time.LocalDate;
import java.util.Date;

@Getter
@Setter
@Entity
@Table(name = "user")
public class User extends EntityBase implements Serializable  {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Column(name = "name", length = 250)
    private String name;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_role")
    private Role idRole;


//    @CreatedDate
////    @Temporal(TemporalType.TIMESTAMP)
//    @Column(name = "create_date", nullable = false, updatable = false,  insertable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
//    private LocalDate createDate;


//    @LastModifiedDate
////    @Temporal(TemporalType.TIMESTAMP)
//    @Column(name = "update_date", nullable = false, updatable = false,  insertable = false,   columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
//    private LocalDate updateDate;

    @Column(name = "username", length = 250)
    @Unique
    private String username;

    @Column(name = "password", length = 250)
    private String password;

    @Column(name = "power")
    private Integer power;

    @OneToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    @JoinColumn(
            name = "username",
            referencedColumnName = "code",
            insertable = false,
            updatable = false
    )
    private Resume idResume;


    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    @JoinColumn(name = "id_title")
    private Title idTitle;

    @Column(name = "in_active")
    private boolean inActive  = false;
    @Column(name = "is_deleted")
    private boolean isDeleted = false;

}