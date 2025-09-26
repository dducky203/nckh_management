package com.example.server.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
@Entity
@Table(name = "time_conversion")
public class TimeConversion extends EntityBase implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_type_of_criteria", nullable = false)
    private TypeOfCriterion idTypeOfCriteria;

    @Column(name = "criteria", length = 250)
    private String criteria;

    @Column(name = "unit", length = 150)
    private String unit;

    @Column(name = "norm", nullable = false)
    private Integer norm;

}