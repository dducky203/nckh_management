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

    // Công thức bạn yêu cầu:
    // MAIN: qty*S*(1/3 + 2/(3*n))
    // MEMBER: qty*S*(2/(3*n))
    public ComputeResult compute(double qty, double S, int n, NckhActivityContributor.Role role) {
        if (n <= 0)
            n = 1;
        double base = (2.0) / (3.0 * n);
        double factor = (role == NckhActivityContributor.Role.MAIN) ? (1.0 / 3.0 + base) : base;
        double hoursShare = qty * S * factor;
        double equivQty = (S == 0) ? 0 : (hoursShare / S);
        return new ComputeResult(hoursShare, equivQty);
    }
}
