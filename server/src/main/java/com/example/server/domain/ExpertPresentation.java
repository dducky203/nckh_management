package com.example.server.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
@Entity
@Table(name = "expert_presentation")
public class ExpertPresentation extends EntityBase implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;


    @Column(name = "presentation_file", length = 250)
    private String presentationFile;

    @Column(name = "seminar_photo", length = 250)
    private String seminarPhoto;

    @Column(name = "minutes_of_meeting", length = 250)
    private String minutesOfMeeting;

//    @Column(name = "attendance_list", length = 250)
//    private String attendanceList;

    @Column(name = "presenter", length = 250)
    private String presenter;

    @Column(name = "id_event")
    private Integer idEvent;

}