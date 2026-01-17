package com.example.server.DTO.nckh;

public class CreateActivityRequest {
    public Integer academicYear;
    public Integer researchGroupId; // nullable
    public String catalogCode;
    public Double qty; // nullable -> default 1
    public String title;
    public String description;
}
