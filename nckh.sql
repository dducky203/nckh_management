/*
 Navicat Premium Dump SQL

 Source Server         : test
 Source Server Type    : MariaDB
 Source Server Version : 120002 (12.0.2-MariaDB)
 Source Host           : 127.0.0.1:3307
 Source Schema         : nckh

 Target Server Type    : MariaDB
 Target Server Version : 120002 (12.0.2-MariaDB)
 File Encoding         : 65001

 Date: 07/09/2025 10:03:37
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for active_in_council
-- ----------------------------
DROP TABLE IF EXISTS `active_in_council`;
CREATE TABLE `active_in_council`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `content` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NULL DEFAULT NULL,
  `id_event` int(11) NULL DEFAULT NULL,
  `image` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NULL DEFAULT NULL,
  `minutes_of_meeting` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NULL DEFAULT NULL,
  `presentation_file` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NULL DEFAULT NULL,
  `presenter` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_uca1400_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of active_in_council
-- ----------------------------
INSERT INTO `active_in_council` VALUES (1, 'Giới thiệu và đánh giá ưu điểm và nhược điểm của một số mạng Blockchain Testnet điển hình hiện nay.Tư vấn lựa chọn mạng Blockchain Testnet thích hợp phát triển cho các ứng dụng về Nông nghiệp, Kinh tế, Tài chính,…', 49, '12345-1536x864 (1).jpg', 'BB Hội đồng tư vấn 5.12.24.pdf', 'BB Hội đồng tư vấn 5.12.24.pdf', 'TS. Đỗ Ngọc Minh');
INSERT INTO `active_in_council` VALUES (2, '-	Giới thiệu và đánh giá ưu điểm và nhược điểm của một số chùm vệ tinh cho phép khai thác dữ liệu hiện nay.  -	Tư vấn lựa chọn dữ liệu được thu thập từ chùm vệ tinh Sentinel (tên của một loạt các vệ tinh quan sát trái đất thuộc Chương trình Copernicus của Cơ quan Không gian Châu Âu - ESA) để ứng dụng công nghệ viễn thám phục vụ nghiên cứu tài nguyên, môi trường, đảm bảo quốc phòng - an ninh.', 50, 'z6160543221500_b7070175e9021aa90f2c583270b70d1a.jpg', 'BB Hội đồng tư vấn 24.12.24.pdf', 'BB Hội đồng tư vấn 24.12.24.pdf', 'PGS.TS. Trịnh Lê Hùng');

-- ----------------------------
-- Table structure for admin
-- ----------------------------
DROP TABLE IF EXISTS `admin`;
CREATE TABLE `admin`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `create_date` datetime(6) NULL DEFAULT NULL,
  `name` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NULL DEFAULT NULL,
  `password` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NULL DEFAULT NULL,
  `update_date` datetime(6) NULL DEFAULT NULL,
  `username` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NULL DEFAULT NULL,
  `id_role` int(11) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `FKoe9i3dhuu91kyie1hbjx4dxy3`(`id_role` ASC) USING BTREE,
  CONSTRAINT `FKoe9i3dhuu91kyie1hbjx4dxy3` FOREIGN KEY (`id_role`) REFERENCES `role` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_uca1400_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of admin
-- ----------------------------
INSERT INTO `admin` VALUES (1, '2025-02-17 17:27:56.000000', 'Ngo Van Minh', 'ee79976c9380d5e337fc1c095ece8c8f22f91f306ceeb161fa51fecede2c4ba1', '2025-02-17 17:27:50.000000', '6660554', 1);
INSERT INTO `admin` VALUES (2, '2025-02-17 17:27:56.000000', 'Ngo Van Minh', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', '2025-02-17 17:27:50.000000', '6660556', 1);

-- ----------------------------
-- Table structure for approved_research_task
-- ----------------------------
DROP TABLE IF EXISTS `approved_research_task`;
CREATE TABLE `approved_research_task`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `end_time` date NULL DEFAULT NULL,
  `id_event` int(11) NULL DEFAULT NULL,
  `result` int(11) NULL DEFAULT NULL,
  `start_time` date NULL DEFAULT NULL,
  `status` int(11) NULL DEFAULT NULL,
  `task_type` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_uca1400_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of approved_research_task
-- ----------------------------

-- ----------------------------
-- Table structure for conference
-- ----------------------------
DROP TABLE IF EXISTS `conference`;
CREATE TABLE `conference`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `article_link` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NULL DEFAULT NULL,
  `id_event` int(11) NULL DEFAULT NULL,
  `image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NULL DEFAULT NULL,
  `minutes_of_meeting` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NULL DEFAULT NULL,
  `organizer_decision` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NULL DEFAULT NULL,
  `paper_title` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NULL DEFAULT NULL,
  `presentation_files` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 9 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_uca1400_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of conference
-- ----------------------------
INSERT INTO `conference` VALUES (1, 'https://daotao.vnua.edu.vn/#/home/listbaiviet/tb/page/1/baivietct/-7427593202379359237', 2, 'ảnh 3.jpg', 'MÔI TRƯỜNG VĨ MÔ.docx', 'Nghiên cứu thiết bị IoT ứng dụng trong thu thập dữ liệu về nồng độ mùi trong phòng khám thú y', 'Nghiên cứu thiết bị IoT ứng dụng trong thu thập dữ liệu về nồng độ mùi trong phòng khám thú y', 'MÔI TRƯỜNG VĨ MÔ.docx');
INSERT INTO `conference` VALUES (2, 'https://daotao.vnua.edu.vn/#/home/listbaiviet/tb/page/1/baivietct/-7427593202379359237', 19, 'z6160543669423_92ccadcc7bc13d4eefb29a4da4516631.jpg', 'MÔI TRƯỜNG VĨ MÔ.docx', 'Xây dựng CSDL hình ảnh hạt phấn hoa (Atlas điện tử) cho vùng nuôi ong qua ứng dụng công nghệ 4.0', 'Xây dựng CSDL hình ảnh hạt phấn hoa (Atlas điện tử) cho vùng nuôi ong qua ứng dụng công nghệ 4.0', 'MÔI TRƯỜNG VĨ MÔ.docx');
INSERT INTO `conference` VALUES (3, 'https://daotao.vnua.edu.vn/#/home/listbaiviet/tb/page/1/baivietct/-7427593202379359237', 20, 'z6160543669423_92ccadcc7bc13d4eefb29a4da4516631.jpg', 'MÔI TRƯỜNG VĨ MÔ.docx', 'Phát hiện bất thường ảnh ong với YOLO', 'Phát hiện bất thường ảnh ong với YOLO', 'MÔI TRƯỜNG VĨ MÔ.docx');
INSERT INTO `conference` VALUES (4, 'https://daotao.vnua.edu.vn/#/home/listbaiviet/tb/page/1/baivietct/-7427593202379359237', 21, 'z5448960280247_b579d3b872bb16e4dd2479847f35a158.jpg', 'MÔI TRƯỜNG VĨ MÔ.docx', 'Giới thiệu một số phương pháp phân tích dữ liệu và thống kê ứng dụng ', 'Giới thiệu một số phương pháp phân tích dữ liệu và thống kê ứng dụng ', '24-05-27-Some studies in facial expression recognition using deep learning.pdf');
INSERT INTO `conference` VALUES (5, 'https://daotao.vnua.edu.vn/#/home/listbaiviet/tb/page/1/baivietct/-7427593202379359237', 23, 'z5861235015522_d2305d24ae8322f043ef1dacbea8bac6.jpg', 'MÔI TRƯỜNG VĨ MÔ.docx', 'Blockchain, trí tuệ nhân tạo và chuyển đổi số', 'Blockchain, trí tuệ nhân tạo và chuyển đổi số', 'MÔI TRƯỜNG VĨ MÔ.docx');
INSERT INTO `conference` VALUES (6, 'https://daotao.vnua.edu.vn/#/home/listbaiviet/tb/page/1/baivietct/-7427593202379359237', 24, 'z6160543341416_22d399697e2e6b72232dd59c3e1f5834.jpg', 'MÔI TRƯỜNG VĨ MÔ.docx', 'Blockchain, trí tuệ nhân tạo và chuyển đổi số', 'Blockchain, trí tuệ nhân tạo và chuyển đổi số', 'MÔI TRƯỜNG VĨ MÔ.docx');
INSERT INTO `conference` VALUES (7, 'https://daotao.vnua.edu.vn/#/home/listbaiviet/tb/page/1/baivietct/-7427593202379359237', 25, 'z5448960280247_b579d3b872bb16e4dd2479847f35a158.jpg', 'MÔI TRƯỜNG VĨ MÔ.docx', 'Ứng dụng mạng học sâu nhận dạng khuôn mặt cảm xúc', 'Ứng dụng mạng học sâu nhận dạng khuôn mặt cảm xúc', 'MÔI TRƯỜNG VĨ MÔ.docx');
INSERT INTO `conference` VALUES (8, 'https://daotao.vnua.edu.vn/#/home/listbaiviet/tb/page/1/baivietct/-7427593202379359237', 56, 'z6160543669423_92ccadcc7bc13d4eefb29a4da4516631.jpg', 'MÔI TRƯỜNG VĨ MÔ.docx', 'Blockchain, trí tuệ nhân tạo và chuyển đổi số', 'test', 'MÔI TRƯỜNG VĨ MÔ.docx');

-- ----------------------------
-- Table structure for conference_paper
-- ----------------------------
DROP TABLE IF EXISTS `conference_paper`;
CREATE TABLE `conference_paper`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `conference_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NULL DEFAULT NULL,
  `conference_proceedings_file` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NULL DEFAULT NULL,
  `id_event` int(11) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 12 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_uca1400_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of conference_paper
-- ----------------------------
INSERT INTO `conference_paper` VALUES (1, 'Nghiên cứu thiết bị iot ứng dụng trong thu thập dữ liệu về nồng độ mùi trong phòng khám thú y', 'MÔI TRƯỜNG VĨ MÔ.docx', 4);
INSERT INTO `conference_paper` VALUES (2, 'Một số kết quả phân tích mức độ ô nhiễm mùi tại phòng khám thú y bằng công nghệ iot', 'MÔI TRƯỜNG VĨ MÔ.docx', 5);
INSERT INTO `conference_paper` VALUES (3, 'Ứng dụng blockchain và công nghệ iot vào tăng độ tin cậy của ngành hàng mật ong', 'MÔI TRƯỜNG VĨ MÔ.docx', 6);
INSERT INTO `conference_paper` VALUES (4, 'Nghiên cứu xây dựng bộ cơ sở dữ liệu nông sản bằng phương pháp xử lý ảnh áp dụng với mẫu gạo lứt phúc thọ', 'MÔI TRƯỜNG VĨ MÔ.docx', 30);
INSERT INTO `conference_paper` VALUES (6, 'Ứng dụng mạng học sâu nhận dạng khuôn mặt cảm xúc', 'MÔI TRƯỜNG VĨ MÔ.docx', 32);
INSERT INTO `conference_paper` VALUES (9, 'Một số cơ chế đồng thuận trong mạng blockchain', 'MÔI TRƯỜNG VĨ MÔ.docx', 33);
INSERT INTO `conference_paper` VALUES (10, 'Một số kết quả phân tích mẫu với cảm biến khí mq ứng dụng công nghệ iot', 'MÔI TRƯỜNG VĨ MÔ.docx', 35);
INSERT INTO `conference_paper` VALUES (11, 'Thực trạng phát triển bền vững nông nghiệp, kinh tế nông thôn và nông dân gắn với chuyển đổi số quốc gia', 'MÔI TRƯỜNG VĨ MÔ.docx', 36);

-- ----------------------------
-- Table structure for event
-- ----------------------------
DROP TABLE IF EXISTS `event`;
CREATE TABLE `event`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `create_date` date NULL DEFAULT NULL,
  `creator` int(11) NULL DEFAULT NULL,
  `date_of_event` date NULL DEFAULT NULL,
  `end_time` int(11) NULL DEFAULT NULL,
  `event_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NULL DEFAULT NULL,
  `id_operating_standard_2` int(11) NULL DEFAULT NULL,
  `is_delete` int(11) NULL DEFAULT NULL,
  `start_time` int(11) NULL DEFAULT NULL,
  `status` int(11) NULL DEFAULT NULL,
  `id_room` int(11) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `FK4ythgcbb08ceed2o9dv00ij72`(`id_room` ASC) USING BTREE,
  CONSTRAINT `FK4ythgcbb08ceed2o9dv00ij72` FOREIGN KEY (`id_room`) REFERENCES `room` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 58 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_uca1400_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of event
-- ----------------------------
INSERT INTO `event` VALUES (1, '2025-06-07', 2, '2024-09-30', 10, 'Sự phát triển của Web 3.0 lên 4.0 và một số ứng dụng tại Việt Nam', 1, 1, 6, 2, 3);
INSERT INTO `event` VALUES (2, '2025-06-07', 2, '2024-10-18', 5, 'Nghiên cứu khoa học Nữ trong bối cảnh chuyển đổi số và công nghệ xanh', 9, 1, 1, 2, 3);
INSERT INTO `event` VALUES (3, '2025-06-07', 2, '2024-04-11', NULL, 'Phát triển ứng dụng Web hỗ trợ công tác quản lý dạy và học cấp bộ môn', 15, 1, NULL, 2, 1);
INSERT INTO `event` VALUES (4, '2025-06-07', 2, '2024-04-23', 2, 'Nghiên cứu khoa học nữ trong bối cảnh chuyển đổi số và công nghệ xanh', 18, 1, 1, 2, 1);
INSERT INTO `event` VALUES (5, '2025-06-07', 2, '2024-05-17', 5, 'Blockchain, trí tuệ nhân tạo và chuyển đổi số', 19, 1, 2, 2, 1);
INSERT INTO `event` VALUES (6, '2025-06-07', 2, '2024-05-16', 5, 'Blockchain, trí tuệ nhân tạo và chuyển đổi số', 19, 1, 2, 2, 1);
INSERT INTO `event` VALUES (7, '2025-06-07', 26, '2024-04-03', 5, 'Phát triển ứng dụng Web hỗ trợ công tác quản lý dạy và học cấp bộ môn', 28, 1, 4, 2, 1);
INSERT INTO `event` VALUES (11, '2025-06-27', 20, '2024-05-20', 5, 'Nghiên cứu xây dựng bộ cơ sở dữ liệu phân tích trạng thái cảm xúc khuôn mặt', 1, 1, 2, 2, 3);
INSERT INTO `event` VALUES (12, '2025-06-27', 20, '2024-09-09', 3, 'Nghiên cứu xây dựng trạm đo đánh giá mức độ ô nhiểm bằng công nghệ iot', 1, 1, 1, 2, 1);
INSERT INTO `event` VALUES (13, '2025-06-28', 23, '2024-04-08', 3, 'Phương pháp nghiên cứu và định hướng NC UD CNTT trong NN', 1, 1, 1, 2, 3);
INSERT INTO `event` VALUES (14, '2025-06-28', 22, '2024-05-13', 3, 'Kỹ thuật dựng ảnh siêu âm', 1, 1, 1, 2, 3);
INSERT INTO `event` VALUES (15, '2025-06-28', 26, '2024-09-30', 3, 'Giới thiệu giải pháp xây dựng phần mềm hỗ trợ công tác quản lý dạy và học cấp bộ môn', 1, 1, 1, 2, 3);
INSERT INTO `event` VALUES (16, '2025-06-28', 19, '2024-12-24', 3, 'Phát hiện ong mang phấn từ hình ảnh và vấn đề mất cân bằng dữ liệu', 1, 1, 1, 2, 3);
INSERT INTO `event` VALUES (17, '2025-06-28', 18, '2024-12-25', 3, 'It business analyst và xu hướng nghề nghiệp', 1, 1, 1, 2, 3);
INSERT INTO `event` VALUES (18, '2025-06-28', 25, '2024-12-26', 3, 'Một giải pháp điểm danh người học tận dụng nguồn lực sẵn có ở các trường Đại học', 1, 1, 1, 2, 3);
INSERT INTO `event` VALUES (19, '2025-06-28', 19, '2024-06-14', 3, 'Ứng dụng các công nghệ của công nghiệp 4.0 vào chuỗi ngành hàng mật ong', 9, 1, 1, 2, 3);
INSERT INTO `event` VALUES (20, '2025-06-28', 19, '2024-12-05', 5, 'Blockchain, Trí tuệ nhân tạo và Chuyển đổi số', 9, 1, 2, 2, 3);
INSERT INTO `event` VALUES (21, '2025-06-28', 22, '2024-05-12', 5, 'Một số nghiên cứu nhận diện khuôn mặt cảm xúc sử dụng mạng học sâu', 9, 1, 1, 2, 3);
INSERT INTO `event` VALUES (22, '2025-06-28', 20, '2024-05-20', 3, 'Nghiên cứu xây dựng bộ cơ sở dữ liệu nông sản bằng phương pháp xử lý ảnh Áp dụng với mẫu gạo lứt Phúc Thọ', 9, 1, 1, 2, 3);
INSERT INTO `event` VALUES (23, '2025-06-28', 20, '2024-05-20', 10, 'Nghiên cứu xây dựng bộ cơ sở dữ liệu nông sản bằng phương pháp xử lý ảnh Áp dụng với mẫu gạo lứt Phúc Thọ', 9, 1, 6, 2, 3);
INSERT INTO `event` VALUES (24, '2025-06-28', 18, '2024-08-22', 3, 'Database Security', 9, 1, 1, 2, 3);
INSERT INTO `event` VALUES (25, '2025-06-28', 22, '2024-05-01', 5, 'Blockchain, trí tuệ nhân tạo và chuyển đổi số', 9, 1, 1, 2, 1);
INSERT INTO `event` VALUES (26, '2025-06-28', 26, '2024-04-23', NULL, 'Tổng quan về điện toán đám mây và các vấn đề thách thức bâo mật', 15, 1, NULL, 2, 1);
INSERT INTO `event` VALUES (27, '2025-06-28', 19, '2024-04-23', NULL, 'Improving pollen-bearing honey bee detection from videos captured at hive entrance by combining deep learning and handling imbalance techniques', 10, 1, NULL, 2, 1);
INSERT INTO `event` VALUES (28, '2025-06-28', 19, '2024-04-16', NULL, 'A method for bee activities recognition from videos captured at the beehive entrance', 13, 1, NULL, 2, 1);
INSERT INTO `event` VALUES (29, '2025-06-28', 23, '2024-04-20', NULL, 'A New Score Function of IFSs and its Application in the Evaluation of Software Quality', 13, 1, NULL, 2, 1);
INSERT INTO `event` VALUES (30, '2025-06-28', 20, '2024-04-04', 5, 'Blockchain, trí tuệ nhân tạo và chuyển đổi số', 19, 1, 1, 2, 1);
INSERT INTO `event` VALUES (32, '2025-06-28', 22, '2024-01-01', 5, 'Blockchain, trí tuệ nhân tạo và chuyển đổi số', 19, 1, 1, 2, 1);
INSERT INTO `event` VALUES (33, '2025-06-28', 26, '2024-03-03', 5, 'Blockchain, trí tuệ nhân tạo và chuyển đổi số', 19, 1, 2, 2, 1);
INSERT INTO `event` VALUES (35, '2025-06-28', 20, '2024-03-07', 5, 'Blockchain, trí tuệ nhân tạo và chuyển đổi số', 19, 1, 1, 2, 1);
INSERT INTO `event` VALUES (36, '2025-06-28', 24, '2024-06-06', 10, 'Thực trạng, quan điểm, định hướng và giải pháp phát triển bền vững nông nghiệp, kinh tế nông thôn và nông dân gắn với chuyển đổi số quốc gia, đô thị hóa và thích ứng với biến đổi khí hậu', 18, 1, 6, 2, 1);
INSERT INTO `event` VALUES (37, '2025-06-28', 24, '2024-12-31', 3, 'Tổng quan về điện toán đám mây', 20, 1, 1, 2, 1);
INSERT INTO `event` VALUES (38, '2025-06-28', 23, '2024-09-30', 3, 'Tổng quan về Công nghệ thông tin và truyền thông (ICT-Information Communication Technology) Phần I – Công nghệ phần cứng', 20, 1, 1, 2, 1);
INSERT INTO `event` VALUES (39, '2025-06-28', 18, '2024-11-12', 3, 'It business analyst và xu hướng nghề nghiệp', 20, 1, 1, 2, 3);
INSERT INTO `event` VALUES (40, '2025-06-28', 19, '2024-12-31', 3, 'Các kỹ thuật học máy và thị giác máy tính trong các ứng dụng giám sát liên tục tổ ong', 20, 1, 1, 2, 3);
INSERT INTO `event` VALUES (41, '2025-06-28', 2, '2024-12-01', 3, 'Nghiên cứu công nghệ phát triển Web và ứng dụng phát triển Website cho Đoàn thanh niên của Khoa công nghệ thông tin - Học viện Nông nghiệp Việt Nam', 29, 1, 1, 2, 1);
INSERT INTO `event` VALUES (42, '2025-06-28', 26, '2024-12-01', 2, 'Xây dựng diễn đàn trao đổi học tập cho sinh viên Học viện Nông nghiệp Việt Nam', 29, 1, 1, 2, 1);
INSERT INTO `event` VALUES (43, '2025-06-28', 25, '2024-12-01', 5, 'Xây dựng ứng dụng điểm danh sinh viên, học viên bằng mã QR', 28, 1, 1, 2, 1);
INSERT INTO `event` VALUES (44, '2025-06-28', 24, '2024-12-01', 5, 'Xây dựng website quản lý sinh viên cấp Khoa', 29, 1, 1, 2, 1);
INSERT INTO `event` VALUES (45, '2025-06-28', 22, '2024-12-01', 5, 'Ứng dụng Deep Learning nhận diện cảm xúc khuôn mặt', 29, 1, 1, 2, 1);
INSERT INTO `event` VALUES (46, '2025-06-28', 18, '2024-12-01', 5, 'Nghiên cứu các kỹ thuật xây dựng máy tìm kiếm - Search Engine', 29, 1, 1, 2, 1);
INSERT INTO `event` VALUES (49, '2025-06-28', 2, '2024-05-12', 10, 'Hội đồng tư vấn khoa học', 30, 1, 6, 2, 1);
INSERT INTO `event` VALUES (50, '2025-06-29', 2, '2024-12-24', 10, 'Tổ chức hội đồng tư vấn khoa học lần 2', 30, 2, 6, 2, 3);
INSERT INTO `event` VALUES (51, '2025-06-29', 2, '2024-04-15', 5, 'Quy trình nhập, xử lý và trích xuất dữ liệu trên Cloud', 31, 1, 1, 2, 3);
INSERT INTO `event` VALUES (52, '2025-06-29', 2, '2024-12-24', 10, 'Mô hình hóa xu hướng phát triển sử dụng đất/lớp phủ khu vực đô thị sử dụng dữ liệu viễn thám và các mô hình trí tuệ nhân tạo', 31, 1, 6, 2, 1);
INSERT INTO `event` VALUES (55, '2025-07-18', 1, '2025-07-25', 5, 'test seminar presentation', 1, 1, 1, 1, 1);
INSERT INTO `event` VALUES (56, '2025-07-18', 1, '2025-07-20', 5, 'test create international conferences', 3, 1, 1, 1, 1);
INSERT INTO `event` VALUES (57, '2025-07-19', 2, '2025-07-25', NULL, 'test vietnamese paper', 10, 1, NULL, 2, 1);

-- ----------------------------
-- Table structure for expert_presentation
-- ----------------------------
DROP TABLE IF EXISTS `expert_presentation`;
CREATE TABLE `expert_presentation`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_event` int(11) NULL DEFAULT NULL,
  `minutes_of_meeting` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NULL DEFAULT NULL,
  `presentation_file` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NULL DEFAULT NULL,
  `presenter` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NULL DEFAULT NULL,
  `seminar_photo` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_uca1400_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of expert_presentation
-- ----------------------------
INSERT INTO `expert_presentation` VALUES (1, 51, 'BB Seminar Chuyên gia T4.pdf', 'CK Overview & Agricultural capabilities - HVNN.pptx.pdf', 'Mr. Mầu Hà Quang', 'Chuyên gia T4_1.jpg');
INSERT INTO `expert_presentation` VALUES (2, 52, 'Chuyên gia T12_1.jpg', 'TLHung_Conference 2024.pptx', 'PGS.TS. Trịnh Lê Hùng', 'Chuyên gia T12_1.jpg');

-- ----------------------------
-- Table structure for group
-- ----------------------------
DROP TABLE IF EXISTS `group`;
CREATE TABLE `group`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `create_date` date NULL DEFAULT NULL,
  `group_name` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NULL DEFAULT NULL,
  `status` int(11) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 13 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_uca1400_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of group
-- ----------------------------
INSERT INTO `group` VALUES (1, '2025-09-06', 'nhóm 1', 1);
INSERT INTO `group` VALUES (3, '2025-07-19', 'test 19/07', 1);
INSERT INTO `group` VALUES (12, '2024-01-01', 'Nhóm nghiên cứu mạnh', 1);

-- ----------------------------
-- Table structure for guest
-- ----------------------------
DROP TABLE IF EXISTS `guest`;
CREATE TABLE `guest`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `event_id` int(11) NULL DEFAULT NULL,
  `user_id` int(11) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `FKplwm15gu4q6tj4g4ox6wkf1li`(`event_id` ASC) USING BTREE,
  INDEX `FKake2867xxr6o753o6kqc4rott`(`user_id` ASC) USING BTREE,
  CONSTRAINT `FKake2867xxr6o753o6kqc4rott` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FKplwm15gu4q6tj4g4ox6wkf1li` FOREIGN KEY (`event_id`) REFERENCES `event` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_uca1400_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of guest
-- ----------------------------

-- ----------------------------
-- Table structure for international_paper
-- ----------------------------
DROP TABLE IF EXISTS `international_paper`;
CREATE TABLE `international_paper`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `article_link` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NULL DEFAULT NULL,
  `id_event` int(11) NULL DEFAULT NULL,
  `main_author` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NULL DEFAULT NULL,
  `status` int(11) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_uca1400_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of international_paper
-- ----------------------------
INSERT INTO `international_paper` VALUES (1, 'https://start.spring.io/', 27, 'Lê Thị Nhung', 3);
INSERT INTO `international_paper` VALUES (2, 'https://start.spring.io/', 28, 'Lê Thị Nhung', 3);
INSERT INTO `international_paper` VALUES (3, 'https://start.spring.io/', 29, 'Nguyễn Xuân Thảo', 3);
INSERT INTO `international_paper` VALUES (5, 'https://start.spring.io/', 57, 'Phạm Thị Lan Anh', 3);

-- ----------------------------
-- Table structure for like_news
-- ----------------------------
DROP TABLE IF EXISTS `like_news`;
CREATE TABLE `like_news`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_news` int(11) NULL DEFAULT NULL,
  `id_user` int(11) NULL DEFAULT NULL,
  `time` datetime(6) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 10 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_uca1400_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of like_news
-- ----------------------------
INSERT INTO `like_news` VALUES (6, 1, 1, '2025-06-13 23:21:27.000000');
INSERT INTO `like_news` VALUES (9, 1, 2, '2025-06-14 13:25:17.000000');

-- ----------------------------
-- Table structure for member
-- ----------------------------
DROP TABLE IF EXISTS `member`;
CREATE TABLE `member`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `event_id` int(11) NULL DEFAULT NULL,
  `user_id` int(11) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `FK1mjk7vij3rtpg6c4k58ttj7x`(`event_id` ASC) USING BTREE,
  INDEX `FKswb523yn1xw3806ojrfpcyadl`(`user_id` ASC) USING BTREE,
  CONSTRAINT `FK1mjk7vij3rtpg6c4k58ttj7x` FOREIGN KEY (`event_id`) REFERENCES `event` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FKswb523yn1xw3806ojrfpcyadl` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 123 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_uca1400_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of member
-- ----------------------------
INSERT INTO `member` VALUES (1, 1, 2);
INSERT INTO `member` VALUES (2, 2, 2);
INSERT INTO `member` VALUES (3, 3, 2);
INSERT INTO `member` VALUES (4, 4, 2);
INSERT INTO `member` VALUES (5, 5, 2);
INSERT INTO `member` VALUES (6, 6, 2);
INSERT INTO `member` VALUES (7, 7, 2);
INSERT INTO `member` VALUES (8, 7, 26);
INSERT INTO `member` VALUES (34, 11, 20);
INSERT INTO `member` VALUES (35, 12, 20);
INSERT INTO `member` VALUES (36, 13, 23);
INSERT INTO `member` VALUES (37, 14, 22);
INSERT INTO `member` VALUES (38, 15, 26);
INSERT INTO `member` VALUES (39, 16, 19);
INSERT INTO `member` VALUES (40, 17, 18);
INSERT INTO `member` VALUES (41, 18, 25);
INSERT INTO `member` VALUES (42, 19, 19);
INSERT INTO `member` VALUES (43, 20, 19);
INSERT INTO `member` VALUES (44, 2, 20);
INSERT INTO `member` VALUES (45, 21, 22);
INSERT INTO `member` VALUES (46, 24, 18);
INSERT INTO `member` VALUES (47, 25, 22);
INSERT INTO `member` VALUES (48, 26, 26);
INSERT INTO `member` VALUES (49, 27, 19);
INSERT INTO `member` VALUES (50, 28, 19);
INSERT INTO `member` VALUES (51, 29, 23);
INSERT INTO `member` VALUES (52, 4, 20);
INSERT INTO `member` VALUES (53, 30, 20);
INSERT INTO `member` VALUES (56, 32, 22);
INSERT INTO `member` VALUES (57, 33, 26);
INSERT INTO `member` VALUES (59, 35, 20);
INSERT INTO `member` VALUES (60, 36, 24);
INSERT INTO `member` VALUES (61, 37, 24);
INSERT INTO `member` VALUES (62, 38, 23);
INSERT INTO `member` VALUES (63, 39, 18);
INSERT INTO `member` VALUES (64, 40, 19);
INSERT INTO `member` VALUES (65, 42, 26);
INSERT INTO `member` VALUES (66, 43, 18);
INSERT INTO `member` VALUES (67, 43, 25);
INSERT INTO `member` VALUES (68, 44, 24);
INSERT INTO `member` VALUES (69, 45, 22);
INSERT INTO `member` VALUES (70, 46, 18);
INSERT INTO `member` VALUES (71, 49, 2);
INSERT INTO `member` VALUES (72, 49, 18);
INSERT INTO `member` VALUES (73, 49, 19);
INSERT INTO `member` VALUES (74, 49, 21);
INSERT INTO `member` VALUES (75, 49, 22);
INSERT INTO `member` VALUES (76, 49, 23);
INSERT INTO `member` VALUES (77, 49, 24);
INSERT INTO `member` VALUES (78, 49, 25);
INSERT INTO `member` VALUES (79, 49, 20);
INSERT INTO `member` VALUES (80, 49, 26);
INSERT INTO `member` VALUES (81, 50, 2);
INSERT INTO `member` VALUES (82, 50, 18);
INSERT INTO `member` VALUES (83, 50, 19);
INSERT INTO `member` VALUES (84, 50, 20);
INSERT INTO `member` VALUES (85, 50, 21);
INSERT INTO `member` VALUES (86, 50, 22);
INSERT INTO `member` VALUES (87, 50, 23);
INSERT INTO `member` VALUES (88, 50, 24);
INSERT INTO `member` VALUES (89, 50, 25);
INSERT INTO `member` VALUES (90, 50, 26);
INSERT INTO `member` VALUES (91, 51, 2);
INSERT INTO `member` VALUES (92, 51, 18);
INSERT INTO `member` VALUES (93, 51, 19);
INSERT INTO `member` VALUES (94, 51, 20);
INSERT INTO `member` VALUES (95, 51, 21);
INSERT INTO `member` VALUES (96, 51, 22);
INSERT INTO `member` VALUES (97, 51, 23);
INSERT INTO `member` VALUES (98, 51, 24);
INSERT INTO `member` VALUES (99, 51, 25);
INSERT INTO `member` VALUES (100, 51, 26);
INSERT INTO `member` VALUES (101, 52, 2);
INSERT INTO `member` VALUES (102, 52, 18);
INSERT INTO `member` VALUES (103, 52, 19);
INSERT INTO `member` VALUES (104, 52, 20);
INSERT INTO `member` VALUES (105, 52, 21);
INSERT INTO `member` VALUES (106, 52, 22);
INSERT INTO `member` VALUES (107, 52, 23);
INSERT INTO `member` VALUES (108, 52, 24);
INSERT INTO `member` VALUES (109, 52, 25);
INSERT INTO `member` VALUES (110, 52, 26);
INSERT INTO `member` VALUES (116, 55, 2);
INSERT INTO `member` VALUES (117, 55, 19);
INSERT INTO `member` VALUES (118, 55, 20);
INSERT INTO `member` VALUES (119, 55, 26);
INSERT INTO `member` VALUES (120, 55, 1);
INSERT INTO `member` VALUES (121, 56, 1);
INSERT INTO `member` VALUES (122, 57, 2);

-- ----------------------------
-- Table structure for ministry_task
-- ----------------------------
DROP TABLE IF EXISTS `ministry_task`;
CREATE TABLE `ministry_task`  (
  `task_id` int(11) NOT NULL AUTO_INCREMENT,
  `id_event` int(11) NULL DEFAULT NULL,
  `secretary` int(11) NULL DEFAULT NULL,
  `task_lead` int(11) NULL DEFAULT NULL,
  PRIMARY KEY (`task_id`) USING BTREE,
  UNIQUE INDEX `UKphl37g9o9lh4feqlyia9s86je`(`secretary` ASC) USING BTREE,
  UNIQUE INDEX `UK6y32pbdsju3s4x7rddqjsb4ny`(`task_lead` ASC) USING BTREE,
  CONSTRAINT `FKgb9c2lggb9ecua2mm4nidig51` FOREIGN KEY (`secretary`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FKml6f9syift6fyu8ifcc98y91d` FOREIGN KEY (`task_lead`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_uca1400_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of ministry_task
-- ----------------------------
INSERT INTO `ministry_task` VALUES (1, 7, 2, 26);
INSERT INTO `ministry_task` VALUES (3, 43, 18, 25);

-- ----------------------------
-- Table structure for ncm
-- ----------------------------
DROP TABLE IF EXISTS `ncm`;
CREATE TABLE `ncm`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `norm` float NULL DEFAULT NULL,
  `role_of_activity` int(11) NULL DEFAULT NULL,
  `role_of_team` int(11) NOT NULL,
  `status` int(11) NULL DEFAULT NULL,
  `year` int(11) NULL DEFAULT NULL,
  `id_group` int(11) NULL DEFAULT NULL,
  `id_operating_standard` int(11) NULL DEFAULT NULL,
  `id_user` int(11) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `FKdq054ycp28qqq8pjhl5l2ckf5`(`id_group` ASC) USING BTREE,
  INDEX `FK71v8vinw76ecr9n83p27rabsw`(`id_operating_standard` ASC) USING BTREE,
  INDEX `FKgx1bofxh4qe9t9rbpy6bdcud6`(`id_user` ASC) USING BTREE,
  CONSTRAINT `FK71v8vinw76ecr9n83p27rabsw` FOREIGN KEY (`id_operating_standard`) REFERENCES `operating_standards_2` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FKdq054ycp28qqq8pjhl5l2ckf5` FOREIGN KEY (`id_group`) REFERENCES `group` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FKgx1bofxh4qe9t9rbpy6bdcud6` FOREIGN KEY (`id_user`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 139 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_uca1400_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of ncm
-- ----------------------------
INSERT INTO `ncm` VALUES (1, 0.8, NULL, 1, 1, 2024, 1, 1, 24);
INSERT INTO `ncm` VALUES (4, 0.8, NULL, 1, 1, 2024, 1, 9, 24);
INSERT INTO `ncm` VALUES (6, 0.4, NULL, 1, 1, 2024, 1, 11, 24);
INSERT INTO `ncm` VALUES (7, 0.4, NULL, 1, 1, 2024, 1, 16, 24);
INSERT INTO `ncm` VALUES (8, 0.8, NULL, 1, 1, 2024, 1, 18, 24);
INSERT INTO `ncm` VALUES (21, 0.8, NULL, 2, 1, 2024, 1, 1, 2);
INSERT INTO `ncm` VALUES (30, 0.8, NULL, 2, 1, 2024, 1, 9, 2);
INSERT INTO `ncm` VALUES (31, 0.93, NULL, 2, 1, 2024, 1, 16, 2);
INSERT INTO `ncm` VALUES (33, 0.8, NULL, 2, 1, 2024, 1, 23, 2);
INSERT INTO `ncm` VALUES (34, 0.8, NULL, 2, 1, 2024, 1, 29, 2);
INSERT INTO `ncm` VALUES (35, 0.8, NULL, 3, 1, 2024, 1, 1, 18);
INSERT INTO `ncm` VALUES (38, 0.8, NULL, 3, 1, 2024, 1, 9, 18);
INSERT INTO `ncm` VALUES (39, 0.93, NULL, 3, 1, 2024, 1, 16, 18);
INSERT INTO `ncm` VALUES (40, 0.53, NULL, 3, 1, 2024, 1, 18, 18);
INSERT INTO `ncm` VALUES (42, 0.8, NULL, 3, 1, 2024, 1, 29, 18);
INSERT INTO `ncm` VALUES (43, 0.8, NULL, 3, 1, 2024, 1, 1, 19);
INSERT INTO `ncm` VALUES (46, 0.8, NULL, 3, 1, 2024, 1, 9, 19);
INSERT INTO `ncm` VALUES (47, 0.93, NULL, 3, 1, 2024, 1, 16, 19);
INSERT INTO `ncm` VALUES (48, 0.53, NULL, 3, 1, 2024, 1, 18, 19);
INSERT INTO `ncm` VALUES (49, 0.8, NULL, 3, 1, 2024, 1, 23, 19);
INSERT INTO `ncm` VALUES (50, 0.8, NULL, 3, 1, 2024, 1, 29, 19);
INSERT INTO `ncm` VALUES (51, 0.8, NULL, 3, 1, 2024, 1, 1, 20);
INSERT INTO `ncm` VALUES (54, 0.8, NULL, 3, 1, 2024, 1, 9, 20);
INSERT INTO `ncm` VALUES (55, 0.93, NULL, 3, 1, 2024, 1, 16, 20);
INSERT INTO `ncm` VALUES (56, 0.53, NULL, 3, 1, 2024, 1, 18, 20);
INSERT INTO `ncm` VALUES (57, 0.8, NULL, 3, 1, 2024, 1, 23, 20);
INSERT INTO `ncm` VALUES (58, 0.8, NULL, 3, 1, 2024, 1, 29, 20);
INSERT INTO `ncm` VALUES (59, 0.8, NULL, 3, 1, 2024, 1, 1, 21);
INSERT INTO `ncm` VALUES (62, 0.8, NULL, 3, 1, 2024, 1, 9, 21);
INSERT INTO `ncm` VALUES (63, 0.93, NULL, 3, 1, 2024, 1, 16, 21);
INSERT INTO `ncm` VALUES (64, 0.53, NULL, 3, 1, 2024, 1, 18, 21);
INSERT INTO `ncm` VALUES (65, 0.8, NULL, 3, 1, 2024, 1, 23, 21);
INSERT INTO `ncm` VALUES (66, 0.8, NULL, 3, 1, 2024, 1, 29, 21);
INSERT INTO `ncm` VALUES (67, 0.8, NULL, 3, 1, 2024, 1, 1, 22);
INSERT INTO `ncm` VALUES (71, 0.4, NULL, 3, 1, 2024, 1, 16, 22);
INSERT INTO `ncm` VALUES (72, 1.6, NULL, 3, 1, 2024, 1, 23, 22);
INSERT INTO `ncm` VALUES (75, 0.4, NULL, 3, 1, 2024, 1, 11, 22);
INSERT INTO `ncm` VALUES (76, 1.6, NULL, 1, 1, 2024, 1, 23, 24);
INSERT INTO `ncm` VALUES (78, 0.8, NULL, 3, 1, 2024, 1, 18, 22);
INSERT INTO `ncm` VALUES (81, 0.8, NULL, 3, 1, 2024, 1, 9, 22);
INSERT INTO `ncm` VALUES (82, 0.8, NULL, 3, 1, 2024, 1, 1, 23);
INSERT INTO `ncm` VALUES (85, 0.8, NULL, 3, 1, 2024, 1, 9, 23);
INSERT INTO `ncm` VALUES (86, 0.93, NULL, 3, 1, 2024, 1, 16, 23);
INSERT INTO `ncm` VALUES (87, 0.8, NULL, 3, 1, 2024, 1, 23, 23);
INSERT INTO `ncm` VALUES (88, 0.53, NULL, 3, 1, 2024, 1, 18, 23);
INSERT INTO `ncm` VALUES (89, 0.8, NULL, 3, 1, 2024, 1, 29, 23);
INSERT INTO `ncm` VALUES (90, 0.8, NULL, 3, 1, 2024, 1, 1, 25);
INSERT INTO `ncm` VALUES (93, 0.8, NULL, 3, 1, 2024, 1, 9, 25);
INSERT INTO `ncm` VALUES (94, 0.93, NULL, 3, 1, 2024, 1, 16, 25);
INSERT INTO `ncm` VALUES (95, 0.53, NULL, 3, 1, 2024, 1, 18, 25);
INSERT INTO `ncm` VALUES (96, 0.8, NULL, 3, 1, 2024, 1, 23, 25);
INSERT INTO `ncm` VALUES (97, 0.8, NULL, 3, 1, 2024, 1, 29, 25);
INSERT INTO `ncm` VALUES (98, 0.8, NULL, 3, 1, 2024, 1, 1, 26);
INSERT INTO `ncm` VALUES (101, 0.8, NULL, 3, 1, 2024, 1, 9, 26);
INSERT INTO `ncm` VALUES (102, 0.93, NULL, 3, 1, 2024, 1, 16, 26);
INSERT INTO `ncm` VALUES (103, 0.53, NULL, 3, 1, 2024, 1, 18, 26);
INSERT INTO `ncm` VALUES (104, 0.8, NULL, 3, 1, 2024, 1, 23, 26);
INSERT INTO `ncm` VALUES (105, 0.8, NULL, 3, 1, 2024, 1, 29, 26);
INSERT INTO `ncm` VALUES (106, 0.53, NULL, 2, 1, 2024, 1, 18, 2);
INSERT INTO `ncm` VALUES (107, 0.27, 1, 1, 1, 2024, 1, 26, 24);
INSERT INTO `ncm` VALUES (109, 0.27, 1, 3, 1, 2024, 1, 26, 22);
INSERT INTO `ncm` VALUES (124, 0.8, NULL, 2, 1, 2025, 1, 1, 2);
INSERT INTO `ncm` VALUES (125, 0.8, NULL, 2, 1, 2025, 1, 9, 2);
INSERT INTO `ncm` VALUES (126, 0.93, NULL, 2, 1, 2025, 1, 16, 2);
INSERT INTO `ncm` VALUES (127, 0.8, NULL, 2, 1, 2025, 1, 23, 2);
INSERT INTO `ncm` VALUES (128, 0.8, NULL, 2, 1, 2025, 1, 29, 2);
INSERT INTO `ncm` VALUES (129, 0.53, NULL, 2, 1, 2025, 1, 18, 2);
INSERT INTO `ncm` VALUES (130, 0.8, NULL, 1, 1, 2025, 1, 1, 24);
INSERT INTO `ncm` VALUES (131, 0.8, NULL, 1, 1, 2025, 1, 9, 24);
INSERT INTO `ncm` VALUES (132, 0.4, NULL, 1, 1, 2025, 1, 11, 24);
INSERT INTO `ncm` VALUES (133, 0.4, NULL, 1, 1, 2025, 1, 16, 24);
INSERT INTO `ncm` VALUES (134, 0.8, NULL, 1, 1, 2025, 1, 18, 24);
INSERT INTO `ncm` VALUES (135, 1.6, NULL, 1, 1, 2025, 1, 23, 24);
INSERT INTO `ncm` VALUES (136, 0.27, 1, 1, 1, 2025, 1, 26, 24);
INSERT INTO `ncm` VALUES (137, 0.8, NULL, 2, 1, 2025, 3, 1, 2);
INSERT INTO `ncm` VALUES (138, 0.8, 3, 2, 1, 2025, 3, 4, 2);

-- ----------------------------
-- Table structure for news
-- ----------------------------
DROP TABLE IF EXISTS `news`;
CREATE TABLE `news`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NULL DEFAULT NULL,
  `status` int(11) NULL DEFAULT NULL,
  `time` datetime(6) NULL DEFAULT NULL,
  `title` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NULL DEFAULT NULL,
  `id_user` int(11) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `FK12hpw4r0ijydvpgr76v6p4vno`(`id_user` ASC) USING BTREE,
  CONSTRAINT `FK12hpw4r0ijydvpgr76v6p4vno` FOREIGN KEY (`id_user`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_uca1400_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of news
-- ----------------------------
INSERT INTO `news` VALUES (1, 'Ngày 13 tháng 5 năm 2024, tại phòng họp của Khoa Công nghệ Thông tin, đã diễn ra buổi làm việc hợp tác giữa Khoa và Công ty Cổ phần Xuất nhập khẩu và Thương mại BINKO GROUP. Buổi gặp gỡ nhằm thúc đẩy các hoạt động hợp tác trong lĩnh vực đào tạo và phát triển chương trình chứng chỉ ESG dành cho sinh viên.\r\n\r\nMục tiêu chính của buổi làm việc là thống nhất về nội dung, phương pháp triển khai và phối hợp thực hiện chương trình đào tạo chứng chỉ ESG cho sinh viên, nhằm đáp ứng nhu cầu ngày càng tăng về nhân lực có kiến thức và kỹ năng về ESG trong bối cảnh toàn cầu đang hướng tới phát triển bền vững.Về phía BINKO GROUP, có sự tham gia của ông Nguyễn Duy Bình, Chủ tịch Hội đồng quản trị của công ty. Về phía Khoa Công nghệ Thông tin, có sự tham dự của Ban lãnh đạo khoa, đại diện là TS. Phạm Quang Dũng, Phó trưởng khoa phụ trách khoa Công nghệ Thông tin.\r\n\r\nTrong buổi họp, các bên đã cùng nhau trao đổi về nội dung và phương pháp thực hiện chương trình. Đồng thời, cũng đã giới thiệu khái quát về ESG – viết tắt của Environmental (Môi trường), Social (Xã hội) và Governance (Quản trị). Đây là bộ ba tiêu chuẩn dùng để đo lường mức độ phát triển bền vững của doanh nghiệp và tác động của họ đến cộng đồng. (Environmental:  Đánh giá cách doanh nghiệp quản lý tác động tới môi trường, như xử lý chất thải, tiêu thụ năng lượng, bảo vệ đa dạng sinh học, giảm thiểu biến đổi khí hậu; Social: Đánh giá mối quan hệ của doanh nghiệp với nhân viên, khách hàng, cộng đồng và các đối tác, dựa trên quyền lao động, an toàn, sức khỏe, quản lý chuỗi cung ứng và tác động xã hội; Governance: Đánh giá cấu trúc quản trị, quản lý rủi ro, đạo đức kinh doanh, minh bạch và trách nhiệm giải trình).\r\n\r\n Chương trình nhận thức rõ ESG ngày càng trở thành yêu cầu bắt buộc của doanh nghiệp và là yếu tố quan trọng trong tuyển dụng nhân lực tương lai. Do đó, việc trang bị kiến thức về ESG cho sinh viên không chỉ giúp nâng cao năng lực cạnh tranh mà còn góp phần phát triển bền vững cộng đồng.\r\n\r\nTrong buổi gặp mặt, phía Khoa Công nghệ Thông tin nhấn mạnh mong muốn xây dựng các chương trình đào tạo phù hợp với xu hướng toàn cầu về phát triển bền vững, đặc biệt là trong lĩnh vực công nghệ thông tin và quản trị doanh nghiệp. Các đại diện của khoa bày tỏ sự quan tâm lớn đến việc tích hợp các kiến thức ESG vào chương trình đào tạo, giúp sinh viên không chỉ nắm vững kiến thức lý thuyết mà còn có kỹ năng thực hành thực tế.\r\n\r\nPhía Binkoglobal, một trong những công ty hàng đầu về tư vấn và giải pháp ESG, chia sẻ về năng lực và kinh nghiệm trong việc triển khai các dự án ESG quốc tế, cũng như mong muốn góp phần nâng cao nhận thức và kỹ năng cho sinh viên tương lai. Công ty bày tỏ sự sẵn lòng hợp tác trong việc xây dựng nội dung, tổ chức workshop, hướng dẫn thực hành, và cung cấp case study thực tế từ doanh nghiệp.\r\n\r\nHai bên đã thảo luận về việc phối hợp xây dựng chương trình đào tạo ESG phù hợp với sinh viên ngành Công nghệ Thông tin, đồng thời mở rộng sang các lĩnh vực liên quan như quản trị doanh nghiệp, truyền thông bền vững và phân tích dữ liệu ESG.\r\n\r\nCũng trong buổi họp, các bên đã thảo luận và đưa ra phương án về các hoạt động chính gồm:\r\n\r\n– Phối hợp xây dựng nội dung chương trình đào tạo, đảm bảo phù hợp với xu hướng toàn cầu và yêu cầu doanh nghiệp.\r\n\r\n– Tổ chức các buổi hội thảo, workshop thực hành, hướng dẫn sinh viên thiết kế dự án ESG thực tế.\r\n\r\n– Cung cấp các case study doanh nghiệp để sinh viên có cơ hội phân tích, đề xuất giải pháp.\r\n\r\n– Thực hiện các chương trình thực tập, nâng cao khả năng ứng tuyển của sinh viên sau khi tốt nghiệp.\r\n\r\nBuổi làm việc đã diễn ra trong không khí hợp tác cởi mở, thể hiện sự quyết tâm của cả hai bên trong việc thúc đẩy hoạt động đào tạo, góp phần nâng cao chất lượng nguồn nhân lực đáp ứng yêu cầu phát triển bền vững của doanh nghiệp và xã hội. Trong thời gian tới, hai bên sẽ tiến hành xây dựng kế hoạch cụ thể, triển khai các hoạt động phối hợp và tổ chức các buổi hội thảo giới thiệu chương trình đến sinh viên toàn trường.\r\n\r\nChúng tôi tin tưởng rằng, sự hợp tác này sẽ góp phần tạo ra nhiều cơ hội học tập thực tiễn, nâng cao kỹ năng và kiến thức ESG cho sinh viên, từ đó góp phần xây dựng cộng đồng doanh nghiệp và nguồn nhân lực bền vững trong tương lai.', 2, '2025-06-12 20:36:58.000000', 'Khoa Công nghệ Thông tin làm việc với Công ty cổ phần Xuất nhập Khẩu và Thương mại BINKO GROUP để đẩy mạnh hợp tác về đào tạo về ESG cho sinh viên.', 2);
INSERT INTO `news` VALUES (2, 'Căn cứ theo Kế hoạch thực hiện khóa luận tốt nghiệp học kỳ 2 năm học 2024-2025, Khoa Công nghệ thông tin thông báo lịch bảo vệ khóa luận tốt nghiệp cho những sinh viên đủ điều kiện bảo vệ như sau:\r\n\r\nThời gian: Từ 7h30′, ngày 18/07-19/07/2025.\r\n\r\nĐịa điểm: Khai mạc tại phòng 303 – Phòng hội thảo (Tầng 3 tòa  nhà Bùi Huy Đáp). Sinh viên bảo vệ ngày 18/07 bắt buộc phải dự khai mạc tại phòng 303.\r\n\r\nLưu ý:  Mỗi sinh viên bảo vệ trong khoảng 20 phút (gồm cả chạy demo chương trình).\r\n\r\nĐể chuẩn bị cho buổi bảo vệ diễn ra tốt đẹp, yêu cầu trang phục: Mặc áo sơ mi trắng, quần/chân váy tối màu, không đi dép lê.', 2, '2025-07-18 15:43:02.000000', 'Thông báo về việc bảo vệ khóa luận tốt nghiệp – HK2-2024-2025', 1);

-- ----------------------------
-- Table structure for news_comment
-- ----------------------------
DROP TABLE IF EXISTS `news_comment`;
CREATE TABLE `news_comment`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `comment` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NULL DEFAULT NULL,
  `time` datetime(6) NULL DEFAULT NULL,
  `id_news` int(11) NULL DEFAULT NULL,
  `id_user` int(11) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `FKme5wqxcvb2srdkdvno2uasjnp`(`id_news` ASC) USING BTREE,
  INDEX `FKmx47ee9wyjetfpvlb7w7g96ev`(`id_user` ASC) USING BTREE,
  CONSTRAINT `FKme5wqxcvb2srdkdvno2uasjnp` FOREIGN KEY (`id_news`) REFERENCES `news` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FKmx47ee9wyjetfpvlb7w7g96ev` FOREIGN KEY (`id_user`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_uca1400_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of news_comment
-- ----------------------------
INSERT INTO `news_comment` VALUES (4, 'test', '2025-06-14 12:48:29.000000', 1, 2);

-- ----------------------------
-- Table structure for news_image
-- ----------------------------
DROP TABLE IF EXISTS `news_image`;
CREATE TABLE `news_image`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `image_name` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NULL DEFAULT NULL,
  `id_news` int(11) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `FKk7enm8n6r6isomdbcuxxs18ep`(`id_news` ASC) USING BTREE,
  CONSTRAINT `FKk7enm8n6r6isomdbcuxxs18ep` FOREIGN KEY (`id_news`) REFERENCES `news` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_uca1400_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of news_image
-- ----------------------------
INSERT INTO `news_image` VALUES (3, 'image_1.jpg', 1);

-- ----------------------------
-- Table structure for operating_standards
-- ----------------------------
DROP TABLE IF EXISTS `operating_standards`;
CREATE TABLE `operating_standards`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `gs_pgs` int(11) NULL DEFAULT NULL,
  `ks_cn` int(11) NULL DEFAULT NULL,
  `ts` int(11) NULL DEFAULT NULL,
  `ths` int(11) NULL DEFAULT NULL,
  `criteria` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NULL DEFAULT NULL,
  `id_type_of_criteria` int(11) NULL DEFAULT NULL,
  `unit` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 34 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_uca1400_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of operating_standards
-- ----------------------------
INSERT INTO `operating_standards` VALUES (1, 2, 1, 1, 1, 'Trình bày seminar ', 1, 'Lần/năm');
INSERT INTO `operating_standards` VALUES (5, 3, 6, 3, 6, 'Tham dự seminar', 1, 'Lần/năm');
INSERT INTO `operating_standards` VALUES (9, 2, 1, 1, 1, 'Bài tham luận trình bày tại hội thảo', 2, NULL);
INSERT INTO `operating_standards` VALUES (13, 2, 4, 2, 4, 'Tham gia hội thảo', 2, NULL);
INSERT INTO `operating_standards` VALUES (20, 1, NULL, 0, NULL, 'Bài báo quốc tế danh mục WoS/Scopus', 3, 'Bài/năm');
INSERT INTO `operating_standards` VALUES (21, 1, NULL, NULL, 1, 'Bài báo tiếng Anh (tạp chí học viện)', 3, 'Bài/năm');
INSERT INTO `operating_standards` VALUES (22, NULL, 1, 1, 1, 'Bài báo tiếng việt (tạp chí học viện)', 4, 'Bài/năm');
INSERT INTO `operating_standards` VALUES (23, 1, NULL, 1, 1, 'Bài tham luận hội thảo có phản biện', 5, 'Bài/năm');
INSERT INTO `operating_standards` VALUES (24, 1, NULL, 1, 0, 'Bài tổng quan về lĩnh vực nghiên cứu', 6, 'Bài/năm');
INSERT INTO `operating_standards` VALUES (25, NULL, 1, 1, 2, 'Các hoạt động tư vấn/ Hướng dẫn kỹ thuật/ Bản tin KH&CN đăng trên website học viện', 7, 'Sản phẩm/năm');
INSERT INTO `operating_standards` VALUES (26, 1, NULL, NULL, NULL, 'Quy trình kỹ thuật/ Tiến bộ kỹ thuật/ Tiêu chuẩn kỹ thuật được công nhận cấp cơ sở ', 8, 'Sản phẩm/năm');
INSERT INTO `operating_standards` VALUES (27, 2, NULL, 2, 1, 'Đề xuất cấp bộ và tương đương', 9, 'Đề xuất/năm');
INSERT INTO `operating_standards` VALUES (28, 0, NULL, 0, NULL, 'Đề xuất cấp bộ và tương đương( chủ trì )', 10, 'nv/năm');
INSERT INTO `operating_standards` VALUES (29, 1, 1, 1, 1, 'Hướng dẫn nhóm sinh viên NCKH', 10, 'nv/năm');
INSERT INTO `operating_standards` VALUES (30, 2, 2, 2, 2, 'Tham dự hội đồng tư vấn khoa học /tư vấn định hướng nghiên cứu, xây dựng các thuyết minh đề tài/ dự án ', 11, 'Hội dồng/năm');
INSERT INTO `operating_standards` VALUES (31, 2, 2, 2, 2, 'Tham dự Seminar/ chuyên đề do chuyên gia (quốc tế, trong nước, cơ quan quản lí, doanh nghiệp, ...) trình bày', 12, 'Lần/năm');
INSERT INTO `operating_standards` VALUES (32, NULL, NULL, NULL, NULL, 'Xây dựng và triển khai các đề án/ Nhiệm vụ KH&CN của học viện ', 13, 'Tiết/năm/nhóm');
INSERT INTO `operating_standards` VALUES (33, 1, 1, 1, 1, 'Hợp dồng KH&CN khác: tập huấn', 13, 'nv/năm');

-- ----------------------------
-- Table structure for operating_standards_2
-- ----------------------------
DROP TABLE IF EXISTS `operating_standards_2`;
CREATE TABLE `operating_standards_2`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `catalog` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NULL DEFAULT NULL,
  `name` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NULL DEFAULT NULL,
  `unit` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NULL DEFAULT NULL,
  `id_operating_standard` int(11) NULL DEFAULT NULL,
  `id_type_of_criteria` int(11) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `FKn2v4lrt4mu2oono54pax3s0cd`(`id_operating_standard` ASC) USING BTREE,
  INDEX `FK4p4jwee4ue9c7ju8ahmd16tsv`(`id_type_of_criteria` ASC) USING BTREE,
  CONSTRAINT `FK4p4jwee4ue9c7ju8ahmd16tsv` FOREIGN KEY (`id_type_of_criteria`) REFERENCES `type_of_criteria` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FKn2v4lrt4mu2oono54pax3s0cd` FOREIGN KEY (`id_operating_standard`) REFERENCES `operating_standards` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 41 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_uca1400_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of operating_standards_2
-- ----------------------------
INSERT INTO `operating_standards_2` VALUES (1, 'Seminar', 'Trình bày seminar', 'Giờ/bài', 5, 1);
INSERT INTO `operating_standards_2` VALUES (2, 'Seminar', 'Trừ giờ NCKH do thiếu tham gia Seminar', 'Giờ/Lượt người', 5, 1);
INSERT INTO `operating_standards_2` VALUES (3, 'Tổ chức hội thảo ', 'Tổ chức hội thảo cấp Quốc tế', 'Giờ/Hội thảo', 9, 2);
INSERT INTO `operating_standards_2` VALUES (4, 'Tổ chức hội thảo ', 'Tổ chức hội thảo cấp Quốc Gia', 'Giờ/Hội thảo', 9, 2);
INSERT INTO `operating_standards_2` VALUES (5, 'Tổ chức hội thảo ', 'Tổ chức hội thảo cấp Học Viện', 'Giờ/Hội thảo', 9, 2);
INSERT INTO `operating_standards_2` VALUES (6, 'Tổ chức hội thảo ', 'Trừ giờ NCKH do thiếu tham gia hội thảo ', 'Giờ/Lượt người', 9, 2);
INSERT INTO `operating_standards_2` VALUES (7, 'Bài tham luận trình bày tại hội thảo ', 'Trình bày tại hội thảo cấp Quốc Tế ', 'Giờ/bài', 9, 2);
INSERT INTO `operating_standards_2` VALUES (8, 'Bài tham luận trình bày tại hội thảo ', 'Trình bày hội thảo cấp Quốc Gia', 'Giờ/bài', 9, 2);
INSERT INTO `operating_standards_2` VALUES (9, 'Bài tham luận trình bày tại hội thảo ', 'Trình bày hội thảo cấp Học Viện ', 'Giờ/bài', 9, 2);
INSERT INTO `operating_standards_2` VALUES (10, 'Bài báo quốc tế', 'Bài báo quốc tế thuộc danh mục Wos', 'Giờ/bài', 20, 3);
INSERT INTO `operating_standards_2` VALUES (11, 'Bài báo quốc tế', 'Bài báo quốc tế thuộc danh mục Scopus', 'Giờ/bài', 20, 3);
INSERT INTO `operating_standards_2` VALUES (12, 'Bài báo quốc tế', 'Bài báo tiếng Anh (Tạp chí của học viện)', 'Giờ/bài', 21, 3);
INSERT INTO `operating_standards_2` VALUES (13, 'Bài báo quốc tế', 'Bài báo quốc tế không thuộc danh mục Wos/Scopus', 'Giờ/bài', 21, 3);
INSERT INTO `operating_standards_2` VALUES (14, 'Bài báo quốc tế', 'Trích dẫn bài báo tiếng Anh của Học Viện ', 'Giờ/bài', 21, 3);
INSERT INTO `operating_standards_2` VALUES (15, 'Bài báo tiếng việt  ', 'Bài báo tiếng Việt đăng trên Tạp chí của học viện ', 'Giờ/bài', 22, 4);
INSERT INTO `operating_standards_2` VALUES (16, 'Bài báo tiếng việt  ', 'Bài báo tiếng Việt đăng trên các tạp chí khác', 'Giờ/bài', 22, 4);
INSERT INTO `operating_standards_2` VALUES (17, 'Bài tham luận hội thảo đăng kỉ yếu ', 'Hội thảo cấp Quốc tế', 'Giờ/bài', 23, 5);
INSERT INTO `operating_standards_2` VALUES (18, 'Bài tham luận hội thảo đăng kỉ yếu ', 'Hội thảo cấp Quốc gia', 'Giờ/bài', 23, 5);
INSERT INTO `operating_standards_2` VALUES (19, 'Bài tham luận hội thảo đăng kỉ yếu ', 'Hội thảo cấp Học Viện', 'Giờ/bài', 23, 5);
INSERT INTO `operating_standards_2` VALUES (20, 'Bài tổng quan lĩnh vực nghiên cứu', 'Bài tổng quan lĩnh vực nghiên cứu', 'Giờ/bài', 24, 6);
INSERT INTO `operating_standards_2` VALUES (21, 'Quy trình kỹ thuật/ tiến bộ kĩ thuật/ Tiêu chuẩn kỹ thuật được công nhận cấp cơ sở;Góp ý văn bản quy phạm pháp luật;Thông tin kết quả nghiên cứu đăng trên Website/ tập san Học viện', 'Quy trình kỹ thuật/ tiến bộ kĩ thuật/ Tiêu chuẩn kỹ thuật được công nhận cấp cơ sở;Góp ý văn bản quy phạm pháp luật;Thông tin kết quả nghiên cứu đăng trên Website/ tập san Học viện', 'Giờ/Sản phẩm', 26, 8);
INSERT INTO `operating_standards_2` VALUES (22, 'Đề xuất đưa vào danh mục tuyển chọn', 'Cấp quốc gia', 'Giờ/Đề xuất', 27, 9);
INSERT INTO `operating_standards_2` VALUES (23, 'Đề xuất đưa vào danh mục tuyển chọn', 'Cấp bộ và tương đương', 'Giờ/Đề xuất', 27, 9);
INSERT INTO `operating_standards_2` VALUES (24, 'Đề xuất đưa vào danh mục tuyển chọn', 'Cấp học viện trọng điểm', 'Giờ/Đề xuất', 27, 9);
INSERT INTO `operating_standards_2` VALUES (25, 'Nhiệm vụ KH&CN được phê duyệt ', 'Cấp quốc gia ', 'Giờ/Đề tài', 28, 10);
INSERT INTO `operating_standards_2` VALUES (26, 'Nhiệm vụ KH&CN được phê duyệt ', 'Cấp Bộ và tương đương', 'Giờ/Đề tài', 28, 10);
INSERT INTO `operating_standards_2` VALUES (27, 'Nhiệm vụ KH&CN được phê duyệt ', 'Cấp Học viện trọng điểm', 'Giờ/Đề tài', 28, 10);
INSERT INTO `operating_standards_2` VALUES (28, 'Nhiệm vụ KH&CN được phê duyệt ', 'Cấp Học viện', 'Giờ/Đề tài', 28, 10);
INSERT INTO `operating_standards_2` VALUES (29, 'Nhiệm vụ KH&CN được phê duyệt ', 'Hướng dẫn sinh viên NCKH', 'Giờ/Nhóm', 29, 10);
INSERT INTO `operating_standards_2` VALUES (30, 'Tổ chức hội đồng tư vấn định hướng nghiên cứu', 'Tổ chức hội đồng tư vấn định hướng nghiên cứu', 'Giờ/Hội đồng', 30, 11);
INSERT INTO `operating_standards_2` VALUES (31, 'Mời chuyên gia trình bày seminar/ chuyên đề ', 'Mời chuyên gia trình bày seminar/ chuyên đề ', 'Giờ/Seminar', 31, 12);
INSERT INTO `operating_standards_2` VALUES (32, 'Các hoạt động KH&CN khác', 'Chương sách nước ngoài có ISBN', 'Giờ/Chương', 32, 13);
INSERT INTO `operating_standards_2` VALUES (33, 'Các hoạt động KH&CN khác', 'Xây dựng đề án của Học Viện (được phê duyệt)', 'Giờ/Đề án', 32, 13);
INSERT INTO `operating_standards_2` VALUES (34, 'Các hoạt động KH&CN khác', 'Bài đăng tin quảng bá Học Viện (theo đặt hàng)', 'Giờ/Bài', 32, 13);
INSERT INTO `operating_standards_2` VALUES (35, 'Các hoạt động KH&CN khác', 'Giáo trình được xuất bản (tái bản – lần đầu)', 'Giờ/Giáo trình', 32, 13);
INSERT INTO `operating_standards_2` VALUES (36, 'Các hoạt động KH&CN khác', 'Bài giảng của môn học mới được phê duyệt', 'Giờ/Bài giảng', 32, 13);
INSERT INTO `operating_standards_2` VALUES (37, 'Các hoạt động KH&CN khác', 'Sách chuyên khảo', 'Giờ/Sách', 32, 13);
INSERT INTO `operating_standards_2` VALUES (38, 'Các hoạt động KH&CN khác', 'Sách tham khảo', 'Giờ/Sách', 32, 13);
INSERT INTO `operating_standards_2` VALUES (39, 'Các hoạt động KH&CN khác', 'Hợp đồng KH&CN về tài khoản của học viện', 'Giờ/10 tr.đồng', 32, 13);
INSERT INTO `operating_standards_2` VALUES (40, 'Các hoạt động tư vấn/ Hướng dẫn kỹ thuật/ Bản tin KH&CN đăng trên website học viện', 'Các hoạt động tư vấn/ Hướng dẫn kỹ thuật/ Bản tin KH&CN đăng trên website học viện', 'Giờ/Sản phẩm', 25, 7);

-- ----------------------------
-- Table structure for overview_paper
-- ----------------------------
DROP TABLE IF EXISTS `overview_paper`;
CREATE TABLE `overview_paper`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `article_link` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NULL DEFAULT NULL,
  `id_event` int(11) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_uca1400_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of overview_paper
-- ----------------------------
INSERT INTO `overview_paper` VALUES (1, 'https://fita.vnua.edu.vn/tong-quan-ve-dien-toan-dam-may/', 37);
INSERT INTO `overview_paper` VALUES (2, 'https://fita.vnua.edu.vn/tong-quan-ve-cong-nghe-thong-tin-va-truyen-thong-ict-information-communication-technology-phan-i-cong-nghe-phan-cung/', 38);
INSERT INTO `overview_paper` VALUES (3, 'https://fita.vnua.edu.vn/it-business-analyst-va-xu-huong-nghe-nghiep/', 39);
INSERT INTO `overview_paper` VALUES (4, 'https://fita.vnua.edu.vn/cac-ky-thuat-hoc-may-va-thi-giac-may-tinh-trong-cac-ung-dung-giam-sat-lien-tuc-to-ong/', 40);

-- ----------------------------
-- Table structure for research_advisory_council
-- ----------------------------
DROP TABLE IF EXISTS `research_advisory_council`;
CREATE TABLE `research_advisory_council`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `document_template` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NULL DEFAULT NULL,
  `id_event` int(11) NULL DEFAULT NULL,
  `image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NULL DEFAULT NULL,
  `task_description` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_uca1400_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of research_advisory_council
-- ----------------------------

-- ----------------------------
-- Table structure for research_proposal
-- ----------------------------
DROP TABLE IF EXISTS `research_proposal`;
CREATE TABLE `research_proposal`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_event` int(11) NULL DEFAULT NULL,
  `proposal_type` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_uca1400_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of research_proposal
-- ----------------------------

-- ----------------------------
-- Table structure for resume
-- ----------------------------
DROP TABLE IF EXISTS `resume`;
CREATE TABLE `resume`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `address` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NOT NULL,
  `birthday` date NOT NULL,
  `code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NOT NULL,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NOT NULL,
  `phone` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NOT NULL,
  `id_admin` int(11) NULL DEFAULT NULL,
  `id_user` int(11) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `FKnuyi2qktrc8u9k09v55vwdlta`(`id_admin` ASC) USING BTREE,
  INDEX `FK35r6ke2eybygud55k7if4184x`(`id_user` ASC) USING BTREE,
  CONSTRAINT `FK35r6ke2eybygud55k7if4184x` FOREIGN KEY (`id_user`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FKnuyi2qktrc8u9k09v55vwdlta` FOREIGN KEY (`id_admin`) REFERENCES `admin` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 30 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_uca1400_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of resume
-- ----------------------------
INSERT INTO `resume` VALUES (1, '', '2025-09-05', '6660556', 'ngocduongxk2003@gmail.com', '0962498015', 2, NULL);
INSERT INTO `resume` VALUES (5, 'ssssssssssssssssssss', '1999-09-09', 'ptla', 'ptla@gmail.com', '0987654545', NULL, 2);
INSERT INTO `resume` VALUES (18, 'abcdxyz bla bla, bla bla', '2000-08-09', '00409001013', 'user@gmail.com', '0212345678', NULL, 18);
INSERT INTO `resume` VALUES (19, 'abcdxyz bla bla, bla bla', '2000-08-09', '00400601292', 'user@gmail.com', '0212345678', NULL, 19);
INSERT INTO `resume` VALUES (20, 'abcdxyz bla bla, bla bla', '2000-08-09', '00400401180', 'user@gmail.com', '0212345678', NULL, 20);
INSERT INTO `resume` VALUES (21, 'abcdxyz bla bla, bla bla', '2000-08-09', '00409001819', 'user@gmail.com', '0212345678', NULL, 21);
INSERT INTO `resume` VALUES (22, 'abcdxyz bla bla, bla bla', '2000-08-09', '00401001532', 'user@gmail.com', '0212345678', NULL, 22);
INSERT INTO `resume` VALUES (23, 'abcdxyz bla bla, bla bla', '2000-08-09', '00409001649', 'user@gmail.com', '0212345678', NULL, 23);
INSERT INTO `resume` VALUES (24, 'abcdxyz bla bla, bla bla', '2000-08-09', '00400601082', 'userDung@gmail.com', '0987654321', NULL, 24);
INSERT INTO `resume` VALUES (25, 'abcdxyz bla bla, bla bla', '2000-08-09', '00409001645', 'user@gmail.com', '0212345678', NULL, 25);
INSERT INTO `resume` VALUES (26, 'abcdxyz bla bla, bla bla', '2000-08-09', '00409001588', 'user@gmail.com', '0212345678', NULL, 26);
INSERT INTO `resume` VALUES (28, 'Trâu Quỳ - Gia Lâm - Hà Nội', '2003-11-04', '6660554', 'ngominh041103@gmail.com', '0974647799', 1, NULL);
INSERT INTO `resume` VALUES (29, 'Trâu Quỳ - Gia Lâm - Hà Nội', '2003-04-04', '6660553', 'ngominh041103@gmail.com', '0123456789', NULL, 30);

-- ----------------------------
-- Table structure for role
-- ----------------------------
DROP TABLE IF EXISTS `role`;
CREATE TABLE `role`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NULL DEFAULT NULL,
  `notes` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_uca1400_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of role
-- ----------------------------
INSERT INTO `role` VALUES (1, 'admin', 'người quản lý');
INSERT INTO `role` VALUES (2, 'user', 'người dùng');

-- ----------------------------
-- Table structure for role_of_event
-- ----------------------------
DROP TABLE IF EXISTS `role_of_event`;
CREATE TABLE `role_of_event`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `max_member` int(11) NULL DEFAULT NULL,
  `norm` float NULL DEFAULT NULL,
  `role_of_event` int(11) NULL DEFAULT NULL,
  `id_operating_standard_2` int(11) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `FK6jxx9afy5d1hguj02tgwi7cd0`(`id_operating_standard_2` ASC) USING BTREE,
  CONSTRAINT `FK6jxx9afy5d1hguj02tgwi7cd0` FOREIGN KEY (`id_operating_standard_2`) REFERENCES `operating_standards_2` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 47 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_uca1400_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of role_of_event
-- ----------------------------
INSERT INTO `role_of_event` VALUES (1, NULL, 10, 4, 1);
INSERT INTO `role_of_event` VALUES (2, NULL, 5, 4, 2);
INSERT INTO `role_of_event` VALUES (3, NULL, 100, 4, 3);
INSERT INTO `role_of_event` VALUES (4, NULL, 60, 4, 4);
INSERT INTO `role_of_event` VALUES (5, NULL, 20, 4, 5);
INSERT INTO `role_of_event` VALUES (6, NULL, 10, 4, 6);
INSERT INTO `role_of_event` VALUES (7, NULL, 50, 4, 7);
INSERT INTO `role_of_event` VALUES (8, NULL, 30, 4, 8);
INSERT INTO `role_of_event` VALUES (9, NULL, 20, 4, 9);
INSERT INTO `role_of_event` VALUES (10, NULL, 210, 4, 10);
INSERT INTO `role_of_event` VALUES (11, NULL, 140, 4, 11);
INSERT INTO `role_of_event` VALUES (12, NULL, 70, 4, 12);
INSERT INTO `role_of_event` VALUES (13, NULL, 70, 4, 13);
INSERT INTO `role_of_event` VALUES (14, NULL, 1, 4, 14);
INSERT INTO `role_of_event` VALUES (15, NULL, 40, 4, 15);
INSERT INTO `role_of_event` VALUES (16, NULL, 40, 4, 16);
INSERT INTO `role_of_event` VALUES (17, NULL, 25, 4, 17);
INSERT INTO `role_of_event` VALUES (18, NULL, 15, 4, 18);
INSERT INTO `role_of_event` VALUES (19, NULL, 10, 4, 19);
INSERT INTO `role_of_event` VALUES (20, NULL, 10, 4, 20);
INSERT INTO `role_of_event` VALUES (21, NULL, 10, 4, 21);
INSERT INTO `role_of_event` VALUES (22, NULL, 10, 4, 22);
INSERT INTO `role_of_event` VALUES (23, NULL, 5, 4, 23);
INSERT INTO `role_of_event` VALUES (24, NULL, 2.5, 4, 24);
INSERT INTO `role_of_event` VALUES (25, NULL, 5, 4, 40);
INSERT INTO `role_of_event` VALUES (26, NULL, 90, 1, 25);
INSERT INTO `role_of_event` VALUES (27, NULL, 40, 2, 25);
INSERT INTO `role_of_event` VALUES (28, 8, 150, 3, 25);
INSERT INTO `role_of_event` VALUES (29, NULL, 70, 1, 26);
INSERT INTO `role_of_event` VALUES (30, NULL, 30, 2, 26);
INSERT INTO `role_of_event` VALUES (31, 8, 110, 3, 26);
INSERT INTO `role_of_event` VALUES (32, NULL, 40, 1, 27);
INSERT INTO `role_of_event` VALUES (33, 5, 50, 3, 27);
INSERT INTO `role_of_event` VALUES (34, NULL, 15, 1, 28);
INSERT INTO `role_of_event` VALUES (35, 4, 25, 3, 28);
INSERT INTO `role_of_event` VALUES (36, NULL, 15, 4, 29);
INSERT INTO `role_of_event` VALUES (37, NULL, 20, 4, 30);
INSERT INTO `role_of_event` VALUES (38, NULL, 15, 4, 31);
INSERT INTO `role_of_event` VALUES (39, NULL, 80, 4, 32);
INSERT INTO `role_of_event` VALUES (40, NULL, 120, 4, 33);
INSERT INTO `role_of_event` VALUES (41, NULL, 10, 4, 34);
INSERT INTO `role_of_event` VALUES (42, NULL, 100, 4, 35);
INSERT INTO `role_of_event` VALUES (43, NULL, 30, 4, 36);
INSERT INTO `role_of_event` VALUES (44, NULL, 40, 4, 37);
INSERT INTO `role_of_event` VALUES (45, NULL, 20, 4, 38);
INSERT INTO `role_of_event` VALUES (46, NULL, 1, 4, 39);

-- ----------------------------
-- Table structure for room
-- ----------------------------
DROP TABLE IF EXISTS `room`;
CREATE TABLE `room`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NULL DEFAULT NULL,
  `room_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_uca1400_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of room
-- ----------------------------
INSERT INTO `room` VALUES (1, 'Phòng 207, giảng đường Nguyễn Đăng', 'Hội trường A');
INSERT INTO `room` VALUES (2, 'Nhà hành chính', 'Hội trường C');
INSERT INTO `room` VALUES (3, 'Phòng 323, tầng 3, tòa nhà Bùi Huy Đáp', 'Phòng Vinh Quang');

-- ----------------------------
-- Table structure for seminar
-- ----------------------------
DROP TABLE IF EXISTS `seminar`;
CREATE TABLE `seminar`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `article_link` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NULL DEFAULT NULL,
  `id_event` int(11) NULL DEFAULT NULL,
  `main_author` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NULL DEFAULT NULL,
  `minutes_of_meeting` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NULL DEFAULT NULL,
  `presentation_file` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NULL DEFAULT NULL,
  `seminar_photo` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 12 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_uca1400_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of seminar
-- ----------------------------
INSERT INTO `seminar` VALUES (1, 'abc.com', 1, 'Phạm Thị Lan Anh', 'BB Seminar 30.9.24.pdf', 'Web 4.0.pptx', 'z5861478531794_41dc1b8ad34c03ec6217e54efa8b62c5.jpg');
INSERT INTO `seminar` VALUES (2, 'https://fita.vnua.edu.vn/seminar-khoa-hoc-nghien-cuu-xay-dung-bo-co-so-du-lieu-phan-tich-trang-thai-cam-xuc-khuon-mat/', 11, 'Lương Minh Quân', 'BB Seminar 20.5.24.pdf', 'Seminar_T5_2024.pdf', '12345-1536x864 (1).jpg');
INSERT INTO `seminar` VALUES (3, 'https://fita.vnua.edu.vn/seminar-khoa-hoc-nghien-cuu-xay-dung-tram-do-danh-gia-muc-do-o-nhiem-bang-cong-nghe-iot/', 12, 'Lương Minh Quân', 'BB Seminar 9.9.24.pdf', 'Seminar_T6_6-9-2024_v1 (1).pptx', 'z5861235015522_d2305d24ae8322f043ef1dacbea8bac6.jpg');
INSERT INTO `seminar` VALUES (4, 'https://fita.vnua.edu.vn/seminar-phuong-phap-nghien-cuu-khoa-hoc-va-dinh-huong-nghien-cuu-ung-dung-cntt-trong-nong-nghiep/', 13, 'Nguyễn Xuân Thảo', 'BB Seminar 11.4.24.pdf', 'BC_Mô hình ra quyết định mờ nhóm và UD.pptx', 'z5336907071695_d3ce9f2da78346ed07ed7a5c1ca0cb39-1536x1152.jpg');
INSERT INTO `seminar` VALUES (5, 'https://fita.vnua.edu.vn/khoa-cong-nghe-thong-tin-to-chuc-seminar-khoa-hoc-so-luoc-ve-ky-thuat-dung-anh-tu-song-sieu-am/', 14, 'Nguyễn Trọng Kương', 'BB Seminar 13.5.24.pdf', 'IVUS imaging.pdf', 'z5448960280247_b579d3b872bb16e4dd2479847f35a158.jpg');
INSERT INTO `seminar` VALUES (6, 'https://fita.vnua.edu.vn/seminar-gioi-thieu-giai-phap-xay-dung-phan-mem-ho-tro-cong-tac-quan-ly-day-va-hoc-cap-bo-mon/', 15, 'Vũ Thị Lưu', 'BB Seminar 30.9.24.pdf', '06-12-2024Seminar_Vtluu-2024.pdf', 'z5881100562717_434e162670dae0f854d1956f1a299cd3-1536x1152.jpg');
INSERT INTO `seminar` VALUES (7, 'https://fita.vnua.edu.vn/seminar-thang-12-cua-nhom-ncm-ung-dung-cong-nghe-thong-tin-trong-nong-nghiep/', 16, 'Lê Thị Nhung', 'BB Seminar T12.pdf', '07_Phat hien ong mang phan tu hinh anh va van de mat can bang du lieu_Le Thi Nhung_24-12-2024.pdf', 'z6160543669423_92ccadcc7bc13d4eefb29a4da4516631.jpg');
INSERT INTO `seminar` VALUES (8, 'https://fita.vnua.edu.vn/seminar-thang-12-cua-nhom-ncm-ung-dung-cong-nghe-thong-tin-trong-nong-nghiep/', 17, 'Hoàng Thị Hà', 'BB Seminar T12.pdf', 'Seminar_IT_BA.pdf', 'z6160543341416_22d399697e2e6b72232dd59c3e1f5834.jpg');
INSERT INTO `seminar` VALUES (9, 'https://fita.vnua.edu.vn/seminar-thang-12-cua-nhom-ncm-ung-dung-cong-nghe-thong-tin-trong-nong-nghiep/', 18, 'Trần Trung Hiếu', 'BB Seminar T12.pdf', 'Bao cao seminar_TTHieu.pdf', 'z6160543482685_bc31428c12b050abe22a8daa27807c15.jpg');
INSERT INTO `seminar` VALUES (11, 'https://fita.vnua.edu.vn/seminar-khoa-hoc-nghien-cuu-xay-dung-bo-co-so-du-lieu-phan-tich-trang-thai-cam-xuc-khuon-mat/', 55, 'Ngô Văn Minh', 'MÔI TRƯỜNG VĨ MÔ.docx', 'MÔI TRƯỜNG VĨ MÔ.docx', '12345-1536x864 (1).jpg');

-- ----------------------------
-- Table structure for student_research_guidance
-- ----------------------------
DROP TABLE IF EXISTS `student_research_guidance`;
CREATE TABLE `student_research_guidance`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `end_time` date NULL DEFAULT NULL,
  `id_event` int(11) NULL DEFAULT NULL,
  `result` int(11) NULL DEFAULT NULL,
  `start_time` date NULL DEFAULT NULL,
  `status` int(11) NULL DEFAULT NULL,
  `supervisor_name` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_uca1400_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of student_research_guidance
-- ----------------------------
INSERT INTO `student_research_guidance` VALUES (1, '2024-12-01', 41, NULL, '2024-01-01', 2, 'Phạm Thị Lan Anh');
INSERT INTO `student_research_guidance` VALUES (2, '2024-12-01', 42, NULL, '2024-01-01', 2, 'Vũ Thị Lưu');
INSERT INTO `student_research_guidance` VALUES (3, '2024-12-01', 44, NULL, '2024-01-01', 2, 'Phạm Quang Dũng');
INSERT INTO `student_research_guidance` VALUES (4, '2024-12-01', 45, NULL, '2024-01-01', 2, 'Nguyễn Trọng Kương');
INSERT INTO `student_research_guidance` VALUES (5, '2024-12-01', 46, NULL, '2024-01-01', 2, 'Hoàng Thị Hà');

-- ----------------------------
-- Table structure for time
-- ----------------------------
DROP TABLE IF EXISTS `time`;
CREATE TABLE `time`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `time` time(6) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 14 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_uca1400_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of time
-- ----------------------------
INSERT INTO `time` VALUES (1, '07:00:00.000000');
INSERT INTO `time` VALUES (2, '07:55:00.000000');
INSERT INTO `time` VALUES (3, '08:50:00.000000');
INSERT INTO `time` VALUES (4, '09:55:00.000000');
INSERT INTO `time` VALUES (5, '10:50:00.000000');
INSERT INTO `time` VALUES (6, '12:45:00.000000');
INSERT INTO `time` VALUES (7, '13:40:00.000000');
INSERT INTO `time` VALUES (8, '14:35:00.000000');
INSERT INTO `time` VALUES (9, '15:40:00.000000');
INSERT INTO `time` VALUES (10, '16:35:00.000000');
INSERT INTO `time` VALUES (11, '18:00:00.000000');
INSERT INTO `time` VALUES (12, '18:55:00.000000');
INSERT INTO `time` VALUES (13, '19:50:00.000000');

-- ----------------------------
-- Table structure for time_conversion
-- ----------------------------
DROP TABLE IF EXISTS `time_conversion`;
CREATE TABLE `time_conversion`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `criteria` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NULL DEFAULT NULL,
  `norm` int(11) NOT NULL,
  `unit` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NULL DEFAULT NULL,
  `id_type_of_criteria` int(11) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `FKiruyr0y4ig3r1l6mvo5w8ehcy`(`id_type_of_criteria` ASC) USING BTREE,
  CONSTRAINT `FKiruyr0y4ig3r1l6mvo5w8ehcy` FOREIGN KEY (`id_type_of_criteria`) REFERENCES `type_of_criteria` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_uca1400_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of time_conversion
-- ----------------------------

-- ----------------------------
-- Table structure for title
-- ----------------------------
DROP TABLE IF EXISTS `title`;
CREATE TABLE `title`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NULL DEFAULT NULL,
  `total_norm` int(11) NULL DEFAULT NULL COMMENT 'Tong dinh muc voi tung vai tro',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_uca1400_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of title
-- ----------------------------
INSERT INTO `title` VALUES (1, 'GS_PGS', 300);
INSERT INTO `title` VALUES (2, 'TS', 220);
INSERT INTO `title` VALUES (3, 'THS', 140);
INSERT INTO `title` VALUES (4, 'KS_CN', 70);

-- ----------------------------
-- Table structure for type_of_criteria
-- ----------------------------
DROP TABLE IF EXISTS `type_of_criteria`;
CREATE TABLE `type_of_criteria`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `is_event` bit(1) NULL DEFAULT NULL,
  `name` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 14 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_uca1400_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of type_of_criteria
-- ----------------------------
INSERT INTO `type_of_criteria` VALUES (1, b'1', 'seminar');
INSERT INTO `type_of_criteria` VALUES (2, b'1', 'Hội thảo');
INSERT INTO `type_of_criteria` VALUES (3, b'0', 'Bài báo quốc tế');
INSERT INTO `type_of_criteria` VALUES (4, b'0', 'Bài báo tiếng việt');
INSERT INTO `type_of_criteria` VALUES (5, b'0', 'Bài tham luận hội thảo đăng kỉ yếu ');
INSERT INTO `type_of_criteria` VALUES (6, b'0', 'Bài tổng quan về lĩnh vực nghiên cứu');
INSERT INTO `type_of_criteria` VALUES (7, b'0', 'Các hoạt động tư vấn/ Hướng dẫn kỹ thuật/ Bản tin KH&CN đăng trên website học viện');
INSERT INTO `type_of_criteria` VALUES (8, b'0', 'Quy trình kỹ thuật/ Tiến bộ kỹ thuật/ Tiêu chuẩn kỹ thuật được công nhận cấp cơ sở ');
INSERT INTO `type_of_criteria` VALUES (9, b'0', 'Đề xuất nhiệm vụ NCKH');
INSERT INTO `type_of_criteria` VALUES (10, b'0', 'Nhiệm vụ KH&CN được phê duyệt');
INSERT INTO `type_of_criteria` VALUES (11, b'1', 'Tham dự hội đồng tư vấn khoa học tư vấn định hướng nghiên cứu, xây dựng các thuyết minh đề tài,dự án');
INSERT INTO `type_of_criteria` VALUES (12, b'1', 'Tham dự Seminar/ chuyên đề do chuyên gia (quốc tế, trong nước, cơ quan quản lí, doanh nghiệp, ...) trình bày');
INSERT INTO `type_of_criteria` VALUES (13, b'0', 'Xây dựng và triển khai các đề án/ Nhiệm vụ KH&CN của học viện ');

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `create_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `name` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NULL DEFAULT NULL,
  `password` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NULL DEFAULT NULL,
  `power` int(11) NULL DEFAULT NULL,
  `update_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `username` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NULL DEFAULT NULL,
  `id_role` int(11) NULL DEFAULT NULL,
  `id_title` int(11) NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `in_active` bit(1) NULL DEFAULT NULL,
  `is_deleted` bit(1) NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `FK6njoh3pti5jnlkowken3r8ttn`(`id_role` ASC) USING BTREE,
  INDEX `FKcl9l9ffbtooorchjhw8ffn8t`(`id_title` ASC) USING BTREE,
  CONSTRAINT `FK6njoh3pti5jnlkowken3r8ttn` FOREIGN KEY (`id_role`) REFERENCES `role` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FKcl9l9ffbtooorchjhw8ffn8t` FOREIGN KEY (`id_title`) REFERENCES `title` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 33 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_uca1400_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES (1, '2025-02-10 00:00:00', 'Ngô Văn Minh', 'ee79976c9380d5e337fc1c095ece8c8f22f91f306ceeb161fa51fecede2c4ba1', 4, '2025-09-06 20:46:21', '6660555', 2, NULL, '2025-09-06 20:46:21', NULL, NULL, '2025-09-06 20:46:21');
INSERT INTO `user` VALUES (2, '2025-02-10 00:00:00', 'Phạm Thị Lan Anh', 'ee79976c9380d5e337fc1c095ece8c8f22f91f306ceeb161fa51fecede2c4ba1', 3, '2025-09-06 20:50:42', '00409002109', 2, 3, '2025-09-06 20:50:42', NULL, NULL, '2025-09-06 20:50:42');
INSERT INTO `user` VALUES (10, '2025-02-10 00:00:00', 'Ngô Văn Minh', 'ee79976c9380d5e337fc1c095ece8c8f22f91f306ceeb161fa51fecede2c4ba1', 4, '2025-09-06 20:50:42', '6660555', 2, NULL, '2025-09-06 20:50:42', NULL, NULL, '2025-09-06 20:50:42');
INSERT INTO `user` VALUES (18, '2025-06-04 00:00:00', 'Hoàng Thị Hà', 'ee79976c9380d5e337fc1c095ece8c8f22f91f306ceeb161fa51fecede2c4ba1', 3, '2025-09-06 20:50:42', '00409001013', 2, 3, '2025-09-06 20:50:42', NULL, NULL, '2025-09-06 20:50:42');
INSERT INTO `user` VALUES (19, '2025-06-04 00:00:00', 'Lê Thị Nhung', 'ee79976c9380d5e337fc1c095ece8c8f22f91f306ceeb161fa51fecede2c4ba1', 3, '2025-09-06 20:50:42', '00400601292', 2, 3, '2025-09-06 20:50:42', NULL, NULL, '2025-09-06 20:50:42');
INSERT INTO `user` VALUES (20, '2025-06-04 00:00:00', 'Lương Minh Quân', 'ee79976c9380d5e337fc1c095ece8c8f22f91f306ceeb161fa51fecede2c4ba1', 3, '2025-09-06 20:50:42', '00400401180', 2, 3, '2025-09-06 20:50:42', NULL, NULL, '2025-09-06 20:50:42');
INSERT INTO `user` VALUES (21, '2025-06-04 18:08:05', 'Nguyễn Hữu Hải', 'ee79976c9380d5e337fc1c095ece8c8f22f91f306ceeb161fa51fecede2c4ba1', 3, '2025-09-06 20:50:42', '00409001819', 2, 3, '2025-09-06 20:50:42', NULL, NULL, '2025-09-06 20:50:42');
INSERT INTO `user` VALUES (22, '2025-06-04 00:00:00', 'Nguyễn Trọng Kương', 'ee79976c9380d5e337fc1c095ece8c8f22f91f306ceeb161fa51fecede2c4ba1', 2, '2025-09-06 20:50:42', '00401001532', 2, 2, '2025-09-06 20:50:42', NULL, NULL, '2025-09-06 20:50:42');
INSERT INTO `user` VALUES (23, '2025-06-04 00:00:00', 'Nguyễn Xuân Thảo', 'ee79976c9380d5e337fc1c095ece8c8f22f91f306ceeb161fa51fecede2c4ba1', 3, '2025-09-06 20:50:42', '00409001649', 2, 3, '2025-09-06 20:50:42', NULL, NULL, '2025-09-06 20:50:42');
INSERT INTO `user` VALUES (24, '2025-06-04 00:00:00', 'Phạm Quang Dũng', 'ee79976c9380d5e337fc1c095ece8c8f22f91f306ceeb161fa51fecede2c4ba1', 1, '2025-09-06 20:50:42', '00400601082', 2, 2, '2025-09-06 20:50:42', NULL, NULL, '2025-09-06 20:50:42');
INSERT INTO `user` VALUES (25, '2025-06-04 00:00:00', 'Trần Trung Hiếu', 'ee79976c9380d5e337fc1c095ece8c8f22f91f306ceeb161fa51fecede2c4ba1', 3, '2025-09-06 20:50:42', '00409001645', 2, 3, '2025-09-06 20:50:42', NULL, NULL, '2025-09-06 20:50:42');
INSERT INTO `user` VALUES (26, '2025-06-04 00:00:00', 'Vũ Thị Lưu', 'ee79976c9380d5e337fc1c095ece8c8f22f91f306ceeb161fa51fecede2c4ba1', 3, '2025-09-06 20:50:42', '00409001588', 2, 3, '2025-09-06 20:50:42', NULL, NULL, '2025-09-06 20:50:42');
INSERT INTO `user` VALUES (30, '2025-07-19 00:00:00', 'Ngô Văn Minh 2', 'ee79976c9380d5e337fc1c095ece8c8f22f91f306ceeb161fa51fecede2c4ba1', 4, '2025-09-06 20:50:42', '6660553', 2, NULL, '2025-09-06 20:50:42', NULL, NULL, '2025-09-06 20:50:42');
INSERT INTO `user` VALUES (31, '2025-09-06 20:57:07', 'admin', '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', NULL, '2025-09-06 20:57:07', 'admin', 1, NULL, '2025-09-06 20:57:07', NULL, NULL, '2025-09-06 20:57:07');
INSERT INTO `user` VALUES (32, '2025-07-19 00:00:00', 'Ngô Văn Minh 2', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 4, '2025-09-07 09:19:05', '671348', 2, NULL, '2025-09-07 09:19:05', NULL, NULL, '2025-09-07 09:19:05');

-- ----------------------------
-- Table structure for user_infor_ncm
-- ----------------------------
DROP TABLE IF EXISTS `user_infor_ncm`;
CREATE TABLE `user_infor_ncm`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `date_in` date NULL DEFAULT NULL,
  `date_out` date NULL DEFAULT NULL,
  `status` int(11) NULL DEFAULT NULL,
  `id_group` int(11) NULL DEFAULT NULL,
  `id_user` int(11) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `FKhvue6xoswhyx71l7w5wyp5phj`(`id_group` ASC) USING BTREE,
  INDEX `FK86rn9dqs7c1vpauvobjg1uu7h`(`id_user` ASC) USING BTREE,
  CONSTRAINT `FK86rn9dqs7c1vpauvobjg1uu7h` FOREIGN KEY (`id_user`) REFERENCES `user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FKhvue6xoswhyx71l7w5wyp5phj` FOREIGN KEY (`id_group`) REFERENCES `group` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_uca1400_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user_infor_ncm
-- ----------------------------

-- ----------------------------
-- Table structure for vietnamese_paper
-- ----------------------------
DROP TABLE IF EXISTS `vietnamese_paper`;
CREATE TABLE `vietnamese_paper`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `article_link` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NULL DEFAULT NULL,
  `id_event` int(11) NULL DEFAULT NULL,
  `main_author` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NULL DEFAULT NULL,
  `status` int(11) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_uca1400_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of vietnamese_paper
-- ----------------------------
INSERT INTO `vietnamese_paper` VALUES (1, 'https://start.spring.io/', 3, 'Phạm Thị Lan Anh', 3);
INSERT INTO `vietnamese_paper` VALUES (2, 'https://start.spring.io/', 26, 'Vũ Thị Lưu', 3);

SET FOREIGN_KEY_CHECKS = 1;
