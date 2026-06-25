package com.example.server.DTO.nckh;

/** Tổng hours_share theo user từ hoạt động APPROVED. */
public interface UserHoursSumProjection {
    Integer getUserId();
    Double getTotalHours();
}
