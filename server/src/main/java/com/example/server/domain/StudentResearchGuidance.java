package com.example.server.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "student_research_guidance")
public class StudentResearchGuidance extends EntityBase implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;


//    @Column(name = "members", length = 250)
//    private String members;

    @Column(name = "supervisor_name", length = 250)
    private String supervisorName;

    @Column(name = "start_time")
    private LocalDate startTime;

    @Column(name = "end_time")
    private LocalDate endTime;

    @Column(name = "status")
    private Integer status;

    @Column(name = "result")
    private Integer result;

    @Column(name = "id_event")
    private Integer idEvent;

}