package com.example.server.DTO.nckh;

import java.time.LocalDate;

public interface GroupQuotaActivityProjection {
    Long getActivityId();
    String getTitle();
    String getCatalogCode();
    String getCatalogName();
    String getUnit();
    Double getEquivQty();
    Double getHoursShare();
    Integer getUserId();
    LocalDate getActivityDate();
}
