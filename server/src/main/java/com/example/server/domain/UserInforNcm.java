package com.example.server.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "user_infor_ncm")
public class UserInforNcm extends EntityBase implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_user")
    private User idUser;

    @Column(name = "status")
    private Integer status;

    @Column(name = "date_out")
    private LocalDate dateOut;

    @Column(name = "date_in")
    private LocalDate dateIn;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_group")
    private Group idGroup;

}