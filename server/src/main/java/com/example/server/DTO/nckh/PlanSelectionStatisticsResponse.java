package com.example.server.DTO.nckh;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public class PlanSelectionStatisticsResponse {
    public Integer academicYear;
    public Long totalUsers;
    public Long selectedUsers;
    public Map<Integer, Long> planCounts = new LinkedHashMap<>();
    public List<PlanSelectionStatisticsRow> rows;
}
