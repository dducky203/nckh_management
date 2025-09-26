package com.example.server.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
@Entity
@Table(name = "operating_standards_2")
public class OperatingStandards2 extends EntityBase implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_type_of_criteria")
    private TypeOfCriterion idTypeOfCriteria;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_operating_standard")
    private OperatingStandard idOperatingStandard;

    @Column(name = "catalog", length = 250)
    private String catalog;

    @Column(name = "name", length = 250)
    private String name;

    @Column(name = "unit", length = 100)
    private String unit;

}