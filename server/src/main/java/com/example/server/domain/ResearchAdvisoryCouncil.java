package com.example.server.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
@Entity
@Table(name = "research_advisory_council")
public class ResearchAdvisoryCouncil extends EntityBase implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;


    @Column(name = "task_description", length = 250)
    private String taskDescription;

    @Column(name = "document_template", length = 250)
    private String documentTemplate;

    @Column(name = "id_event")
    private Integer idEvent;

    @Column(name = "image")
    private String image;
}