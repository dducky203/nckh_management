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
            upsert(catalogRepository, "SEMINAR_PRESENT", "Seminar trình bày chuyên đề", "bài", 10d, "SEMINAR");

            upsert(catalogRepository, "CONF_ORG_INTL", "Tổ chức hội thảo quốc tế", "lần", 100d, "CONFERENCE");
            upsert(catalogRepository, "CONF_ORG_NAT", "Tổ chức hội thảo quốc gia", "lần", 60d, "CONFERENCE");
            upsert(catalogRepository, "CONF_ORG_ACAD", "Tổ chức hội thảo học viện", "lần", 20d, "CONFERENCE");
            upsert(catalogRepository, "CONF_PRES_INTL", "Trình bày tại hội thảo quốc tế", "bài", 50d, "CONFERENCE");
            upsert(catalogRepository, "CONF_PRES_NAT", "Trình bày tại hội thảo quốc gia", "bài", 30d, "CONFERENCE");
            upsert(catalogRepository, "CONF_PRES_ACAD", "Trình bày tại hội thảo học viện", "bài", 20d, "CONFERENCE");

            upsert(catalogRepository, "INTL_WOS", "Bài báo quốc tế WoS", "bài", 210d, "INTL_PAPER");
            upsert(catalogRepository, "INTL_SCOPUS", "Bài báo quốc tế Scopus", "bài", 140d, "INTL_PAPER");
            upsert(catalogRepository, "INTL_ENG_ACAD", "Bài báo tiếng Anh học viện", "bài", 70d, "INTL_PAPER");
            upsert(catalogRepository, "INTL_OTHER", "Bài báo quốc tế khác", "bài", 60d, "INTL_PAPER");
            upsert(catalogRepository, "INTL_CITATION", "Bài báo được trích dẫn", "trích dẫn", 1d, "INTL_PAPER");

            upsert(catalogRepository, "VN_ACADEMY", "Bài báo tiếng Việt tạp chí học viện", "bài", 40d, "VN_PAPER");
            upsert(catalogRepository, "VN_OTHER", "Bài báo tiếng Việt tạp chí khác", "bài", 20d, "VN_PAPER");

            upsert(catalogRepository, "PROC_INTL", "Bài tham luận kỷ yếu quốc tế (fulltext)", "bài", 25d, "PROCEEDING");
            upsert(catalogRepository, "PROC_NAT", "Bài tham luận kỷ yếu quốc gia (fulltext)", "bài", 15d, "PROCEEDING");
            upsert(catalogRepository, "PROC_ACAD", "Bài tham luận kỷ yếu học viện (fulltext)", "bài", 10d, "PROCEEDING");

            upsert(catalogRepository, "REVIEW_PAPER", "Bài tổng quan lĩnh vực nghiên cứu", "bài", 10d, "REVIEW");
            upsert(catalogRepository, "TECH_CONSULT", "Hoạt động tư vấn / hướng dẫn kỹ thuật", "sản phẩm", 5d, "TECH_CONSULT");
            upsert(catalogRepository, "TECH_PROCEDURE", "Quy trình kỹ thuật / tiến bộ kỹ thuật", "sản phẩm", 10d, "TECH_PROCEDURE");

            upsert(catalogRepository, "PROPOSAL_NAT", "Đề xuất được đưa vào danh mục tuyển chọn cấp quốc gia", "đề xuất", 10d, "PROPOSAL");
            upsert(catalogRepository, "PROPOSAL_MINISTRY", "Đề xuất được đưa vào danh mục cấp bộ/tương đương", "đề xuất", 5d, "PROPOSAL");
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
