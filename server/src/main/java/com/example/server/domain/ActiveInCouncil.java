package com.example.server.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
@Entity
@Table(name = "active_in_council")
public class ActiveInCouncil extends EntityBase implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Column(name = "content", length = 500)
    private String content;

    @Column(name = "presenter", length = 250)
    private String presenter;

    @Column(name = "presentation_file", length = 250)
    private String presentationFile;

    @Column(name = "minutes_of_meeting", length = 250)
    private String minutesOfMeeting;

    @Column(name = "image", length = 250)
    private String image;

//    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_event")
    private Integer idEvent;

}