package com.example.server.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
@Entity
@Table(name = "seminar")
public class Seminar extends EntityBase implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;


//    @Column(name = "member_count")
//    private Integer memberCount;

    @Column(name = "main_author", length = 250)
    private String mainAuthor;

    @Column(name = "presentation_file", length = 250)
    private String presentationFile;

    @Column(name = "seminar_photo", length = 250)
    private String seminarPhoto;

    @Column(name = "minutes_of_meeting", length = 250)
    private String minutesOfMeeting;

//    @Column(name = "attendance_list")
//    private String attendanceList;

    @Column(name = "article_link")
    private String articleLink;

    @Column(name = "id_event")
    private Integer idEvent;

}