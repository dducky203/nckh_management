package com.example.server.service.researchgroup;

import org.springframework.stereotype.Service;
import com.example.server.service.nckh.NckhComputeService;

/**
 * Service providing quota calculations specific to research groups.
 * This is a separate functionality from the generic NCKH activity processing.
 * It leverages the existing NckhComputeService logic for group based quotas.
 */
@Service
public class ResearchGroupQuotaService {

    private final NckhComputeService computeService;

    public ResearchGroupQuotaService(NckhComputeService computeService) {
        this.computeService = computeService;
    }

    /**
     * Calculate the quota (hours share) for a member in a research group.
     *
     * @param qty          the raw quantity (e.g., number of papers, seminars, etc.)
     * @param groupType    the type of the research group (e.g., NCM, XUAT_SAC, TINH_HOA)
     * @param tieuChiCode  the activity code (catalog code) used in quota tables
     * @param academicTitle the academic title of the member (e.g., GS/PGS, TS, THS, KS/CN)
     * @param isLeader     true if the member is the group leader
     * @return the calculated quota value (hours share) or null if not applicable
     */
    public Double calculateMemberQuota(double qty,
                                      String groupType,
                                      String tieuChiCode,
                                      String academicTitle,
                                      boolean isLeader) {
        // Delegate to the compute service which already implements the business rules.
        return computeService.computeGroupMemberQuota(qty, groupType, tieuChiCode, academicTitle, isLeader);
    }
}
