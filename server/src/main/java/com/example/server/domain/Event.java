package com.example.server.domain;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "event")
public class Event extends EntityBase implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Column(name = "event_name")
    private String eventName;

    @Column(name = "date_of_event")
    private LocalDate dateOfEvent;

    @Column(name = "creator")
    private Integer creator;

    @Column(name = "start_time")
    private LocalDateTime startTime;

    @Column(name = "end_time")
    private LocalDateTime endTime;

    // @ManyToOne(fetch = FetchType.LAZY)
    @Column(name = "id_operating_standard_2")
    private Integer idOperatingStandard2;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_room")
    private Room idRoom;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "type_id")
    private TypeOfCriterion typeId;

    @Column(name = "status")
    private String status; // upcoming, pending, completed, rejected

    @Column(name = "is_delete")
    private Integer isDelete;

    @Column(name = "banner_img")
    private String bannerImg;

    @Column(name = "reason")
    private String Reason;
}