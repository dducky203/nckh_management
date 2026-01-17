package com.example.server.service.nckh;

import com.example.server.DTO.nckh.DashboardResponse;
import com.example.server.domain.nckh.NckhActivity;
import com.example.server.repository.nckh.NckhActivityContributorRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;

@Service
public class NckhDashboardService {

    private final EntityManager em;

    public NckhDashboardService(EntityManager em) {
        this.em = em;
    }

    public DashboardResponse personal(Integer userId, Integer year) {
        DashboardResponse res = new DashboardResponse();
        res.academicYear = year;

        // total hours (APPROVED)
        Query q1 = em.createNativeQuery("""
                    SELECT COALESCE(SUM(c.hours_share),0)
                    FROM nckh_activity a
                    JOIN nckh_activity_contributor c ON c.activity_id = a.id
                    WHERE a.academic_year = :y AND a.status = 'APPROVED' AND c.user_id = :uid
                """);
        q1.setParameter("y", year);
        q1.setParameter("uid", userId);
        res.totalHours = ((Number) q1.getSingleResult()).doubleValue();

        // equiv qty by metric_key
        Query q2 = em.createNativeQuery("""
                    SELECT cat.metric_key, COALESCE(SUM(c.equiv_qty),0) AS s
                    FROM nckh_activity a
                    JOIN nckh_activity_contributor c ON c.activity_id = a.id
                    JOIN nckh_activity_catalog cat ON cat.catalog_code = a.catalog_code
                    WHERE a.academic_year = :y AND a.status = 'APPROVED' AND c.user_id = :uid
                    GROUP BY cat.metric_key
                """);
        q2.setParameter("y", year);
        q2.setParameter("uid", userId);

        List<Object[]> rows = q2.getResultList();
        res.equivByMetricKey = new HashMap<>();
        for (Object[] r : rows) {
            res.equivByMetricKey.put(String.valueOf(r[0]), ((Number) r[1]).doubleValue());
        }

        return res;
    }
}
