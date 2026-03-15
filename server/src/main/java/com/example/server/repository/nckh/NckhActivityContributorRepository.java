package com.example.server.repository.nckh;

import com.example.server.domain.nckh.NckhActivityContributor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NckhActivityContributorRepository extends JpaRepository<NckhActivityContributor, Long> {
    List<NckhActivityContributor> findByActivityId(Long activityId);

    List<NckhActivityContributor> findByUserId(Integer userId);

    void deleteByActivityId(Long activityId);
}
