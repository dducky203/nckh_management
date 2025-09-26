package com.example.server.domain;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.math.BigDecimal;

@Getter
@Setter
@Entity
@Table(name = "ncm")
public class Ncm extends EntityBase implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_user", nullable = false)
    private User idUser;

    @Column(name = "role_of_team", nullable = false)
    private Integer roleOfTeam;

    @Column(name = "norm")
    private Float norm;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_operating_standard")
    private OperatingStandards2 idOperatingStandard;

    @Column(name = "role_of_activity")
    private Integer roleOfActivity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_group")
    private Group idGroup;

    @Column(name = "year")
    private Integer year;

    @Column(name = "status")
    private Integer status;

}