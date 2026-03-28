package com.example.server.config;

import com.example.server.domain.nckh.NckhActivityCatalog;
import com.example.server.repository.nckh.NckhActivityCatalogRepository;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class NckhCatalogInitConfig {

    @Bean
    ApplicationRunner nckhCatalogInitializer(NckhActivityCatalogRepository catalogRepository) {
        return args -> {
            upsert(catalogRepository, "SEMINAR_TRINH_BAY", "Trình bày Seminar", "Lần/năm", 10d, "SEMINAR");
            upsert(catalogRepository, "SEMINAR_THAM_DU", "Tham dự Seminar", "Lần/năm", 5d, "SEMINAR");

            upsert(catalogRepository, "HT_THAM_LUAN", "Bài tham luận trình bày tại hội thảo", "Bài/năm", 30d, "CONFERENCE");
            upsert(catalogRepository, "HT_THAM_GIA", "Tham gia hội thảo", "Lần/năm", 10d, "CONFERENCE");

            upsert(catalogRepository, "BB_WOS_SCOPUS", "Bài báo quốc tế WoS/Scopus", "Bài/năm", 210d, "INTL_PAPER");
            upsert(catalogRepository, "BB_SCOPUS", "Bài báo Scopus", "Bài/năm", 140d, "INTL_PAPER");
            upsert(catalogRepository, "BB_TA_HOCVIEN", "Bài báo tiếng Anh Học viện", "Bài/năm", 70d, "INTL_PAPER");
            upsert(catalogRepository, "BB_TV_HOCVIEN", "Bài báo tiếng Việt (Tạp chí Học viện)", "Bài/năm", 40d, "VN_PAPER");

            upsert(catalogRepository, "BTL_FULL_TEXT", "Bài tham luận hội thảo (full text)", "Bài/năm", 25d, "PROCEEDING");
            upsert(catalogRepository, "TONG_QUAN", "Bài tổng quan lĩnh vực nghiên cứu", "Bài/năm", 10d, "REVIEW_PAPER");

            upsert(catalogRepository, "TU_VAN_BAN_TIN", "Tư vấn/Hướng dẫn KT/Bản tin KH&CN", "SP/năm/người", 5d, "TECH_CONSULT");
            upsert(catalogRepository, "DE_XUAT_BO", "Đề xuất nhiệm vụ cấp Bộ và tương đương", "Đề xuất/năm", 5d, "PROPOSAL");

            upsert(catalogRepository, "DT_BO_CHUNHIEM", "Đề tài cấp Bộ và tương đương (chủ trì)", "NV/năm", 70d, "PROJECT");
            upsert(catalogRepository, "HD_SVNCKH", "Hướng dẫn nhóm SV NCKH / Hợp đồng KH&CN", "NV/năm", 15d, "PROJECT");
            upsert(catalogRepository, "HOI_DONG_TU_VAN", "Hội đồng tư vấn KH định hướng NC", "Hội đồng/năm", 20d, "SERVICE");
            upsert(catalogRepository, "MOI_CHUYEN_GIA", "Tham dự Seminar/chuyên đề do chuyên gia", "Lần/năm", 15d, "SERVICE");
        };
    }

    private void upsert(
            NckhActivityCatalogRepository repo,
            String code,
            String name,
            String unit,
            Double quotaHours,
            String metricKey) {
        NckhActivityCatalog item = repo.findById(code).orElseGet(NckhActivityCatalog::new);
        item.setCatalogCode(code);
        item.setName(name);
        item.setUnit(unit);
        item.setQuotaHours(quotaHours);
        item.setMetricKey(metricKey);
        item.setIsShareable(true);
        item.setIsActive(true);
        repo.save(item);
    }
}
