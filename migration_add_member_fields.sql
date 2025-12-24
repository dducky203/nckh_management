-- Migration: Thêm cột role và participation_rate vào bảng research_group_members
-- Chạy script này để cập nhật database

ALTER TABLE `research_group_members` 
ADD COLUMN `role` VARCHAR(50) DEFAULT 'Thành viên' AFTER `user_id`,
ADD COLUMN `participation_rate` INT DEFAULT 100 AFTER `role`;

-- Cập nhật role cho trưởng nhóm (nếu cần)
-- UPDATE research_group_members rgm
-- INNER JOIN research_group rg ON rgm.group_id = rg.id
-- SET rgm.role = 'Trưởng nhóm'
-- WHERE rgm.user_id = rg.leader_id;

