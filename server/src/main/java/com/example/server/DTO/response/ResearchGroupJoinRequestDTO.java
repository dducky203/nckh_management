package com.example.server.DTO.response;

import java.util.Date;

public class ResearchGroupJoinRequestDTO {

    public Long id;
    public Integer groupId;
    public String groupName;
    public Integer userId;
    public String userName;
    public String staffCode;
    public String email;
    public String title;
    public String status;
    public String message;
    public String rejectReason;
    public Date createdAt;
    public Date reviewedAt;
}
