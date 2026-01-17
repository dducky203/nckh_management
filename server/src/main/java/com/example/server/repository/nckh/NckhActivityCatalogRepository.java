package com.example.server.repository.nckh;

import com.example.server.domain.nckh.NckhActivityCatalog;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NckhActivityCatalogRepository extends JpaRepository<NckhActivityCatalog, String> {
    List<NckhActivityCatalog> findByIsActiveTrueOrderByMetricKeyAscCatalogCodeAsc();
}
