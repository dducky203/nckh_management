package com.example.server.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "role_of_event")
public class RoleOfEvent extends EntityBase  {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Column(name = "role_of_event")
    private Integer roleOfEvent;

    @Column(name = "max_member")
    private Integer maxMember;

    @Column(name = "norm")
    private Float norm;



}