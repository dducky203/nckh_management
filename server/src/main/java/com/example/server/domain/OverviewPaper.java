package com.example.server.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
@Entity
@Table(name = "overview_paper")
public class OverviewPaper extends EntityBase implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;


//    @Column(name = "member_count")
//    private Integer memberCount;
//
//    @Column(name = "member_list", length = 250)
//    private String memberList;

    @Column(name = "article_link", length = 250)
    private String articleLink;

    @Column(name = "id_event")
    private Integer idEvent;

}