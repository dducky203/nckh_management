package com.example.server.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Table(name = "type_of_criteria")
public class TypeOfCriterion extends EntityBase implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Column(name = "name", length = 256)
    private String name;

    @Column(name = "is_event")
    private boolean isEvent;

}