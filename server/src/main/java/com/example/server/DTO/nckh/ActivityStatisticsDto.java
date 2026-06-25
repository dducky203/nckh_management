package com.example.server.DTO.nckh;

import com.example.server.service.nckh.NckhGroupQuotaRules;

/**
 * Thống kê hoạt động theo tiêu chí; thành viên nhóm định mức dùng giờ chia đều từ tổng nhóm.
 */
public class ActivityStatisticsDto implements ActivityStatisticsResponse {

    private String catalogCode;
    private String catalogName;
    private String unit;
    private Long participationCount;
    private Double totalQty;
    private Double totalQuotaHours;
    private Double avgParticipantsN;
    private Integer phuongAn;
    private String chucDanh;
    /** Giờ chỉ từ hoạt động cá nhân (trước khi cộng nhóm). */
    private Double ownQuotaHours;
    /** Giờ nhóm chia đều cho tiêu chí (= tổng nhóm ÷ số TV). */
    private Double groupHoursCredit;
    /** Giờ được tính sau khi cộng phần nhóm (dùng cho xét đạt, không hiển thị là giờ tự làm). */
    private Double creditedQuotaHours;

    public static ActivityStatisticsDto from(ActivityStatisticsResponse src) {
        ActivityStatisticsDto d = new ActivityStatisticsDto();
        d.catalogCode = src.getCatalogCode();
        d.catalogName = src.getCatalogName();
        d.unit = src.getUnit();
        d.participationCount = src.getParticipationCount();
        d.totalQty = src.getTotalQty();
        d.totalQuotaHours = src.getTotalQuotaHours();
        d.avgParticipantsN = src.getAvgParticipantsN();
        d.phuongAn = src.getPhuongAn();
        d.chucDanh = src.getChucDanh();
        d.ownQuotaHours = src.getTotalQuotaHours() != null ? src.getTotalQuotaHours() : 0.0;
        d.groupHoursCredit = 0.0;
        return d;
    }

    public static ActivityStatisticsDto fromGroupRow(ActivityStatisticsResponse groupRow, double groupHoursCredit) {
        ActivityStatisticsDto d = new ActivityStatisticsDto();
        d.catalogCode = groupRow.getCatalogCode();
        d.catalogName = groupRow.getCatalogName();
        d.unit = groupRow.getUnit();
        d.participationCount = 0L;
        d.totalQty = 0.0;
        d.ownQuotaHours = 0.0;
        d.groupHoursCredit = groupHoursCredit;
        d.creditedQuotaHours = groupHoursCredit;
        d.totalQuotaHours = 0.0;
        d.avgParticipantsN = groupRow.getAvgParticipantsN();
        d.phuongAn = groupRow.getPhuongAn();
        d.chucDanh = groupRow.getChucDanh();
        return d;
    }

    /** Giờ hiển thị cá nhân = tự làm; creditedQuotaHours = tự làm + phần nhóm (nếu có). */
    public void applyGroupHoursFromTeam(double myHours, double groupHours, int memberCount) {
        ownQuotaHours = myHours;
        groupHoursCredit = NckhGroupQuotaRules.perMemberGroupHours(groupHours, memberCount);
        creditedQuotaHours = NckhGroupQuotaRules.creditedHoursForGroupMember(myHours, groupHours, memberCount);
        totalQuotaHours = myHours;
    }

    @Override
    public String getCatalogCode() {
        return catalogCode;
    }

    @Override
    public String getCatalogName() {
        return catalogName;
    }

    @Override
    public String getUnit() {
        return unit;
    }

    @Override
    public Long getParticipationCount() {
        return participationCount;
    }

    @Override
    public Double getTotalQty() {
        return totalQty;
    }

    @Override
    public Double getTotalQuotaHours() {
        return totalQuotaHours;
    }

    @Override
    public Double getAvgParticipantsN() {
        return avgParticipantsN;
    }

    @Override
    public Integer getPhuongAn() {
        return phuongAn;
    }

    @Override
    public String getChucDanh() {
        return chucDanh;
    }

    public Double getOwnQuotaHours() {
        return ownQuotaHours;
    }

    public Double getGroupHoursCredit() {
        return groupHoursCredit;
    }

    public Double getCreditedQuotaHours() {
        return creditedQuotaHours;
    }

    public void setPlanContext(Integer phuongAn, String chucDanh) {
        this.phuongAn = phuongAn;
        this.chucDanh = chucDanh;
    }
}
