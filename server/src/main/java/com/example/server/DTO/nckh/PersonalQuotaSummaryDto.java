package com.example.server.DTO.nckh;

import java.util.List;

/**
 * Bao bọc kết quả thống kê cá nhân với % hoàn thành và thông tin nhóm.
 * - personalCompletionPercent: % hoàn thành cá nhân (tổng giờ thực / tổng giờ yêu cầu)
 * - groupCompletionPercent: % hoàn thành nhóm (null nếu không thuộc nhóm)
 * - effectiveCompletionPercent: % thực tế = min(personal, group) — bị giới hạn bởi nhóm
 * - overallCompleted: true nếu effectivePercent >= 100
 */
public class PersonalQuotaSummaryDto {

    /** Danh sách tiêu chí thống kê (giữ nguyên cấu trúc cũ). */
    public List<ActivityStatisticsResponse> criteria;

    /** Tổng giờ tối thiểu phải đạt theo phương án + chức danh. */
    public double requiredTotalHours;

    /** Tổng giờ thực tế đã đạt (APPROVED). */
    public double actualTotalHours;

    /** % hoàn thành cá nhân = min(actualTotalHours / requiredTotalHours, 1.0) × 100. */
    public double personalCompletionPercent;

    /** % hoàn thành nhóm (null nếu user không thuộc nhóm NCM/Xuất sắc/Tinh hoa). */
    public Double groupCompletionPercent;

    /** % thực tế = min(personalCompletionPercent, groupCompletionPercent). */
    public double effectiveCompletionPercent;

    /** Hoàn thành phương án: effectivePercent >= 100. */
    public boolean overallCompleted;

    /** Tên nhóm mà user đang tham gia (null nếu không thuộc nhóm). */
    public String groupName;

    /** Định mức chuẩn nhóm = tổng giờ quy đổi phải đạt của tất cả thành viên. */
    public Double groupRequiredTotalHours;

    /** Tổng giờ thực tế của toàn nhóm. */
    public Double groupActualTotalHours;

    /** Phương án đã chọn. */
    public Integer planId;

    /** Chức danh. */
    public String chucDanh;
}
