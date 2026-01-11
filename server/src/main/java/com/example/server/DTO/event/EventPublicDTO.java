package com.example.server.DTO.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EventPublicDTO {
    private Integer id;
    private String eventName;
    private LocalDate dateOfEvent;
    private LocalDateTime startTime; // Datetime bắt đầu
    private LocalDateTime endTime; // Datetime kết thúc
    private String startTimeDetail; // Giờ chi tiết từ bảng Time (VD: "07:00:00")
    private String endTimeDetail; // Giờ chi tiết từ bảng Time (VD: "11:00:00")
    private String location; // from Room
    private Integer roomId; // ID của room được chọn
    private String organizer; // from User (creator)
    private Integer creator; // User ID của người tạo
    private String type; // from TypeOfCriterion
    private String image; // from Conference/Seminar - banner URL
    private String description; // from Conference/Seminar
    private String status; // upcoming, pending, completed, rejected
    private Date createdAt;
    private Date updatedAt;

    private String contactEmail;
    private String contactPhone;
    private Integer maxParticipants;
    private String articleLink;
    private String bannerImg; // URL của banner image được upload
}
