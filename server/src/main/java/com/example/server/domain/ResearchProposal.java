package com.example.server.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "research_proposal")
public class ResearchProposal extends EntityBase  {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;


    @Column(name = "proposal_type", length = 250)
    private String proposalType;

    @Column(name = "id_event")
    private Integer idEvent;

}