package com.example.server.projection;

import java.time.LocalDate;
import java.time.LocalTime;

public interface IEvent {

    Integer getId();
    String getEventName();
    LocalDate getDateOfEvent();
    LocalTime getCreateDate();
    Integer getCreator();
    Integer getStartTime();
    Integer getEndTime();
    Integer getIdOperatingStandard();
    Integer getIdRoom();
    Integer getDaysUntilEvent();
}
