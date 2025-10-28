package com.example.server.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "admin")
public class Admin extends EntityBase implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Column(name = "name", length = 250)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_role")
    private Role idRole;

//    @Column(name = "update_date")
//    private Instant updateDate;

//    @Column(name = "create_date")
//    private Instant createDate;

    @Column(name = "username", length = 250)
    private String username;

    @Column(name = "password", length = 250)
    private String password;
    //
//    @Column(name = "power")
//    private Integer power;
    @Column(name = "in_active")
    private Boolean inActive = false;
    @Column(name = "is_deleted")
    private Boolean isDeleted = false;

}