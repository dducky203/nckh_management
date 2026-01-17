package com.example.server.DTO.nckh;

import java.util.Map;

public class DashboardResponse {
    public Integer academicYear;
    public Double totalHours;
    public Map<String, Double> equivByMetricKey; // metric_key -> sum(equiv_qty)
}
