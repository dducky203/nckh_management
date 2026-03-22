package com.example.server.DTO.nckh;

// Xóa bỏ hoàn toàn class và các annotation của Lombok
public interface ActivityStatisticsResponse {

    String getCatalogCode();

    String getCatalogName();

    String getUnit();

    Long getParticipationCount();

    Double getTotalQty();

    Double getTotalQuotaHours();

    Double getAvgParticipantsN();

    Integer getPhuongAn();

    String getChucDanh();
}