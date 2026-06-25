package com.example.server.DTO.nckh;

import java.util.List;

/**
 * Bao bọc kết quả thống kê cá nhân với % hoàn thành và thông tin nhóm.
 * <p>
 * Quy tắc nhóm chỉ áp dụng khi {@link #inQuotaGroup} = true (NCM / Xuất sắc / Tinh hoa đã duyệt).
 * Nếu không thuộc 3 nhóm đó: chỉ tính % cá nhân, đạt khi cá nhân ≥ 100%.
 */
public class PersonalQuotaSummaryDto {

    /** Danh sách tiêu chí thống kê (giữ nguyên cấu trúc cũ). */
    public List<ActivityStatisticsResponse> criteria;

    /** Tổng giờ tối thiểu phải đạt theo phương án + chức danh. */
    public double requiredTotalHours;

    /** Tổng giờ tự làm (chỉ hoạt động cá nhân, không cộng phần nhóm chia sang). */
    public double ownActualTotalHours;

    /** Tổng giờ được tính sau khi cộng phần nhóm (dùng xét đạt khi cần). */
    public Double creditedActualTotalHours;

    /** Tổng giờ thực tế đã đạt — bằng {@link #ownActualTotalHours} (giờ tự làm). */
    public double actualTotalHours;

    /** % hoàn thành cá nhân = min(actualTotalHours / requiredTotalHours, 1.0) × 100. */
    public double personalCompletionPercent;

    /** % hoàn thành nhóm = min(tổng giờ nhóm / định mức chuẩn nhóm, 1.0) × 100. */
    public Double groupCompletionPercent;

    /** % thực tế: nhóm ≥ 100% → 100%; nhóm &lt; 100% → min(cá nhân, nhóm). */
    public double effectiveCompletionPercent;

    /** Hoàn thành phương án theo quy tắc nhóm (xem NckhGroupQuotaRules.isPlanOverallCompleted). */
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

    /** true nếu user thuộc 1 trong 3 nhóm định mức (NCM / Xuất sắc / Tinh hoa) đã duyệt. */
    public boolean inQuotaGroup;
}
