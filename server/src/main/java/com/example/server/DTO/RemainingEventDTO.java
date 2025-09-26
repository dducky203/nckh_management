package com.example.server.DTO;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Setter
@Getter
public class RemainingEventDTO {
    private Integer id;
    private String name;
    private LocalDate date;
    private LocalTime time;

    public LocalDateTime getDateTimeOfEvent() {
        return LocalDateTime.of(date, time);
    }
}
