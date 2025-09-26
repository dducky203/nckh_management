package com.example.server.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.processing.Pattern;

import java.io.Serializable;
import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "resume")
public class Resume extends EntityBase implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_user")
    private User idUser;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_admin")
    private Admin idAdmin;

    @Column(name = "code", nullable = false)
    private String code;

    @Column(name = "email", nullable = false, length = 100)
    private String email;

    @Column(name = "phone", nullable = false, length = 10)
    private String phone;

    @Column(name = "address", nullable = false, length = 250)
    private String address;

    @Column(name = "birthday", nullable = false)
    private LocalDate birthday;

}