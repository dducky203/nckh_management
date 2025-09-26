package com.example.server.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
@Entity
@Table(name = "operating_standards")
public class OperatingStandard extends EntityBase implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

//    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_type_of_criteria", nullable = false)
    private Integer idTypeOfCriteria;

    @Column(name = "criteria", length = 250)
    private String criteria;

    @Column(name = "unit", length = 150)
    private String unit;

    @Column(name = "GS_PGS")
    private Integer GS_PGS;

    @Column(name = "TS")
    private Integer TS;

    @Column(name = "ThS")
    private Integer ThS;

    @Column(name = "KS_CN")
    private Integer KS_CN;
}