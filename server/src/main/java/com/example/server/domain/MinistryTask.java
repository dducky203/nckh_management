package com.example.server.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
@Entity
@Table(name = "ministry_task")
public class MinistryTask extends EntityBase implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "task_id", nullable = false)
    private Integer id;

    @OneToOne
    @JoinColumn(name = "task_lead")
    private User taskLead;

    @OneToOne
    @JoinColumn(name = "secretary")
    private User secretary;

    @Column(name = "id_event")
    private Integer idEvent;

}