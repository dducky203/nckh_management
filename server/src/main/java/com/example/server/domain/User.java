package com.example.server.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.checkerframework.common.aliasing.qual.Unique;
import java.io.Serializable;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "user")
public class User extends EntityBase implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Column(name = "name", length = 250)
    private String name;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_role")
    private Role idRole;

    @Column(name = "username",unique = true, length = 250)
    private String username;

    @Column(name = "password", length = 250)
    private String password;

    @Column(name = "avatar", length = 250)
    private String avatar;

    @Column(name = "power")
    private Integer power;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_resume", unique = true)
    private Resume idResume;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    @JoinColumn(name = "id_title")
    private Title idTitle;

    @Column(name = "in_active")
    private Boolean inActive = false;
    @Column(name = "is_deleted")
    private Boolean isDeleted = false;


    public User(Integer id) {
        this.id = id;
    }
}