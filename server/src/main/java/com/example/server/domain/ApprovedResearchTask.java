package com.example.server.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.time.Instant;
import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "approved_research_task")
public class ApprovedResearchTask extends EntityBase implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Column(name = "task_type", length = 250)
    private String taskType;

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