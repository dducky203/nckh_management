package com.example.server.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

/**
 * Cột {@code research_group.status} trên DB cũ thường là ENUM chỉ có PENDING/APPROVED/REJECTED.
 * Nhóm SV cần PENDING_ADVISOR và PENDING_ADMIN — migrate sang VARCHAR(50) khi khởi động.
 */
@Slf4j
@Component
@Order(0)
public class ResearchGroupStatusColumnMigration implements ApplicationRunner {

    private final JdbcTemplate jdbcTemplate;

    public ResearchGroupStatusColumnMigration(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(ApplicationArguments args) {
        try {
            String columnType = jdbcTemplate.queryForObject(
                    """
                    SELECT COLUMN_TYPE
                    FROM INFORMATION_SCHEMA.COLUMNS
                    WHERE TABLE_SCHEMA = DATABASE()
                      AND TABLE_NAME = 'research_group'
                      AND COLUMN_NAME = 'status'
                    """,
                    String.class);

            if (columnType == null) {
                return;
            }

            String normalized = columnType.toLowerCase();
            if (normalized.startsWith("varchar(50)")) {
                return;
            }

            log.info("Migrating research_group.status from {} to VARCHAR(50)", columnType);
            jdbcTemplate.execute(
                    "ALTER TABLE research_group MODIFY COLUMN status VARCHAR(50) NOT NULL DEFAULT 'PENDING'");
            log.info("research_group.status migration completed.");
        } catch (Exception e) {
            log.warn("Could not migrate research_group.status column: {}", e.getMessage());
        }
    }
}
