package com.example.server.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

/**
 * Thêm các cột địa chỉ có cấu trúc vào bảng resume nếu chưa tồn tại.
 */
@Slf4j
@Component
@Order(1)
public class ResumeAddressColumnMigration implements ApplicationRunner {

    private final JdbcTemplate jdbcTemplate;

    public ResumeAddressColumnMigration(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(ApplicationArguments args) {
        addColumnIfMissing("province_code", "VARCHAR(20) NULL");
        addColumnIfMissing("ward_code", "VARCHAR(20) NULL");
        addColumnIfMissing("address_detail", "VARCHAR(250) NULL");
    }

    private void addColumnIfMissing(String columnName, String columnDefinition) {
        try {
            Integer count = jdbcTemplate.queryForObject(
                    """
                    SELECT COUNT(*)
                    FROM INFORMATION_SCHEMA.COLUMNS
                    WHERE TABLE_SCHEMA = DATABASE()
                      AND TABLE_NAME = 'resume'
                      AND COLUMN_NAME = ?
                    """,
                    Integer.class,
                    columnName);

            if (count != null && count > 0) {
                return;
            }

            log.info("Adding resume.{} column", columnName);
            jdbcTemplate.execute(
                    "ALTER TABLE resume ADD COLUMN " + columnName + " " + columnDefinition);
            log.info("resume.{} migration completed.", columnName);
        } catch (Exception e) {
            log.warn("Could not migrate resume.{} column: {}", columnName, e.getMessage());
        }
    }
}
