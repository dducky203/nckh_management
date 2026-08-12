CREATE TABLE IF NOT EXISTS home_page_versions (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  configuration LONGTEXT NOT NULL,
  status VARCHAR(20) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_by INT NULL,
  INDEX idx_home_page_status_created (status, created_at)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
