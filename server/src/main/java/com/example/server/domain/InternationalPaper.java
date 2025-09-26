package com.example.server.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
@Entity
@Table(name = "international_paper")
public class InternationalPaper extends EntityBase implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;



//    @Column(name = "member_count")
//    private Integer memberCount;

    @Column(name = "main_author", length = 250)
    private String mainAuthor;

    @Column(name = "status")
    private Integer status;

    @Column(name = "article_link", length = 250)
    private String articleLink;

    @Column(name = "id_event")
    private Integer idEvent;

}