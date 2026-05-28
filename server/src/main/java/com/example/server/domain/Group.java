package com.example.server.domain;

import java.io.Serializable;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@Entity
@Table(name = "group")
@NoArgsConstructor
@AllArgsConstructor
public class Group  extends EntityBase implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Column(name = "group_name", length = 250)
    private String groupName;

    @Column(name = "status")
    private Integer status;

    public Group(int i) {
    }

}