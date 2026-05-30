package com.example.server.service.nckh;

import com.example.server.domain.nckh.NckhActivityContributor;

import org.springframework.stereotype.Service;

@Service
public class NckhComputeService {

    public static class ComputeResult {
        public final double hoursShare;
        public final double equivQty;

        public ComputeResult(double hoursShare, double equivQty) {
            this.hoursShare = hoursShare;
            this.equivQty = equivQty;
        }
    }

    public ComputeResult compute(double qty, double S, int n, NckhActivityContributor.Role role) {
        if (n <= 0)
            n = 1;
        double base = (2.0) / (3.0 * n);
        double factor = (role == NckhActivityContributor.Role.MAIN) ? (1.0 / 3.0 + base) : base;
        double hoursShare = qty * S * factor;
        double equivQty = (S == 0) ? 0 : (hoursShare / S);
        return new ComputeResult(hoursShare, equivQty);
    }

    /**
     * Ước lượng thủ công khi nhập số lượng (máy tính định mức): đơn vị tương đương định mức số lượng × qty,
     * không phải giờ quy đổi NCKH. Giờ thực tế lấy từ {@code hours_share} trên hoạt động đã duyệt.
     */
    public Double computeGroupMemberQuota(double qty, String groupType, String tieuChiCode,
                                          String chucDanh, boolean isLeader) {
        Double coeff = NckhGroupQuotaRules.getMemberRequiredQty(groupType, tieuChiCode, chucDanh, isLeader);
        if (coeff == null) return null;
        return coeff * qty;
    }

    public Double getMemberRequiredQty(String groupType, String tieuChiCode,
                                       String chucDanh, boolean isLeader) {
        return NckhGroupQuotaRules.getMemberRequiredQty(groupType, tieuChiCode, chucDanh, isLeader);
    }

    public double getMemberFactor(String groupType) {
        return NckhGroupQuotaRules.getMemberFactor(groupType);
    }
}
