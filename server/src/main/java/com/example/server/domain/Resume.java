package com.example.server.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


import java.io.Serializable;
import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "resume")
public class Resume extends EntityBase implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Column(name = "email", unique = true, nullable = false, length = 256)
    private String email;

    @Column(name = "phone", unique = true, nullable = false, length = 10)
    private String phone;

    @Column(name = "address", nullable = false, length = 250)
    private String address;

    @Column(name = "birthday", nullable = false)
    private LocalDate birthday;


    public Resume(Integer id) {
        this.id = id;
    }

}