package com.example.server.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "like_news")
public class LikeNews  extends EntityBase implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Column(name = "id_user")
    private Integer idUser;

    @Column(name = "id_news")
    private Integer idNews;

    @Column(name = "time")
    private LocalDateTime time;

}