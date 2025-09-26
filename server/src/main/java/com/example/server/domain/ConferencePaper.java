package com.example.server.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
@Entity
@Table(name = "conference_paper")
public class ConferencePaper extends EntityBase implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;


//    @Column(name = "member_count")
//    private Integer memberCount;
//
//    @Column(name = "members", length = 250)
//    private String members;

    @Column(name = "conference_proceedings_file", length = 250)
    private String conferenceProceedingsFile;

    @Column(name = "conference_name")
    private String conferenceName;

    @Column(name = "id_event")
    private Integer idEvent;

}