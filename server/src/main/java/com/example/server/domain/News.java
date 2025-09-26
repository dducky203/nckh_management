package com.example.server.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.w3c.dom.Text;

import java.io.Serializable;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "news")
public class News extends EntityBase implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Column(name = "title", length = 500)
    private String title;

    @Lob
    @Column(name = "content",length = 1000)
    private String content;

    @Column(name = "time")
    private LocalDateTime time;

    @Column(name = "status")
    private Integer status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_user")
    private User user;

}