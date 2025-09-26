package com.example.server.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
@Entity
@Table(name = "conference")
public class Conference extends EntityBase implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Column(name = "paper_title", length = 250)
    private String paperTitle;

    @Column(name = "organizer_decision", length = 250)
    private String organizerDecision;

//    @Column(name = "attendance_list", length = 250)
//    private String attendanceList;

    @Column(name = "minutes_of_meeting", length = 250)
    private String minutesOfMeeting;

    @Column(name = "article_link", length = 250)
    private String articleLink;

    @Column(name = "presentation_files", length = 250)
    private String presentationFiles;

//    @Column(name = "paper_members_count")
//    private Integer paperMembersCount;
//
//    @Column(name = "paper_members", length = 250)
//    private String paperMembers;

    @Column(name = "id_event")
    private Integer idEvent;

    @Column(name = "image")
    private String image;

}