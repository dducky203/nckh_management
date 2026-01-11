-- Migration: Thêm title "Thư ký" vào database
-- Các title: Thư ký, Trưởng khoa, Phó khoa sẽ có quyền admin

INSERT INTO `title` (`name`, `total_norm`, `created_at`, `updated_at`) 
VALUES ('Thư ký', 0, NOW(), NOW())
ON DUPLICATE KEY UPDATE `name` = 'Thư ký';

-- Cập nhật các title có quyền admin (nếu cần)
-- Trưởng khoa, Phó khoa cần được thêm vào database nếu chưa có
-- INSERT INTO `title` (`name`, `total_norm`, `created_at`, `updated_at`) 
-- VALUES ('Trưởng khoa', 0, NOW(), NOW())
-- ON DUPLICATE KEY UPDATE `name` = 'Trưởng khoa';

-- INSERT INTO `title` (`name`, `total_norm`, `created_at`, `updated_at`) 
-- VALUES ('Phó khoa', 0, NOW(), NOW())
-- ON DUPLICATE KEY UPDATE `name` = 'Phó khoa';



