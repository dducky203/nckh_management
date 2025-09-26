package com.example.server.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
@Entity
@Table(name = "research_proposal")
public class ResearchProposal extends EntityBase implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;


    @Column(name = "proposal_type", length = 250)
    private String proposalType;

    @Column(name = "id_event")
    private Integer idEvent;

}