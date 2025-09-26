package com.example.server.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
@Entity
@Table(name = "news_image")
public class NewsImage extends EntityBase implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Column(name = "image_name", length = 500)
    private String imageName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_news")
    private News idNews;

}