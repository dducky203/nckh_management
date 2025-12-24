-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: gateway01.ap-southeast-1.prod.aws.tidbcloud.com    Database: nckh
-- ------------------------------------------------------
-- Server version	8.0.11-TiDB-v7.5.2-serverless

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `active_in_council`
--

DROP TABLE IF EXISTS `active_in_council`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `active_in_council` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `content` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `id_event` int(11) DEFAULT NULL,
  `image` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `minutes_of_meeting` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `presentation_file` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `presenter` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=30003;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `active_in_council`
--

LOCK TABLES `active_in_council` WRITE;
/*!40000 ALTER TABLE `active_in_council` DISABLE KEYS */;
INSERT INTO `active_in_council` VALUES (1,'Giới thiệu và đánh giá ưu điểm và nhược điểm của một số mạng Blockchain Testnet điển hình hiện nay.Tư vấn lựa chọn mạng Blockchain Testnet thích hợp phát triển cho các ứng dụng về Nông nghiệp, Kinh tế, Tài chính,…',49,'12345-1536x864 (1).jpg','BB Hội đồng tư vấn 5.12.24.pdf','BB Hội đồng tư vấn 5.12.24.pdf','TS. Đỗ Ngọc Minh','2025-09-18 11:15:06','2025-09-18 11:15:06'),(2,'-	Giới thiệu và đánh giá ưu điểm và nhược điểm của một số chùm vệ tinh cho phép khai thác dữ liệu hiện nay.  -	Tư vấn lựa chọn dữ liệu được thu thập từ chùm vệ tinh Sentinel (tên của một loạt các vệ tinh quan sát trái đất thuộc Chương trình Copernicus của Cơ quan Không gian Châu Âu - ESA) để ứng dụng công nghệ viễn thám phục vụ nghiên cứu tài nguyên, môi trường, đảm bảo quốc phòng - an ninh.',50,'z6160543221500_b7070175e9021aa90f2c583270b70d1a.jpg','BB Hội đồng tư vấn 24.12.24.pdf','BB Hội đồng tư vấn 24.12.24.pdf','PGS.TS. Trịnh Lê Hùng','2025-09-18 11:15:06','2025-09-18 11:15:06');
/*!40000 ALTER TABLE `active_in_council` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `admin`
--

DROP TABLE IF EXISTS `admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `create_date` datetime(6) DEFAULT NULL,
  `name` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `update_date` datetime(6) DEFAULT NULL,
  `username` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `id_role` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `in_active` bit(1) DEFAULT NULL,
  `is_deleted` bit(1) DEFAULT NULL,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */,
  KEY `FKoe9i3dhuu91kyie1hbjx4dxy3` (`id_role`),
  CONSTRAINT `FKoe9i3dhuu91kyie1hbjx4dxy3` FOREIGN KEY (`id_role`) REFERENCES `nckh`.`role` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=30003;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin`
--

LOCK TABLES `admin` WRITE;
/*!40000 ALTER TABLE `admin` DISABLE KEYS */;
INSERT INTO `admin` VALUES (1,'2025-02-17 17:27:56.000000','Ngo Van Minh','ee79976c9380d5e337fc1c095ece8c8f22f91f306ceeb161fa51fecede2c4ba1','2025-02-17 17:27:50.000000','6660554',1,'2025-09-18 10:37:21',NULL,NULL,'2025-09-18 10:37:21'),(2,'2025-02-17 17:27:56.000000','Ngo Van Minh','a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3','2025-02-17 17:27:50.000000','6660556',1,'2025-09-18 10:37:21',NULL,NULL,'2025-09-18 10:37:21');
/*!40000 ALTER TABLE `admin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `approved_research_task`
--

DROP TABLE IF EXISTS `approved_research_task`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `approved_research_task` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `end_time` date DEFAULT NULL,
  `id_event` int(11) DEFAULT NULL,
  `result` int(11) DEFAULT NULL,
  `start_time` date DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `task_type` varchar(250) DEFAULT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `approved_research_task`
--

LOCK TABLES `approved_research_task` WRITE;
/*!40000 ALTER TABLE `approved_research_task` DISABLE KEYS */;
/*!40000 ALTER TABLE `approved_research_task` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `conference`
--

DROP TABLE IF EXISTS `conference`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `conference` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `article_link` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `id_event` int(11) DEFAULT NULL,
  `image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `minutes_of_meeting` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `organizer_decision` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `paper_title` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `presentation_files` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=30009;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `conference`
--

LOCK TABLES `conference` WRITE;
/*!40000 ALTER TABLE `conference` DISABLE KEYS */;
INSERT INTO `conference` VALUES (1,'https://daotao.vnua.edu.vn/#/home/listbaiviet/tb/page/1/baivietct/-7427593202379359237',2,'ảnh 3.jpg','MÔI TRƯỜNG VĨ MÔ.docx','Nghiên cứu thiết bị IoT ứng dụng trong thu thập dữ liệu về nồng độ mùi trong phòng khám thú y','Nghiên cứu thiết bị IoT ứng dụng trong thu thập dữ liệu về nồng độ mùi trong phòng khám thú y','MÔI TRƯỜNG VĨ MÔ.docx','2025-09-18 11:15:06','2025-09-18 11:15:06'),(2,'https://daotao.vnua.edu.vn/#/home/listbaiviet/tb/page/1/baivietct/-7427593202379359237',19,'z6160543669423_92ccadcc7bc13d4eefb29a4da4516631.jpg','MÔI TRƯỜNG VĨ MÔ.docx','Xây dựng CSDL hình ảnh hạt phấn hoa (Atlas điện tử) cho vùng nuôi ong qua ứng dụng công nghệ 4.0','Xây dựng CSDL hình ảnh hạt phấn hoa (Atlas điện tử) cho vùng nuôi ong qua ứng dụng công nghệ 4.0','MÔI TRƯỜNG VĨ MÔ.docx','2025-09-18 11:15:06','2025-09-18 11:15:06'),(3,'https://daotao.vnua.edu.vn/#/home/listbaiviet/tb/page/1/baivietct/-7427593202379359237',20,'z6160543669423_92ccadcc7bc13d4eefb29a4da4516631.jpg','MÔI TRƯỜNG VĨ MÔ.docx','Phát hiện bất thường ảnh ong với YOLO','Phát hiện bất thường ảnh ong với YOLO','MÔI TRƯỜNG VĨ MÔ.docx','2025-09-18 11:15:06','2025-09-18 11:15:06'),(4,'https://daotao.vnua.edu.vn/#/home/listbaiviet/tb/page/1/baivietct/-7427593202379359237',21,'z5448960280247_b579d3b872bb16e4dd2479847f35a158.jpg','MÔI TRƯỜNG VĨ MÔ.docx','Giới thiệu một số phương pháp phân tích dữ liệu và thống kê ứng dụng ','Giới thiệu một số phương pháp phân tích dữ liệu và thống kê ứng dụng ','24-05-27-Some studies in facial expression recognition using deep learning.pdf','2025-09-18 11:15:06','2025-09-18 11:15:06'),(5,'https://daotao.vnua.edu.vn/#/home/listbaiviet/tb/page/1/baivietct/-7427593202379359237',23,'z5861235015522_d2305d24ae8322f043ef1dacbea8bac6.jpg','MÔI TRƯỜNG VĨ MÔ.docx','Blockchain, trí tuệ nhân tạo và chuyển đổi số','Blockchain, trí tuệ nhân tạo và chuyển đổi số','MÔI TRƯỜNG VĨ MÔ.docx','2025-09-18 11:15:06','2025-09-18 11:15:06'),(6,'https://daotao.vnua.edu.vn/#/home/listbaiviet/tb/page/1/baivietct/-7427593202379359237',24,'z6160543341416_22d399697e2e6b72232dd59c3e1f5834.jpg','MÔI TRƯỜNG VĨ MÔ.docx','Blockchain, trí tuệ nhân tạo và chuyển đổi số','Blockchain, trí tuệ nhân tạo và chuyển đổi số','MÔI TRƯỜNG VĨ MÔ.docx','2025-09-18 11:15:06','2025-09-18 11:15:06'),(7,'https://daotao.vnua.edu.vn/#/home/listbaiviet/tb/page/1/baivietct/-7427593202379359237',25,'z5448960280247_b579d3b872bb16e4dd2479847f35a158.jpg','MÔI TRƯỜNG VĨ MÔ.docx','Ứng dụng mạng học sâu nhận dạng khuôn mặt cảm xúc','Ứng dụng mạng học sâu nhận dạng khuôn mặt cảm xúc','MÔI TRƯỜNG VĨ MÔ.docx','2025-09-18 11:15:06','2025-09-18 11:15:06'),(8,'https://daotao.vnua.edu.vn/#/home/listbaiviet/tb/page/1/baivietct/-7427593202379359237',56,'z6160543669423_92ccadcc7bc13d4eefb29a4da4516631.jpg','MÔI TRƯỜNG VĨ MÔ.docx','Blockchain, trí tuệ nhân tạo và chuyển đổi số','test','MÔI TRƯỜNG VĨ MÔ.docx','2025-09-18 11:15:06','2025-09-18 11:15:06');
/*!40000 ALTER TABLE `conference` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `conference_paper`
--

DROP TABLE IF EXISTS `conference_paper`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `conference_paper` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `conference_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `conference_proceedings_file` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `id_event` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=30012;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `conference_paper`
--

LOCK TABLES `conference_paper` WRITE;
/*!40000 ALTER TABLE `conference_paper` DISABLE KEYS */;
INSERT INTO `conference_paper` VALUES (1,'Nghiên cứu thiết bị iot ứng dụng trong thu thập dữ liệu về nồng độ mùi trong phòng khám thú y','MÔI TRƯỜNG VĨ MÔ.docx',4,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(2,'Một số kết quả phân tích mức độ ô nhiễm mùi tại phòng khám thú y bằng công nghệ iot','MÔI TRƯỜNG VĨ MÔ.docx',5,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(3,'Ứng dụng blockchain và công nghệ iot vào tăng độ tin cậy của ngành hàng mật ong','MÔI TRƯỜNG VĨ MÔ.docx',6,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(4,'Nghiên cứu xây dựng bộ cơ sở dữ liệu nông sản bằng phương pháp xử lý ảnh áp dụng với mẫu gạo lứt phúc thọ','MÔI TRƯỜNG VĨ MÔ.docx',30,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(6,'Ứng dụng mạng học sâu nhận dạng khuôn mặt cảm xúc','MÔI TRƯỜNG VĨ MÔ.docx',32,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(9,'Một số cơ chế đồng thuận trong mạng blockchain','MÔI TRƯỜNG VĨ MÔ.docx',33,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(10,'Một số kết quả phân tích mẫu với cảm biến khí mq ứng dụng công nghệ iot','MÔI TRƯỜNG VĨ MÔ.docx',35,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(11,'Thực trạng phát triển bền vững nông nghiệp, kinh tế nông thôn và nông dân gắn với chuyển đổi số quốc gia','MÔI TRƯỜNG VĨ MÔ.docx',36,'2025-09-18 11:15:06','2025-09-18 11:15:06');
/*!40000 ALTER TABLE `conference_paper` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `event`
--

DROP TABLE IF EXISTS `event`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `event` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `creator` int(11) DEFAULT NULL,
  `date_of_event` date DEFAULT NULL,
  `end_time` int(11) DEFAULT NULL,
  `event_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `id_operating_standard_2` int(11) DEFAULT NULL,
  `is_delete` int(11) DEFAULT NULL,
  `start_time` int(11) DEFAULT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `id_room` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `contact_email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contact_phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `event_details` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `max_participants` int(11) DEFAULT NULL,
  `registration_link` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `banner_img` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reason` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type_of_event` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */,
  KEY `FK4ythgcbb08ceed2o9dv00ij72` (`id_room`),
  KEY `FKmwr6l1352ul83ugkmni32dtyo` (`type_of_event`),
  KEY `FK23xgt6spf1fcgpjwte92r2qar` (`creator`),
  CONSTRAINT `FK4ythgcbb08ceed2o9dv00ij72` FOREIGN KEY (`id_room`) REFERENCES `nckh`.`room` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FKmwr6l1352ul83ugkmni32dtyo` FOREIGN KEY (`type_of_event`) REFERENCES `nckh`.`type_of_criteria` (`id`),
  CONSTRAINT `FK23xgt6spf1fcgpjwte92r2qar` FOREIGN KEY (`creator`) REFERENCES `nckh`.`user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=30060;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `event`
--

LOCK TABLES `event` WRITE;
/*!40000 ALTER TABLE `event` DISABLE KEYS */;
INSERT INTO `event` VALUES (1,2,'2024-09-30',10,'Sự phát triển của Web 3.0 lên 4.0 và một số ứng dụng tại Việt Nam',1,1,6,'completed',3,'2025-09-18 11:15:06','2025-09-18 11:15:06',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1),(2,2,'2024-10-18',5,'Nghiên cứu khoa học Nữ trong bối cảnh chuyển đổi số và công nghệ xanh',9,1,1,'completed',3,'2025-09-18 11:15:06','2025-09-18 11:15:06',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1),(3,2,'2024-04-11',NULL,'Phát triển ứng dụng Web hỗ trợ công tác quản lý dạy và học cấp bộ môn',15,1,NULL,'completed',1,'2025-09-18 11:15:06','2025-09-18 11:15:06',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1),(4,2,'2024-04-23',2,'Nghiên cứu khoa học nữ trong bối cảnh chuyển đổi số và công nghệ xanh',18,1,1,'completed',1,'2025-09-18 11:15:06','2025-09-18 11:15:06',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1),(5,2,'2024-05-17',5,'Blockchain, trí tuệ nhân tạo và chuyển đổi số',19,1,2,'completed',1,'2025-09-18 11:15:06','2025-09-18 11:15:06',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1),(6,2,'2024-05-16',5,'Blockchain, trí tuệ nhân tạo và chuyển đổi số',19,1,2,'completed',1,'2025-09-18 11:15:06','2025-09-18 11:15:06',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1),(7,26,'2024-04-03',5,'Phát triển ứng dụng Web hỗ trợ công tác quản lý dạy và học cấp bộ môn',28,1,4,'completed',1,'2025-09-18 11:15:06','2025-09-18 11:15:06',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1),(11,20,'2024-05-20',5,'Nghiên cứu xây dựng bộ cơ sở dữ liệu phân tích trạng thái cảm xúc khuôn mặt',1,1,2,'completed',3,'2025-09-18 11:15:06','2025-09-18 11:15:06',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1),(12,20,'2024-09-09',3,'Nghiên cứu xây dựng trạm đo đánh giá mức độ ô nhiểm bằng công nghệ iot',1,1,1,'completed',1,'2025-09-18 11:15:06','2025-09-18 11:15:06',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1),(13,23,'2024-04-08',3,'Phương pháp nghiên cứu và định hướng NC UD CNTT trong NN',1,1,1,'completed',3,'2025-09-18 11:15:06','2025-09-18 11:15:06',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1),(14,22,'2024-05-13',3,'Kỹ thuật dựng ảnh siêu âm',1,1,1,'completed',3,'2025-09-18 11:15:06','2025-09-18 11:15:06',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1),(15,26,'2024-09-30',3,'Giới thiệu giải pháp xây dựng phần mềm hỗ trợ công tác quản lý dạy và học cấp bộ môn',1,1,1,'completed',3,'2025-09-18 11:15:06','2025-09-18 11:15:06',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1),(16,19,'2024-12-24',3,'Phát hiện ong mang phấn từ hình ảnh và vấn đề mất cân bằng dữ liệu',1,1,1,'completed',3,'2025-09-18 11:15:06','2025-09-18 11:15:06',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1),(17,18,'2024-12-25',3,'It business analyst và xu hướng nghề nghiệp',1,1,1,'completed',3,'2025-09-18 11:15:06','2025-09-18 11:15:06',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1),(18,25,'2024-12-26',3,'Một giải pháp điểm danh người học tận dụng nguồn lực sẵn có ở các trường Đại học',1,1,1,'completed',3,'2025-09-18 11:15:06','2025-09-18 11:15:06',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1),(19,19,'2024-06-14',3,'Ứng dụng các công nghệ của công nghiệp 4.0 vào chuỗi ngành hàng mật ong',9,1,1,'completed',3,'2025-09-18 11:15:06','2025-09-18 11:15:06',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1),(20,19,'2024-12-05',5,'Blockchain, Trí tuệ nhân tạo và Chuyển đổi số',9,1,2,'completed',3,'2025-09-18 11:15:06','2025-09-18 11:15:06',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1),(21,22,'2024-05-12',5,'Một số nghiên cứu nhận diện khuôn mặt cảm xúc sử dụng mạng học sâu',9,1,1,'completed',3,'2025-09-18 11:15:06','2025-09-18 11:15:06',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1),(22,20,'2024-05-20',3,'Nghiên cứu xây dựng bộ cơ sở dữ liệu nông sản bằng phương pháp xử lý ảnh Áp dụng với mẫu gạo lứt Phúc Thọ',9,1,1,'completed',3,'2025-09-18 11:15:06','2025-09-18 11:15:06',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1),(23,20,'2024-05-20',10,'Nghiên cứu xây dựng bộ cơ sở dữ liệu nông sản bằng phương pháp xử lý ảnh Áp dụng với mẫu gạo lứt Phúc Thọ',9,1,6,'completed',3,'2025-09-18 11:15:06','2025-09-18 11:15:06',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1),(24,18,'2025-11-23',3,'Database Security',9,1,1,'completed',3,'2025-09-18 11:15:06','2025-09-18 11:15:06',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1),(25,22,'2024-05-01',5,'Blockchain, trí tuệ nhân tạo và chuyển đổi số',9,1,1,'completed',1,'2025-09-18 11:15:06','2025-09-18 11:15:06',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1),(26,26,'2024-04-23',NULL,'Tổng quan về điện toán đám mây và các vấn đề thách thức bâo mật',15,1,NULL,'completed',1,'2025-09-18 11:15:06','2025-09-18 11:15:06',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1),(27,19,'2024-04-23',NULL,'Improving pollen-bearing honey bee detection from videos captured at hive entrance by combining deep learning and handling imbalance techniques',10,1,NULL,'completed',1,'2025-09-18 11:15:06','2025-09-18 11:15:06',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1),(28,19,'2024-04-16',NULL,'A method for bee activities recognition from videos captured at the beehive entrance',13,1,NULL,'completed',1,'2025-09-18 11:15:06','2025-09-18 11:15:06',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1),(29,23,'2024-04-20',NULL,'A New Score Function of IFSs and its Application in the Evaluation of Software Quality',13,1,NULL,'completed',1,'2025-09-18 11:15:06','2025-09-18 11:15:06',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1),(30,20,'2024-04-04',5,'Blockchain, trí tuệ nhân tạo và chuyển đổi số',19,1,1,'completed',1,'2025-09-18 11:15:06','2025-09-18 11:15:06',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1),(32,22,'2024-01-01',5,'Blockchain, trí tuệ nhân tạo và chuyển đổi số',19,1,1,'completed',1,'2025-09-18 11:15:06','2025-09-18 11:15:06',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1),(33,26,'2024-03-03',5,'Blockchain, trí tuệ nhân tạo và chuyển đổi số',19,1,2,'completed',1,'2025-09-18 11:15:06','2025-09-18 11:15:06',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1),(35,20,'2024-03-07',5,'Blockchain, trí tuệ nhân tạo và chuyển đổi số',19,1,1,'completed',1,'2025-09-18 11:15:06','2025-09-18 11:15:06',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1),(36,24,'2024-06-06',10,'Thực trạng, quan điểm, định hướng và giải pháp phát triển bền vững nông nghiệp, kinh tế nông thôn và nông dân gắn với chuyển đổi số quốc gia, đô thị hóa và thích ứng với biến đổi khí hậu',18,1,6,'completed',1,'2025-09-18 11:15:06','2025-09-18 11:15:06',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1),(37,24,'2024-12-31',3,'Tổng quan về điện toán đám mây',20,1,1,'completed',1,'2025-09-18 11:15:06','2025-09-18 11:15:06',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1),(38,23,'2024-09-30',3,'Tổng quan về Công nghệ thông tin và truyền thông (ICT-Information Communication Technology) Phần I – Công nghệ phần cứng',20,1,1,'completed',1,'2025-09-18 11:15:06','2025-11-22 21:31:21',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1),(39,18,'2024-11-12',3,'It business analyst và xu hướng nghề nghiệp',20,1,1,'completed',3,'2025-09-18 11:15:06','2025-09-18 11:15:06',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1),(40,19,'2024-12-31',3,'Các kỹ thuật học máy và thị giác máy tính trong các ứng dụng giám sát liên tục tổ ong',20,1,1,'completed',3,'2025-09-18 11:15:06','2025-09-18 11:15:06',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1),(41,2,'2024-12-01',3,'Nghiên cứu công nghệ phát triển Web và ứng dụng phát triển Website cho Đoàn thanh niên của Khoa công nghệ thông tin - Học viện Nông nghiệp Việt Nam',29,1,1,'completed',1,'2025-09-18 11:15:06','2025-12-15 14:16:38',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1),(42,26,'2024-12-01',2,'Xây dựng diễn đàn trao đổi học tập cho sinh viên Học viện Nông nghiệp Việt Nam',29,1,1,'completed',1,'2025-09-18 11:15:06','2025-09-18 11:15:06',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1),(43,25,'2024-12-01',5,'Xây dựng ứng dụng điểm danh sinh viên, học viên bằng mã QR',28,1,1,'completed',1,'2025-09-18 11:15:06','2025-09-18 11:15:06',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1),(44,24,'2024-12-01',5,'Xây dựng website quản lý sinh viên cấp Khoa',29,1,1,'pending',1,'2025-09-18 11:15:06','2025-09-18 11:15:06',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1),(45,22,'2024-12-01',5,'Ứng dụng Deep Learning nhận diện cảm xúc khuôn mặt',29,1,1,'completed',1,'2025-09-18 11:15:06','2025-09-18 11:15:06',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1),(46,18,'2024-12-01',5,'Nghiên cứu các kỹ thuật xây dựng máy tìm kiếm - Search Engine',29,1,1,'completed',1,'2025-09-18 11:15:06','2025-09-18 11:15:06',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1),(49,2,'2024-05-12',10,'Hội đồng tư vấn khoa học',30,1,6,'completed',1,'2025-09-18 11:15:06','2025-09-18 11:15:06',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1),(50,2,'2024-12-24',10,'Tổ chức hội đồng tư vấn khoa học lần 2',30,2,6,'completed',3,'2025-09-18 11:15:06','2025-09-18 11:15:06',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1),(51,2,'2024-04-15',5,'Quy trình nhập, xử lý và trích xuất dữ liệu trên Cloud',31,1,1,'completed',3,'2025-09-18 11:15:06','2025-09-18 11:15:06',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1),(52,2,'2024-12-24',10,'Mô hình hóa xu hướng phát triển sử dụng đất/lớp phủ khu vực đô thị sử dụng dữ liệu viễn thám và các mô hình trí tuệ nhân tạo',31,1,6,'completed',1,'2025-09-18 11:15:06','2025-12-06 20:33:19',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1),(55,1,'2025-07-25',5,'test seminar presentation',1,1,1,'upcoming',1,'2025-09-18 11:15:06','2025-09-18 11:15:06',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1),(56,1,'2025-07-20',5,'test create international conferences',3,1,1,'upcoming',1,'2025-09-18 11:15:06','2025-09-18 11:15:06',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1),(57,2,'2025-07-25',NULL,'test vietnamese paper',10,1,NULL,'completed',1,'2025-09-18 11:15:06','2025-09-18 11:15:06',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1),(58,31,'2025-11-23',5,'abc',NULL,1,2,'pending',2,'2025-11-22 17:05:07','2025-12-06 20:47:19',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1),(59,31,'2025-11-24',4,'sxsax',NULL,1,4,'rejected',3,'2025-11-22 22:25:06','2025-12-06 20:59:57',NULL,NULL,NULL,NULL,NULL,NULL,'/file/event-banner-3f7a66b4-201c-4102-8ecb-bff3a9ef5576.jpg','k thích\n',1);
/*!40000 ALTER TABLE `event` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `event_registration`
--

DROP TABLE IF EXISTS `event_registration`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `event_registration` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `event_id` int(11) NOT NULL,
  `full_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `note` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `organization` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `registration_date` datetime(6) DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `event_registration`
--

LOCK TABLES `event_registration` WRITE;
/*!40000 ALTER TABLE `event_registration` DISABLE KEYS */;
/*!40000 ALTER TABLE `event_registration` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `expert_presentation`
--

DROP TABLE IF EXISTS `expert_presentation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `expert_presentation` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_event` int(11) DEFAULT NULL,
  `minutes_of_meeting` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `presentation_file` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `presenter` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `seminar_photo` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=30003;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `expert_presentation`
--

LOCK TABLES `expert_presentation` WRITE;
/*!40000 ALTER TABLE `expert_presentation` DISABLE KEYS */;
INSERT INTO `expert_presentation` VALUES (1,51,'BB Seminar Chuyên gia T4.pdf','CK Overview & Agricultural capabilities - HVNN.pptx.pdf','Mr. Mầu Hà Quang','Chuyên gia T4_1.jpg','2025-09-18 11:15:06','2025-09-18 11:15:06'),(2,52,'Chuyên gia T12_1.jpg','TLHung_Conference 2024.pptx','PGS.TS. Trịnh Lê Hùng','Chuyên gia T12_1.jpg','2025-09-18 11:15:06','2025-09-18 11:15:06');
/*!40000 ALTER TABLE `expert_presentation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `group`
--

DROP TABLE IF EXISTS `group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `group` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `group_name` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=30013;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `group`
--

LOCK TABLES `group` WRITE;
/*!40000 ALTER TABLE `group` DISABLE KEYS */;
INSERT INTO `group` VALUES (1,'nhóm 1',1,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(3,'test 19/07',1,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(12,'Nhóm nghiên cứu mạnh',1,'2025-09-18 11:15:06','2025-09-18 11:15:06');
/*!40000 ALTER TABLE `group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `guest`
--

DROP TABLE IF EXISTS `guest`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `guest` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `event_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `full_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `note` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `organization` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */,
  KEY `FKplwm15gu4q6tj4g4ox6wkf1li` (`event_id`),
  KEY `FKake2867xxr6o753o6kqc4rott` (`user_id`),
  CONSTRAINT `FKake2867xxr6o753o6kqc4rott` FOREIGN KEY (`user_id`) REFERENCES `nckh`.`user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FKplwm15gu4q6tj4g4ox6wkf1li` FOREIGN KEY (`event_id`) REFERENCES `nckh`.`event` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=30006;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `guest`
--

LOCK TABLES `guest` WRITE;
/*!40000 ALTER TABLE `guest` DISABLE KEYS */;
INSERT INTO `guest` VALUES (5,59,31,'2025-11-22 22:50:15','2025-11-22 22:50:15','ngocduongxk2003@gmail.com','Admin','','Sinh Viên','0962498015');
/*!40000 ALTER TABLE `guest` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `international_paper`
--

DROP TABLE IF EXISTS `international_paper`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `international_paper` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `article_link` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `id_event` int(11) DEFAULT NULL,
  `main_author` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=30006;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `international_paper`
--

LOCK TABLES `international_paper` WRITE;
/*!40000 ALTER TABLE `international_paper` DISABLE KEYS */;
INSERT INTO `international_paper` VALUES (1,'https://start.spring.io/',27,'Lê Thị Nhung',3,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(2,'https://start.spring.io/',28,'Lê Thị Nhung',3,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(3,'https://start.spring.io/',29,'Nguyễn Xuân Thảo',3,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(5,'https://start.spring.io/',57,'Phạm Thị Lan Anh',3,'2025-09-18 11:15:06','2025-09-18 11:15:06');
/*!40000 ALTER TABLE `international_paper` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `like_news`
--

DROP TABLE IF EXISTS `like_news`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `like_news` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_news` int(11) DEFAULT NULL,
  `id_user` int(11) DEFAULT NULL,
  `time` datetime(6) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=30010;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `like_news`
--

LOCK TABLES `like_news` WRITE;
/*!40000 ALTER TABLE `like_news` DISABLE KEYS */;
INSERT INTO `like_news` VALUES (6,1,1,'2025-06-13 23:21:27.000000','2025-09-18 11:15:06','2025-09-18 11:15:06'),(9,1,2,'2025-06-14 13:25:17.000000','2025-09-18 11:15:06','2025-09-18 11:15:06');
/*!40000 ALTER TABLE `like_news` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `member`
--

DROP TABLE IF EXISTS `member`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `member` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `event_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */,
  KEY `FK1mjk7vij3rtpg6c4k58ttj7x` (`event_id`),
  KEY `FKswb523yn1xw3806ojrfpcyadl` (`user_id`),
  CONSTRAINT `FK1mjk7vij3rtpg6c4k58ttj7x` FOREIGN KEY (`event_id`) REFERENCES `nckh`.`event` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FKswb523yn1xw3806ojrfpcyadl` FOREIGN KEY (`user_id`) REFERENCES `nckh`.`user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=30123;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `member`
--

LOCK TABLES `member` WRITE;
/*!40000 ALTER TABLE `member` DISABLE KEYS */;
INSERT INTO `member` VALUES (1,1,2,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(2,2,2,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(3,3,2,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(4,4,2,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(5,5,2,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(6,6,2,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(7,7,2,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(8,7,26,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(34,11,20,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(35,12,20,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(36,13,23,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(37,14,22,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(38,15,26,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(39,16,19,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(40,17,18,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(41,18,25,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(42,19,19,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(43,20,19,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(44,2,20,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(45,21,22,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(46,24,18,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(47,25,22,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(48,26,26,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(49,27,19,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(50,28,19,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(51,29,23,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(52,4,20,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(53,30,20,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(56,32,22,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(57,33,26,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(59,35,20,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(60,36,24,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(61,37,24,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(62,38,23,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(63,39,18,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(64,40,19,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(65,42,26,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(66,43,18,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(67,43,25,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(68,44,24,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(69,45,22,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(70,46,18,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(71,49,2,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(72,49,18,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(73,49,19,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(74,49,21,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(75,49,22,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(76,49,23,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(77,49,24,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(78,49,25,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(79,49,20,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(80,49,26,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(81,50,2,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(82,50,18,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(83,50,19,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(84,50,20,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(85,50,21,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(86,50,22,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(87,50,23,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(88,50,24,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(89,50,25,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(90,50,26,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(91,51,2,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(92,51,18,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(93,51,19,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(94,51,20,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(95,51,21,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(96,51,22,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(97,51,23,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(98,51,24,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(99,51,25,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(100,51,26,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(101,52,2,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(102,52,18,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(103,52,19,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(104,52,20,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(105,52,21,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(106,52,22,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(107,52,23,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(108,52,24,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(109,52,25,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(110,52,26,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(116,55,2,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(117,55,19,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(118,55,20,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(119,55,26,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(120,55,1,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(121,56,1,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(122,57,2,'2025-09-18 11:15:06','2025-09-18 11:15:06');
/*!40000 ALTER TABLE `member` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ministry_task`
--

DROP TABLE IF EXISTS `ministry_task`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ministry_task` (
  `task_id` int(11) NOT NULL AUTO_INCREMENT,
  `id_event` int(11) DEFAULT NULL,
  `secretary` int(11) DEFAULT NULL,
  `task_lead` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`task_id`) /*T![clustered_index] CLUSTERED */,
  UNIQUE KEY `UKphl37g9o9lh4feqlyia9s86je` (`secretary`),
  UNIQUE KEY `UK6y32pbdsju3s4x7rddqjsb4ny` (`task_lead`),
  CONSTRAINT `FKgb9c2lggb9ecua2mm4nidig51` FOREIGN KEY (`secretary`) REFERENCES `nckh`.`user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FKml6f9syift6fyu8ifcc98y91d` FOREIGN KEY (`task_lead`) REFERENCES `nckh`.`user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=30004;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ministry_task`
--

LOCK TABLES `ministry_task` WRITE;
/*!40000 ALTER TABLE `ministry_task` DISABLE KEYS */;
INSERT INTO `ministry_task` VALUES (1,7,2,26,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(3,43,18,25,'2025-09-18 11:15:06','2025-09-18 11:15:06');
/*!40000 ALTER TABLE `ministry_task` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ncm`
--

DROP TABLE IF EXISTS `ncm`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ncm` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `norm` float DEFAULT NULL,
  `role_of_activity` int(11) DEFAULT NULL,
  `role_of_team` int(11) NOT NULL,
  `status` int(11) DEFAULT NULL,
  `year` int(11) DEFAULT NULL,
  `id_group` int(11) DEFAULT NULL,
  `id_operating_standard` int(11) DEFAULT NULL,
  `id_user` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */,
  KEY `FKdq054ycp28qqq8pjhl5l2ckf5` (`id_group`),
  KEY `FK71v8vinw76ecr9n83p27rabsw` (`id_operating_standard`),
  KEY `FKgx1bofxh4qe9t9rbpy6bdcud6` (`id_user`),
  CONSTRAINT `FK71v8vinw76ecr9n83p27rabsw` FOREIGN KEY (`id_operating_standard`) REFERENCES `nckh`.`operating_standards_2` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FKdq054ycp28qqq8pjhl5l2ckf5` FOREIGN KEY (`id_group`) REFERENCES `nckh`.`group` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FKgx1bofxh4qe9t9rbpy6bdcud6` FOREIGN KEY (`id_user`) REFERENCES `nckh`.`user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=30139;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ncm`
--

LOCK TABLES `ncm` WRITE;
/*!40000 ALTER TABLE `ncm` DISABLE KEYS */;
INSERT INTO `ncm` VALUES (1,0.8,NULL,1,1,2024,1,1,24,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(4,0.8,NULL,1,1,2024,1,9,24,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(6,0.4,NULL,1,1,2024,1,11,24,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(7,0.4,NULL,1,1,2024,1,16,24,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(8,0.8,NULL,1,1,2024,1,18,24,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(21,0.8,NULL,2,1,2024,1,1,2,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(30,0.8,NULL,2,1,2024,1,9,2,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(31,0.93,NULL,2,1,2024,1,16,2,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(33,0.8,NULL,2,1,2024,1,23,2,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(34,0.8,NULL,2,1,2024,1,29,2,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(35,0.8,NULL,3,1,2024,1,1,18,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(38,0.8,NULL,3,1,2024,1,9,18,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(39,0.93,NULL,3,1,2024,1,16,18,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(40,0.53,NULL,3,1,2024,1,18,18,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(42,0.8,NULL,3,1,2024,1,29,18,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(43,0.8,NULL,3,1,2024,1,1,19,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(46,0.8,NULL,3,1,2024,1,9,19,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(47,0.93,NULL,3,1,2024,1,16,19,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(48,0.53,NULL,3,1,2024,1,18,19,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(49,0.8,NULL,3,1,2024,1,23,19,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(50,0.8,NULL,3,1,2024,1,29,19,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(51,0.8,NULL,3,1,2024,1,1,20,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(54,0.8,NULL,3,1,2024,1,9,20,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(55,0.93,NULL,3,1,2024,1,16,20,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(56,0.53,NULL,3,1,2024,1,18,20,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(57,0.8,NULL,3,1,2024,1,23,20,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(58,0.8,NULL,3,1,2024,1,29,20,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(59,0.8,NULL,3,1,2024,1,1,21,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(62,0.8,NULL,3,1,2024,1,9,21,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(63,0.93,NULL,3,1,2024,1,16,21,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(64,0.53,NULL,3,1,2024,1,18,21,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(65,0.8,NULL,3,1,2024,1,23,21,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(66,0.8,NULL,3,1,2024,1,29,21,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(67,0.8,NULL,3,1,2024,1,1,22,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(71,0.4,NULL,3,1,2024,1,16,22,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(72,1.6,NULL,3,1,2024,1,23,22,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(75,0.4,NULL,3,1,2024,1,11,22,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(76,1.6,NULL,1,1,2024,1,23,24,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(78,0.8,NULL,3,1,2024,1,18,22,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(81,0.8,NULL,3,1,2024,1,9,22,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(82,0.8,NULL,3,1,2024,1,1,23,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(85,0.8,NULL,3,1,2024,1,9,23,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(86,0.93,NULL,3,1,2024,1,16,23,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(87,0.8,NULL,3,1,2024,1,23,23,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(88,0.53,NULL,3,1,2024,1,18,23,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(89,0.8,NULL,3,1,2024,1,29,23,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(90,0.8,NULL,3,1,2024,1,1,25,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(93,0.8,NULL,3,1,2024,1,9,25,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(94,0.93,NULL,3,1,2024,1,16,25,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(95,0.53,NULL,3,1,2024,1,18,25,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(96,0.8,NULL,3,1,2024,1,23,25,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(97,0.8,NULL,3,1,2024,1,29,25,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(98,0.8,NULL,3,1,2024,1,1,26,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(101,0.8,NULL,3,1,2024,1,9,26,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(102,0.93,NULL,3,1,2024,1,16,26,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(103,0.53,NULL,3,1,2024,1,18,26,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(104,0.8,NULL,3,1,2024,1,23,26,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(105,0.8,NULL,3,1,2024,1,29,26,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(106,0.53,NULL,2,1,2024,1,18,2,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(107,0.27,1,1,1,2024,1,26,24,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(109,0.27,1,3,1,2024,1,26,22,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(124,0.8,NULL,2,1,2025,1,1,2,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(125,0.8,NULL,2,1,2025,1,9,2,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(126,0.93,NULL,2,1,2025,1,16,2,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(127,0.8,NULL,2,1,2025,1,23,2,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(128,0.8,NULL,2,1,2025,1,29,2,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(129,0.53,NULL,2,1,2025,1,18,2,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(130,0.8,NULL,1,1,2025,1,1,24,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(131,0.8,NULL,1,1,2025,1,9,24,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(132,0.4,NULL,1,1,2025,1,11,24,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(133,0.4,NULL,1,1,2025,1,16,24,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(134,0.8,NULL,1,1,2025,1,18,24,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(135,1.6,NULL,1,1,2025,1,23,24,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(136,0.27,1,1,1,2025,1,26,24,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(137,0.8,NULL,2,1,2025,3,1,2,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(138,0.8,3,2,1,2025,3,4,2,'2025-09-18 11:15:06','2025-09-18 11:15:06');
/*!40000 ALTER TABLE `ncm` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `news`
--

DROP TABLE IF EXISTS `news`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `news` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `content` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `time` datetime(6) DEFAULT NULL,
  `title` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `id_user` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */,
  KEY `FK12hpw4r0ijydvpgr76v6p4vno` (`id_user`),
  CONSTRAINT `FK12hpw4r0ijydvpgr76v6p4vno` FOREIGN KEY (`id_user`) REFERENCES `nckh`.`user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=60003;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `news`
--

LOCK TABLES `news` WRITE;
/*!40000 ALTER TABLE `news` DISABLE KEYS */;
INSERT INTO `news` VALUES (1,'<h1><strong>Ngày 13 tháng 5 năm 2024, tại phòng họp của Khoa Công nghệ Thông tin, đã diễn ra buổi làm việc hợp tác giữa Khoa và Công ty Cổ phần Xuất nhập khẩu và Thương mại BINKO GROUP.</strong></h1><p><br></p><p><br></p><ol><li data-list=\"ordered\" class=\"ql-indent-1\"><span class=\"ql-ui\" contenteditable=\"false\"></span>Buổi gặp gỡ nhằm thúc đẩy các hoạt động hợp tác trong lĩnh vực đào tạo và phát triển chương trình chứng chỉ ESG dành cho sinh viên. Mục tiêu chính của buổi làm việc là thống nhất về nội dung, phương pháp triển khai và phối hợp thực hiện chương trình đào tạo chứng chỉ ESG cho sinh viên, nhằm đáp ứng nhu cầu ngày càng tăng về nhân lực có kiến thức và kỹ năng về ESG trong bối cảnh toà<strong>n <em>cầu đang hướng tới phát triển bền vững.Về phía BINKO GROUP, có sự tham gia của ông Nguyễn Duy Bình, Chủ tịch Hội đồng quản trị của công ty. Về phía Khoa Công nghệ Thông tin, có sự tham dự của Ban lãnh đạo khoa, đại diện là TS. Phạm Quang Dũng, Phó trưởng khoa phụ trách khoa Công nghệ Thông tin. Trong buổi họp, các bên đã cùng nhau trao đổi về nội dung và phương pháp thực hiện chương trình. Đồng thời, cũng đ</em>ã giới thiệu khái quát về ESG – viết tắt của Environmental (Môi trường), Social (Xã hội) và Governance (Quản trị). Đây là bộ ba tiêu chuẩn dùn</strong>g để đo lường mức độ phát triển bền vững của doanh nghiệp và tác động của họ đến cộng đồng. (Environmental: Đánh giá cách doanh nghiệp quản lý tác động tới môi trường, như xử lý chất thải, tiêu thụ năng lượng, bảo vệ đa dạng sinh học, giảm thiểu biến đổi khí hậu; Social: Đánh giá mối quan hệ của doanh nghiệp với nhân viên, khách hàng, cộng đồng và các đối tác, dựa trên quyền lao động, an toàn, sức khỏe, quản lý chuỗi cung ứng và tác động xã hội; Governance: Đánh giá cấu trúc quản trị, quản lý rủi ro, đạo đức kinh doanh, minh bạch và trách nhiệm giải trình). Chương trình nhận thức rõ ESG ngày càng trở thành yêu cầu bắt buộc của doanh nghiệp và là yếu tố quan trọng trong tuyển dụng nhân lực tương lai. Do đó, việc trang bị kiến thức về ESG cho sinh viên không chỉ giúp nâng cao năng lực cạnh tranh mà còn góp phần phát triển bền vững cộng đồng. Trong buổi gặp mặt, phía Khoa Công nghệ Thông tin nhấn mạnh mong muốn xây dựng các chương trình đào tạo phù hợp với xu hướng toàn cầu về phát triển bền vững, đặc biệt là trong lĩnh vực công nghệ thông tin và quản trị doanh nghiệp. Các đại diện của khoa bày tỏ sự quan tâm lớn đến việc tích hợp các kiến thức ESG vào chương trình đào tạo, giúp sinh viên không chỉ nắm vững kiến thức lý thuyết mà còn có kỹ năng thực hành thực tế. Phía Binkoglobal, một trong những công ty hàng đầu về tư vấn và giải pháp ESG, chia sẻ về năng lực và kinh nghiệm trong việc triển khai các dự án ESG quốc tế, cũng như mong muốn góp phần nâng cao nhận thức và kỹ năng cho sinh viên tương lai. Công ty bày tỏ sự sẵn lòng hợp tác trong việc xây dựng nội dung, tổ chức workshop, hướng dẫn thực hành, và cung cấp case study thực tế từ doanh nghiệp. Hai bên đã thảo luận về việc phối hợp xây dựng chương trình đào tạo ESG phù hợp với sinh viên ngành Công nghệ Thông tin, đồng thời mở rộng sang các lĩnh vực liên quan như quản trị doanh nghiệp, truyền thông bền vững và phân tích dữ liệu ESG. Cũng trong buổi họp, các bên đã thảo luận và đưa ra phương án về các hoạt động chính gồm:</li></ol><p>– Phối hợp xây dựng nội dung chương trình đào tạo, đảm bảo phù hợp với xu hướng toàn cầu và yêu cầu doanh nghiệp.</p><p>– Tổ chức các buổi hội thảo, workshop thực hành, hướng dẫn sinh viên thiết kế dự án ESG thực tế.</p><p>– Cung cấp các case study doanh nghiệp để sinh viên có cơ hội phân tích, đề xuất giải pháp.</p><p>– Thực hiện các chương trình thực tập, nâng cao khả năng ứng tuyển của sinh viên sau khi tốt nghiệp. Buổi làm việc đã diễn ra trong không khí hợp tác cởi mở, thể hiện sự quyết tâm của cả hai bên trong việc thúc đẩy hoạt động đào tạo, góp phần nâng cao chất lượng nguồn nhân lực đáp ứng yêu cầu phát triển bền vững của doanh nghiệp và xã hội. Trong thời gian tới, hai bên sẽ tiến hành xây dựng kế hoạch cụ thể, triển khai các hoạt động phối hợp và tổ chức các buổi hội thảo giới thiệu chương trình đến sinh viên toàn trường. Chúng tôi tin tưởng rằng, sự hợp tác này sẽ góp phần tạo ra nhiều cơ hội học tập thực tiễn, nâng cao kỹ năng và kiến thức ESG cho sinh viên, từ đó góp phần xây dựng cộng đồng doanh nghiệp và nguồn nhân lực bền vững trong tương lai.</p>',2,'2025-12-06 11:36:47.510061','Khoa Công nghệ Thông tin làm việc với Công ty cổ phần Xuất nhập Khẩu và Thương mại BINKO GROUP để đẩy mạnh hợp tác về đào tạo về ESG cho sinh viên.',2,'2025-09-18 11:15:06','2025-12-06 11:36:48'),(2,'Căn cứ theo Kế hoạch thực hiện khóa luận tốt nghiệp học kỳ 2 năm học 2024-2025, Khoa Công nghệ thông tin thông báo lịch bảo vệ khóa luận tốt nghiệp cho những sinh viên đủ điều kiện bảo vệ như sau:\r\n\r\nThời gian: Từ 7h30′, ngày 18/07-19/07/2025.\r\n\r\nĐịa điểm: Khai mạc tại phòng 303 – Phòng hội thảo (Tầng 3 tòa  nhà Bùi Huy Đáp). Sinh viên bảo vệ ngày 18/07 bắt buộc phải dự khai mạc tại phòng 303.\r\n\r\nLưu ý:  Mỗi sinh viên bảo vệ trong khoảng 20 phút (gồm cả chạy demo chương trình).\r\n\r\nĐể chuẩn bị cho buổi bảo vệ diễn ra tốt đẹp, yêu cầu trang phục: Mặc áo sơ mi trắng, quần/chân váy tối màu, không đi dép lê.',2,'2025-07-18 15:43:02.000000','Thông báo về việc bảo vệ khóa luận tốt nghiệp – HK2-2024-2025',1,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(3,'<h1>Cải tiến AI trong Nông nghiệp Thông minh: Hướng tới Năng suất Bền vững</h1>\r\n<p>Nông nghiệp thông minh (Smart Agriculture) là một trong những lĩnh vực hưởng lợi nhiều nhất từ cuộc cách mạng công nghệ lần thứ tư. Công nghệ trí tuệ nhân tạo (AI) không chỉ là một công cụ hỗ trợ mà đã trở thành nhân tố thay đổi cuộc chơi, đặc biệt trong bối cảnh Việt Nam đang đối mặt với biến đổi khí hậu và nhu cầu tăng cường an ninh lương thực.</p>\r\n<p>Các mô hình học sâu (Deep Learning) được huấn luyện trên hàng triệu hình ảnh về cây trồng, đất đai, và côn trùng gây hại. Nhờ đó, hệ thống AI có thể theo dõi sức khỏe cây trồng theo thời gian thực, phát hiện sớm các dấu hiệu sâu bệnh hoặc thiếu dinh dưỡng chỉ bằng cách phân tích hình ảnh từ drone hoặc camera gắn trên robot nông nghiệp. Việc dự đoán chính xác này giúp nông dân giảm thiểu đáng kể việc sử dụng thuốc bảo vệ thực vật, hướng tới các tiêu chuẩn canh tác hữu cơ và bền vững hơn.</p>\r\n<p>Hơn nữa, AI kết hợp với Internet Vạn Vật (IoT) giúp tối ưu hóa việc quản lý tài nguyên. Các cảm biến thông minh thu thập dữ liệu về độ ẩm đất, nhiệt độ, và mức độ ánh sáng. AI sau đó phân tích dữ liệu này để đưa ra quyết định tưới tiêu chính xác đến từng cây, tránh lãng phí nước và năng lượng. Sự tích hợp này không chỉ nâng cao năng suất mà còn giảm thiểu chi phí vận hành, cải thiện hiệu quả kinh tế cho người nông dân Việt Nam.</p>',2,'2025-12-13 14:10:16.000000','Xu hướng AI thay đổi Nông nghiệp Việt Nam',55,'2025-12-13 14:10:16','2025-12-13 14:10:16'),(4,'<h1>Bảo mật Dữ liệu Lớn (Big Data) trong Kỷ nguyên Số: Thách thức và Giải pháp Toàn diện</h1>\r\n<p>Trong thời đại mà dữ liệu được ví như \"dầu mỏ mới\", việc thu thập và phân tích dữ liệu lớn (Big Data) là chìa khóa để ra quyết định kinh doanh. Tuy nhiên, khối lượng dữ liệu khổng lồ này cũng đặt ra những thách thức bảo mật chưa từng có. Một cuộc tấn công thành công vào hệ thống Big Data có thể gây thiệt hại hàng triệu đô la và làm sụp đổ uy tín của doanh nghiệp.</p>\r\n<p>Thách thức lớn nhất nằm ở việc đảm bảo tính bảo mật và riêng tư trong quá trình di chuyển và xử lý dữ liệu. Dữ liệu thường được lưu trữ trên các hệ thống phân tán và dịch vụ đám mây, làm tăng bề mặt tấn công. Các giải pháp bảo mật truyền thống không còn đủ sức chống chọi trước các mối đe dọa phức tạp như ransomware, tấn công từ chối dịch vụ phân tán (DDoS), và các cuộc tấn công lừa đảo tinh vi.</p>\r\n<p>Để đối phó, các doanh nghiệp đang chuyển sang các chiến lược bảo mật Zero Trust (Không Tin Tưởng), đồng thời áp dụng các công nghệ mã hóa dữ liệu tiên tiến, ngay cả khi dữ liệu đang được sử dụng (Homomorphic Encryption). Việc thiết lập các quy trình Quản trị Dữ liệu (Data Governance) nghiêm ngặt và tuân thủ các quy định quốc tế như GDPR là điều kiện bắt buộc để duy trì lòng tin của khách hàng và tính hợp pháp của hoạt động kinh doanh.</p>',2,'2025-12-13 14:10:16.000000','Tầm quan trọng của Bảo mật Dữ liệu Lớn',78,'2025-12-13 14:10:16','2025-12-13 14:10:16'),(5,'<h1>Blockchain và Tiềm năng Cách mạng hóa Quản lý Chuỗi Cung Ứng Toàn cầu</h1>\r\n<p>Công nghệ Blockchain, nổi tiếng với vai trò nền tảng của tiền điện tử, đang dần khẳng định giá trị thực tiễn trong việc giải quyết các vấn đề nan giải của chuỗi cung ứng: thiếu minh bạch và truy xuất nguồn gốc kém.</p>\r\n<p>Trong một chuỗi cung ứng truyền thống, thông tin thường bị phân tán, lưu trữ trong các hệ thống riêng biệt, dễ bị thao túng hoặc làm giả. Blockchain thay đổi điều này bằng cách tạo ra một sổ cái phân tán, bất biến, ghi lại mọi giao dịch và mọi bước đi của sản phẩm, từ khâu nguyên liệu thô đến tay người tiêu dùng cuối cùng. Mỗi điểm chạm, từ nhà sản xuất, vận chuyển, kho bãi đến bán lẻ, đều được ghi lại dưới dạng một khối (block) được mã hóa.</p>\r\n<p>Lợi ích lớn nhất là khả năng truy xuất nguồn gốc tức thì và đáng tin cậy. Người tiêu dùng chỉ cần quét mã QR để biết chính xác sản phẩm mình mua được sản xuất ở đâu, khi nào, và đã đi qua những khâu nào. Điều này đặc biệt quan trọng đối với ngành thực phẩm, dược phẩm, giúp chống hàng giả, đảm bảo chất lượng và xây dựng lòng tin tuyệt đối cho thương hiệu.</p>',2,'2025-12-13 14:10:16.000000','Minh bạch hóa Chuỗi Cung Ứng bằng Blockchain',62,'2025-12-13 14:10:16','2025-12-13 14:10:16'),(6,'<h1>Điện toán Đám mây Lai (Hybrid Cloud): Kiến trúc Tối ưu cho Doanh nghiệp Hiện đại</h1>\r\n<p>Việc lựa chọn giữa đám mây công cộng (Public Cloud) và đám mây riêng (Private Cloud) luôn là một bài toán khó. Hybrid Cloud (Đám mây Lai) ra đời như một giải pháp dung hòa, kết hợp ưu điểm của cả hai mô hình để tạo ra một kiến trúc IT linh hoạt và mạnh mẽ nhất.</p>\r\n<p>Hybrid Cloud cho phép doanh nghiệp giữ lại các ứng dụng và dữ liệu nhạy cảm trên đám mây riêng hoặc trung tâm dữ liệu tại chỗ (On-premises), đáp ứng các yêu cầu bảo mật và tuân thủ quy định. Đồng thời, họ có thể sử dụng đám mây công cộng cho các tác vụ đòi hỏi khả năng mở rộng nhanh chóng, như phát triển/kiểm thử, xử lý tải cao điểm, hoặc các dịch vụ AI/Machine Learning.</p>\r\n<p>Sự linh hoạt này mang lại hiệu quả chi phí vượt trội: doanh nghiệp chỉ trả tiền cho tài nguyên đám mây công cộng khi cần thiết. Tuy nhiên, việc quản lý môi trường Hybrid đòi hỏi các công cụ quản lý đồng nhất (Single Pane of Glass) và đội ngũ IT có kiến thức chuyên sâu để đảm bảo sự di chuyển dữ liệu giữa các môi trường diễn ra trơn tru và an toàn.</p>',2,'2025-12-13 14:10:16.000000','Ưu điểm của Kiến trúc Hybrid Cloud',85,'2025-12-13 14:10:16','2025-12-13 14:10:16'),(7,'<h1>Tương lai của Thực tế Ảo (VR) và Thực tế Tăng cường (AR): Từ Giải trí đến Công nghiệp</h1>\r\n<p>Thực tế Ảo (VR) và Thực tế Tăng cường (AR) đã vượt qua ranh giới giải trí để trở thành công cụ đắc lực trong nhiều ngành công nghiệp. Các ứng dụng của chúng đang định hình lại cách chúng ta làm việc, học tập và tương tác với thế giới vật lý.</p>\r\n<p>Trong lĩnh vực giáo dục và y tế, VR cung cấp các môi trường mô phỏng an toàn, chi phí thấp, cho phép sinh viên y khoa thực hành phẫu thuật hoặc kỹ sư lắp ráp các thiết bị phức tạp mà không gặp rủi ro. Công nghệ AR, thông qua các thiết bị đeo hoặc điện thoại thông minh, giúp công nhân nhà máy nhận được hướng dẫn lắp ráp trực quan ngay trên vật thể thực, tăng hiệu suất và giảm lỗi.</p>\r\n<p>Tương lai của hai công nghệ này nằm ở sự hội tụ và tích hợp sâu hơn vào cuộc sống hàng ngày, đặc biệt là thông qua khái niệm Metaverse. Các công ty đang đầu tư vào việc phát triển kính thông minh nhẹ hơn, mạnh mẽ hơn, biến AR/VR thành một phần không thể thiếu của môi trường làm việc kỹ thuật số.</p>',2,'2025-12-13 14:10:16.000000','Ứng dụng VR/AR trong Giáo dục và Công nghiệp',44,'2025-12-13 14:10:16','2025-12-13 14:10:16'),(8,'<h1>Phát triển Phần mềm Low-Code/No-Code: Dân chủ hóa Công nghệ</h1>\r\n<p>Sự bùng nổ của các nền tảng Low-Code (ít mã) và No-Code (không mã) đang là một trong những xu hướng công nghệ lớn nhất. Chúng cho phép người dùng không chuyên về lập trình (Citizen Developers) nhanh chóng xây dựng các ứng dụng nghiệp vụ phức tạp thông qua giao diện kéo-thả và mô hình trực quan.</p>\r\n<p>Lợi ích chính là tốc độ. Thay vì mất hàng tháng để đội ngũ IT phát triển một ứng dụng theo yêu cầu, nền tảng Low-Code/No-Code có thể giúp triển khai trong vài tuần hoặc thậm chí vài ngày. Điều này giúp các phòng ban phi-IT có thể tự giải quyết các vấn đề nghiệp vụ của mình, giảm thiểu gánh nặng cho đội ngũ phát triển cốt lõi và cho phép họ tập trung vào các dự án chiến lược quan trọng hơn.</p>\r\n<p>Mặc dù No-Code thường được sử dụng cho các ứng dụng đơn giản, Low-Code cung cấp sự linh hoạt để tích hợp với các hệ thống backend phức tạp và cho phép lập trình viên chèn các đoạn mã tùy chỉnh khi cần thiết. Đây là một bước tiến quan trọng trong việc tăng tốc quá trình chuyển đổi số của các doanh nghiệp vừa và nhỏ.</p>',2,'2025-12-13 14:10:16.000000','Low-Code: Tăng tốc Chuyển đổi Số',67,'2025-12-13 14:10:16','2025-12-13 14:10:16'),(9,'<h1>Quantum Computing: Bước nhảy vọt Khám phá Giới hạn Công nghệ</h1>\r\n<p>Máy tính lượng tử (Quantum Computing) không phải là một phiên bản nhanh hơn của máy tính cổ điển, mà là một mô hình tính toán hoàn toàn mới dựa trên các nguyên lý cơ học lượng tử (quantum mechanics). Trong khi máy tính cổ điển sử dụng bit (0 hoặc 1), máy tính lượng tử sử dụng qubit, có thể tồn tại ở trạng thái 0, 1 hoặc cả hai (superposition) cùng một lúc.</p>\r\n<p>Sức mạnh tính toán phi thường này cho phép máy tính lượng tử giải quyết các bài toán hiện đang được coi là bất khả thi, như mô phỏng phân tử phức tạp để phát triển vật liệu và thuốc mới, tối ưu hóa các tuyến đường vận chuyển phức tạp, hoặc phá vỡ các thuật toán mã hóa hiện tại. Điều này đòi hỏi các nhà khoa học phải khẩn trương phát triển các giải pháp mã hóa hậu lượng tử (post-quantum cryptography).</p>\r\n<p>Mặc dù công nghệ vẫn còn ở giai đoạn nghiên cứu và phát triển sơ khai, các tập đoàn công nghệ lớn và chính phủ đang đổ hàng tỷ đô la vào nghiên cứu Quantum Computing, coi đây là công nghệ then chốt định hình tương lai khoa học và an ninh toàn cầu.</p>',2,'2025-12-13 14:10:16.000000','Quantum Computing: Khám phá Giới hạn Công nghệ',71,'2025-12-13 14:10:16','2025-12-13 14:10:16'),(10,'<h1>IoT trong Quản lý Đô thị Thông minh: Xây dựng Thành phố Kết nối</h1>\r\n<p>Internet of Things (IoT) là nền tảng cốt lõi biến các thành phố truyền thống thành đô thị thông minh (Smart Cities). Bằng cách nhúng hàng triệu cảm biến và thiết bị kết nối vào cơ sở hạ tầng vật lý, IoT tạo ra một mạng lưới dữ liệu khổng lồ, cho phép chính quyền thành phố hiểu và quản lý môi trường đô thị theo thời gian thực.</p>\r\n<p>Các ứng dụng tiêu biểu bao gồm: Hệ thống quản lý giao thông thông minh sử dụng cảm biến để điều chỉnh đèn giao thông theo mật độ xe cộ, giảm ùn tắc; hệ thống quản lý rác thải thông minh báo hiệu khi thùng rác đầy, tối ưu hóa tuyến đường thu gom; và lưới điện thông minh giúp phân phối điện hiệu quả hơn và phản ứng nhanh chóng với sự cố.</p>\r\n<p>Việc thu thập và phân tích lượng dữ liệu lớn này cho phép chính quyền thành phố đưa ra các quyết định dựa trên bằng chứng, cải thiện chất lượng dịch vụ công, giảm thiểu ô nhiễm và nâng cao chất lượng sống chung của cư dân. Tuy nhiên, thách thức về bảo mật và quyền riêng tư dữ liệu cần được giải quyết thỏa đáng.</p>',2,'2025-12-13 14:10:16.000000','IoT và Giải pháp Quản lý Đô thị',48,'2025-12-13 14:10:16','2025-12-13 14:10:16'),(11,'<h1>Mạng 6G: Tương lai của Kết nối Di động và Hội tụ Công nghệ</h1>\r\n<p>Trong khi mạng 5G đang tiếp tục được triển khai, thế giới công nghệ đã hướng sự chú ý đến mạng 6G, thế hệ mạng di động tiếp theo. 6G không chỉ là một bước tiến về tốc độ mà còn là sự hội tụ sâu sắc của nhiều công nghệ đột phá khác.</p>\r\n<p>Dự kiến, 6G sẽ đạt tốc độ truyền tải Terabit/giây, độ trễ gần như bằng không, vượt xa khả năng của 5G. Điều này sẽ mở đường cho các ứng dụng siêu thực tế (holographic communication), Internet of Senses, và việc tích hợp AI vào mọi điểm của mạng lưới. Mạng 6G cũng sẽ sử dụng các tần số cao hơn (Terahertz), yêu cầu cơ sở hạ tầng mạng dày đặc hơn, tận dụng các vệ tinh quỹ đạo thấp (LEO) để đảm bảo phủ sóng toàn cầu.</p>\r\n<p>Mục tiêu của 6G là tạo ra một \"mạng lưới thông minh\" có khả năng tự cấu hình, tự tối ưu hóa, và có thể kết nối vật lý với kỹ thuật số một cách liền mạch, hỗ trợ cho các hệ thống xe tự lái hoàn toàn, phẫu thuật từ xa và môi trường làm việc Metaverse.</p>',2,'2025-12-13 14:10:16.000000','Từ 5G đến 6G: Tốc độ Kết nối Vô song',90,'2025-12-13 14:10:16','2025-12-13 14:10:16'),(12,'<h1>Sự trỗi dậy của Ngành Công nghiệp Chip Bán dẫn tại Việt Nam</h1>\r\n<p>Ngành công nghiệp bán dẫn toàn cầu đang chứng kiến sự chuyển dịch mạnh mẽ về chuỗi cung ứng, và Việt Nam đang nổi lên như một điểm đến tiềm năng. Với lợi thế về chính sách ưu đãi, vị trí địa lý và nguồn nhân lực trẻ, Việt Nam đặt mục tiêu trở thành một mắt xích quan trọng trong chuỗi giá trị chip bán dẫn toàn cầu.</p>\r\n<p>Chính phủ Việt Nam đã và đang đưa ra các chính sách thu hút đầu tư nước ngoài vào lĩnh vực này, đồng thời tập trung vào việc đào tạo kỹ sư chuyên ngành. Các công ty đa quốc gia lớn như Intel, Samsung đã có mặt, tập trung vào các khâu đóng gói, kiểm thử và lắp ráp. Tuy nhiên, thách thức lớn nhất là chuyển từ khâu sản xuất cơ bản sang khâu thiết kế chip (IC Design) đòi hỏi trình độ công nghệ và kinh nghiệm cao hơn.</p>\r\n<p>Việc làm chủ được công nghệ thiết kế chip không chỉ giúp Việt Nam nâng cao vị thế trong chuỗi cung ứng mà còn tạo ra giá trị gia tăng khổng lồ cho nền kinh tế số quốc gia, đảm bảo an ninh công nghệ trong dài hạn.</p>',2,'2025-12-13 14:10:16.000000','Việt Nam trên Bản đồ Công nghiệp Chip',51,'2025-12-13 14:10:16','2025-12-13 14:10:16'),(13,'<h1>Học Máy (Machine Learning) trong Phát hiện Gian lận: Cuộc chiến chống Tội phạm Tài chính</h1>\r\n<p>Gian lận tài chính là một mối đe dọa không ngừng, gây thiệt hại hàng tỷ đô la mỗi năm cho các ngân hàng, tổ chức tín dụng và người tiêu dùng. Các hệ thống phát hiện gian lận truyền thống dựa trên luật lệ cố định (rule-based) đang tỏ ra kém hiệu quả trước các chiến thuật lừa đảo ngày càng tinh vi.</p>\r\n<p>Machine Learning (ML) đã cung cấp một giải pháp hiệu quả hơn. Các thuật toán ML, đặc biệt là Học Không Giám sát (Unsupervised Learning) và Học Tăng cường (Reinforcement Learning), được huấn luyện để phân tích hàng triệu giao dịch, tìm ra các mẫu hành vi bất thường và dự đoán xác suất gian lận. Hệ thống có thể tự học và thích ứng với các hình thức gian lận mới mà không cần lập trình lại luật lệ.</p>\r\n<p>Ứng dụng của ML không chỉ giới hạn trong việc phát hiện gian lận thẻ tín dụng mà còn mở rộng sang bảo hiểm, rửa tiền (AML), và an ninh mạng. Điều này giúp các tổ chức tài chính không chỉ giảm thiểu tổn thất mà còn cải thiện trải nghiệm khách hàng bằng cách giảm thiểu các trường hợp từ chối giao dịch hợp lệ (false positives).</p>',2,'2025-12-13 14:10:16.000000','Machine Learning Chống Gian lận Tài chính',74,'2025-12-13 14:10:16','2025-12-13 14:10:16'),(14,'<h1>Robot Cộng tác (Cobot): Sự kết hợp hoàn hảo giữa Người và Máy trong Sản xuất</h1>\r\n<p>Sự ra đời của robot cộng tác (Cobot) đánh dấu một sự thay đổi lớn trong tự động hóa công nghiệp. Khác với các robot công nghiệp truyền thống được đặt trong lồng bảo vệ, Cobot được thiết kế để làm việc an toàn, trực tiếp bên cạnh con người trên cùng một không gian làm việc.</p>\r\n<p>Cobot sử dụng các cảm biến nhạy bén và phần mềm điều khiển tiên tiến để đảm bảo rằng chúng sẽ dừng hoạt động ngay lập tức khi tiếp xúc với người. Điều này cho phép chúng thực hiện các nhiệm vụ lặp đi lặp lại, nhàm chán hoặc nặng nhọc (như lắp ráp, đóng gói, kiểm tra chất lượng), giải phóng con người tập trung vào các công việc đòi hỏi sự linh hoạt, sáng tạo và ra quyết định phức tạp hơn.</p>\r\n<p>Việc triển khai Cobot dễ dàng và chi phí thấp hơn so với robot công nghiệp cỡ lớn, làm cho chúng trở thành lựa chọn lý tưởng cho các doanh nghiệp vừa và nhỏ muốn bắt đầu hành trình tự động hóa. Cobot đang giúp tăng năng suất, giảm thiểu chấn thương lao động và cải thiện tính linh hoạt trong dây chuyền sản xuất hiện đại.</p>',2,'2025-12-13 14:10:16.000000','Cobot: Tương lai của Dây chuyền Sản xuất',60,'2025-12-13 14:10:16','2025-12-13 14:10:16'),(15,'<h1>Thiết kế UI/UX theo Xu hướng Tối giản (Minimalism) và Trải nghiệm Người dùng</h1>\r\n<p>Trong thế giới số bão hòa thông tin, thiết kế giao diện người dùng (UI) và trải nghiệm người dùng (UX) theo phong cách tối giản (Minimalism) đang trở thành một triết lý thiết kế được ưa chuộng. Mục tiêu là loại bỏ mọi yếu tố gây nhiễu, tập trung vào nội dung cốt lõi và hành động mong muốn của người dùng.</p>\r\n<p>Thiết kế tối giản không chỉ là về mặt thẩm mỹ. Nó cải thiện hiệu suất nhận thức của người dùng bằng cách giảm tải nhận thức (cognitive load), giúp họ dễ dàng tìm thấy thông tin và hoàn thành mục tiêu. Các nguyên tắc bao gồm: sử dụng không gian trắng (white space) hiệu quả, hạn chế bảng màu, và ưu tiên hình ảnh/biểu tượng hơn văn bản.</p>\r\n<p>Một UI/UX tối giản tốt là một UI/UX thông minh. Nó yêu cầu nhà thiết kế phải hiểu rõ nhu cầu của người dùng để quyết định những gì cần giữ lại và những gì cần loại bỏ. Khi được thực hiện đúng, nó mang lại một trải nghiệm mượt mà, trực quan, làm tăng sự hài lòng và giảm tỷ lệ thoát khỏi ứng dụng hoặc trang web.</p>',2,'2025-12-13 14:10:16.000000','Thiết kế UI/UX Tối giản và Hiệu quả',81,'2025-12-13 14:10:16','2025-12-13 14:10:16'),(16,'<h1>DevOps và CI/CD: Tăng tốc Chu trình Phát hành Phần mềm</h1>\r\n<p>DevOps là một tập hợp các thực hành nhằm tự động hóa và tích hợp các quy trình giữa đội ngũ phát triển phần mềm (Dev) và đội ngũ vận hành IT (Ops). Mục tiêu cốt lõi là rút ngắn chu trình phát triển hệ thống và cung cấp các tính năng mới một cách nhanh chóng, liên tục và đáng tin cậy.</p>\r\n<p>Yếu tố trung tâm của DevOps là Quy trình Tích hợp và Triển khai Liên tục (CI/CD). CI (Continuous Integration) yêu cầu các nhà phát triển hợp nhất mã của họ vào kho lưu trữ chung nhiều lần mỗi ngày, sau đó chạy tự động các bài kiểm thử. CD (Continuous Delivery/Deployment) tự động hóa việc đưa mã đã kiểm thử thành công vào môi trường staging hoặc sản xuất.</p>\r\n<p>Việc áp dụng CI/CD giúp giảm thiểu lỗi do xung đột mã, tăng tần suất triển khai (có thể từ hàng tháng xuống hàng giờ), và cải thiện chất lượng sản phẩm cuối cùng. Nó cũng tạo ra văn hóa hợp tác, nơi Dev và Ops cùng chia sẻ trách nhiệm và mục tiêu chung.</p>',2,'2025-12-13 14:10:16.000000','Tầm quan trọng của DevOps và CI/CD',47,'2025-12-13 14:10:16','2025-12-13 14:10:16'),(17,'<h1>Công nghệ Sinh trắc học: Giải pháp An ninh Cá nhân Mạnh mẽ</h1>\r\n<p>Trong bối cảnh mật khẩu truyền thống ngày càng dễ bị đánh cắp hoặc quên, công nghệ sinh trắc học (Biometrics) đã trở thành nền tảng cho các giải pháp xác thực và an ninh cá nhân hiện đại. Sinh trắc học sử dụng các đặc điểm sinh học độc nhất của cá nhân (vân tay, khuôn mặt, mống mắt, giọng nói) để xác minh danh tính.</p>\r\n<p>Hệ thống nhận dạng khuôn mặt và vân tay đã được tích hợp rộng rãi vào điện thoại thông minh, máy tính xách tay và các hệ thống kiểm soát truy cập vật lý. Các hệ thống này cung cấp một lớp bảo vệ mạnh mẽ hơn nhiều so với mã PIN hoặc mật khẩu, vì đặc điểm sinh trắc học rất khó để sao chép hoặc giả mạo.</p>\r\n<p>Mặc dù sinh trắc học mang lại sự tiện lợi và bảo mật vượt trội, nó cũng đặt ra các vấn đề về quyền riêng tư và bảo mật dữ liệu sinh trắc học. Việc lưu trữ và xử lý các mẫu sinh trắc học đòi hỏi công nghệ mã hóa tiên tiến và tuân thủ các quy định bảo vệ dữ liệu nghiêm ngặt.</p>',2,'2025-12-13 14:10:16.000000','Sinh trắc học: Lớp Bảo vệ Tiếp theo',64,'2025-12-13 14:10:16','2025-12-13 14:10:16'),(18,'<h1>Thách thức của Data Governance: Đảm bảo Tính toàn vẹn và Tuân thủ Dữ liệu</h1>\r\n<p>Quản trị Dữ liệu (Data Governance) là một khuôn khổ bao gồm các quy tắc, chính sách, và quy trình nhằm đảm bảo rằng dữ liệu được quản lý như một tài sản chiến lược. Nó bao gồm việc xác định ai có thể thực hiện hành động nào đối với dữ liệu, khi nào và theo phương pháp nào.</p>\r\n<p>Thách thức lớn nhất đối với Data Governance là sự phân tán của dữ liệu trên nhiều hệ thống và môi trường khác nhau (On-premise, Cloud, Edge). Việc duy trì tính nhất quán, chất lượng và tuân thủ pháp luật (như GDPR, CCPA) xuyên suốt các môi trường này là một nhiệm vụ phức tạp.</p>\r\n<p>Một Data Governance tốt giúp tổ chức: 1) Nâng cao chất lượng dữ liệu để đưa ra các quyết định chính xác hơn; 2) Giảm thiểu rủi ro pháp lý và an ninh; và 3) Tăng cường lòng tin của khách hàng. Nó không chỉ là trách nhiệm của phòng IT mà là một nỗ lực chung của toàn bộ doanh nghiệp, với sự hỗ trợ từ cấp lãnh đạo cao nhất.</p>',2,'2025-12-13 14:10:16.000000','Data Governance: Đảm bảo Chất lượng Dữ liệu',73,'2025-12-13 14:10:16','2025-12-13 14:10:16'),(19,'<h1>Edge Computing: Xử lý Dữ liệu tại Biên Mạng và Ứng dụng Thời gian Thực</h1>\r\n<p>Edge Computing (Điện toán biên) là một mô hình phân tán, đưa khả năng tính toán và lưu trữ dữ liệu đến gần nguồn tạo ra dữ liệu nhất—tức là \"biên\" của mạng lưới, thay vì gửi tất cả dữ liệu về trung tâm dữ liệu đám mây (Cloud).</p>\r\n<p>Mục tiêu chính là giảm độ trễ (latency). Trong các ứng dụng quan trọng về thời gian thực như xe tự lái, phẫu thuật robot, hoặc giám sát nhà máy thông minh, độ trễ vài mili giây cũng có thể tạo ra sự khác biệt lớn. Xử lý dữ liệu ngay tại Edge cho phép phản hồi tức thì.</p>\r\n<p>Edge Computing hoạt động song song với Cloud Computing. Dữ liệu nhạy cảm hoặc cần phản hồi nhanh được xử lý tại biên, trong khi dữ liệu tổng hợp hoặc dữ liệu cần phân tích chuyên sâu (ví dụ: huấn luyện mô hình AI) được gửi về đám mây. Sự kết hợp này tạo ra một kiến trúc điện toán phân tán, mạnh mẽ, đáp ứng nhu cầu của IoT quy mô lớn.</p>',2,'2025-12-13 14:10:16.000000','Edge Computing: Giảm Độ trễ cho IoT',88,'2025-12-13 14:10:16','2025-12-13 14:10:16'),(20,'<h1>Vai trò của Python trong Phân tích Dữ liệu và Khoa học Dữ liệu Hiện đại</h1>\r\n<p>Python tiếp tục giữ vững vị thế là ngôn ngữ lập trình số một cho Khoa học Dữ liệu (Data Science) và Học Máy (Machine Learning). Sự phổ biến này không phải ngẫu nhiên mà đến từ sự kết hợp giữa cú pháp đơn giản, dễ học và một hệ sinh thái thư viện khổng lồ.</p>\r\n<p>Các thư viện như NumPy, Pandas cung cấp các công cụ mạnh mẽ để thao tác và làm sạch dữ liệu. Matplotlib và Seaborn giúp trực quan hóa dữ liệu một cách hiệu quả. Quan trọng nhất, Scikit-learn, TensorFlow, và PyTorch là những nền tảng chính để xây dựng và huấn luyện các mô hình Machine Learning và Deep Learning tiên tiến.</p>\r\n<p>Sự linh hoạt của Python cho phép các nhà khoa học dữ liệu nhanh chóng chuyển từ giai đoạn khám phá dữ liệu sang phát triển mô hình và cuối cùng là triển khai chúng vào môi trường sản xuất. Cộng đồng lớn mạnh và sự hỗ trợ liên tục cũng là yếu tố then chốt đảm bảo vị thế của Python trong tương lai của AI và Phân tích Dữ liệu.</p>',2,'2025-12-13 14:10:16.000000','Python và Sức mạnh Phân tích Dữ liệu',53,'2025-12-13 14:10:16','2025-12-13 14:10:16'),(21,'<h1>Microservices: Xây dựng Ứng dụng Linh hoạt và Có khả năng Mở rộng</h1>\r\n<p>Kiến trúc Microservices là một phương pháp phát triển phần mềm, trong đó một ứng dụng lớn được chia thành một tập hợp các dịch vụ nhỏ, độc lập, có thể triển khai và quản lý riêng biệt. Mỗi dịch vụ chạy quy trình riêng của mình và giao tiếp với các dịch vụ khác thông qua các giao thức nhẹ như API REST hoặc gRPC.</p>\r\n<p>Ưu điểm chính là khả năng mở rộng. Thay vì phải nâng cấp toàn bộ ứng dụng (monolith) khi một tính năng gặp sự cố hoặc cần tăng tải, các nhà phát triển chỉ cần mở rộng dịch vụ cụ thể đó. Điều này giúp giảm thiểu rủi ro, vì lỗi trong một microservice không ảnh hưởng đến toàn bộ hệ thống.</p>\r\n<p>Microservices cũng cho phép các đội nhóm sử dụng các ngôn ngữ lập trình và cơ sở dữ liệu khác nhau cho từng dịch vụ (polyglot persistence), cho phép họ lựa chọn công cụ tốt nhất cho từng nhiệm vụ cụ thể, từ đó tăng tốc độ phát triển và đổi mới.</p>',2,'2025-12-13 14:10:16.000000','Microservices: Giải pháp cho Ứng dụng Quy mô lớn',76,'2025-12-13 14:10:16','2025-12-13 14:10:16'),(22,'<h1>Công nghệ In 3D: Đổi mới Chuỗi Cung Ứng và Sản xuất Cá nhân hóa</h1>\r\n<p>Công nghệ In 3D (Additive Manufacturing) đang tạo ra một cuộc cách mạng trong lĩnh vực sản xuất. Khác với phương pháp sản xuất trừ (subtractive manufacturing), In 3D xây dựng đối tượng bằng cách thêm vật liệu từng lớp, giảm thiểu lãng phí và cho phép tạo ra các hình dạng phức tạp gần như không giới hạn.</p>\r\n<p>Ban đầu được sử dụng chủ yếu cho việc tạo mẫu nhanh (prototyping), In 3D giờ đây đã được áp dụng trong sản xuất hàng loạt các bộ phận tùy chỉnh, đặc biệt trong ngành hàng không vũ trụ, ô tô và y tế. Trong y tế, In 3D cho phép tạo ra các bộ phận giả, cấy ghép y tế hoặc mô hình giải phẫu chính xác theo nhu cầu riêng của từng bệnh nhân.</p>\r\n<p>Hơn nữa, In 3D có khả năng thay đổi hoàn toàn chuỗi cung ứng bằng cách cho phép sản xuất theo yêu cầu (on-demand manufacturing) và giảm nhu cầu vận chuyển hàng tồn kho lớn, từ đó giảm chi phí và dấu chân carbon.</p>',2,'2025-12-13 14:10:16.000000','In 3D: Sản xuất Tùy chỉnh Chi phí thấp',63,'2025-12-13 14:10:16','2025-12-13 14:10:16'),(23,'<h1>Đổi mới trong Công nghệ Pin Lithium-ion: Chìa khóa cho Tương lai Điện hóa</h1>\r\n<p>Pin Lithium-ion là trái tim của cuộc cách mạng xe điện (EV) và là yếu tố then chốt thúc đẩy sự phát triển của năng lượng tái tạo. Tuy nhiên, để đáp ứng nhu cầu về phạm vi di chuyển dài hơn, thời gian sạc nhanh hơn và chi phí thấp hơn, công nghệ pin cần phải liên tục đổi mới.</p>\r\n<p>Nghiên cứu hiện tại đang tập trung vào việc tăng mật độ năng lượng (Energy Density) của pin thông qua việc thay thế vật liệu cathode và anode, ví dụ như chuyển sang pin thể rắn (Solid-State Batteries). Pin thể rắn hứa hẹn an toàn hơn, sạc nhanh hơn và cung cấp mật độ năng lượng cao hơn đáng kể so với pin lỏng truyền thống.</p>\r\n<p>Ngoài ra, việc cải tiến hệ thống quản lý pin (BMS) bằng AI giúp tối ưu hóa hiệu suất, kéo dài tuổi thọ pin và đảm bảo an toàn. Những tiến bộ này là yếu tố quyết định để xe điện trở nên phổ biến và cạnh tranh hơn so với xe sử dụng động cơ đốt trong.</p>',2,'2025-12-13 14:10:16.000000','Công nghệ Pin cho Xe điện và Thiết bị Di động',83,'2025-12-13 14:10:16','2025-12-13 14:10:16'),(24,'<h1>Quản lý Dự án Agile và Khung Scrum: Tăng cường Thích ứng trong Phát triển Phần mềm</h1>\r\n<p>Trong môi trường kinh doanh thay đổi nhanh chóng, các phương pháp quản lý dự án truyền thống (Waterfall) đã không còn phù hợp. Phương pháp Agile, đặc biệt là khung Scrum, đã trở thành tiêu chuẩn vàng trong ngành phát triển phần mềm.</p>\r\n<p>Agile tập trung vào việc cung cấp giá trị cho khách hàng thông qua các vòng lặp phát triển ngắn (iterations), phản hồi liên tục, và khả năng thích ứng với các yêu cầu thay đổi. Scrum là khung công việc phổ biến nhất của Agile, định nghĩa các vai trò (Product Owner, Scrum Master, Development Team), các sự kiện (Sprint Planning, Daily Scrum, Sprint Review) và các sản phẩm tạo tác (Product Backlog, Sprint Backlog).</p>\r\n<p>Áp dụng Scrum không chỉ giúp tăng tốc độ phát triển mà còn cải thiện đáng kể sự hợp tác trong đội nhóm và sự minh bạch với khách hàng. Nó cho phép sản phẩm được cải tiến liên tục dựa trên phản hồi thực tế thay vì dựa trên các kế hoạch cố định ban đầu.</p>',2,'2025-12-13 14:10:16.000000','Agile và Scrum trong Quản lý Dự án IT',46,'2025-12-13 14:10:16','2025-12-13 14:10:16'),(25,'<h1>Công nghệ LiDAR trong Xe Tự lái: Hỗ trợ Nhận thức Môi trường Chính xác</h1>\r\n<p>LiDAR (Light Detection and Ranging) là một công nghệ cảm biến then chốt, đóng vai trò như \"mắt\" của các hệ thống xe tự lái (Autonomous Vehicles). LiDAR phát ra hàng triệu xung laser mỗi giây và đo thời gian các xung này quay trở lại sau khi va chạm với vật thể, từ đó tạo ra bản đồ 3D cực kỳ chi tiết về môi trường xung quanh.</p>\r\n<p>Sự chính xác của dữ liệu 3D mà LiDAR cung cấp là vô giá đối với việc nhận thức môi trường (Environmental Perception) của xe, giúp phân biệt người đi bộ, xe cộ, và các chướng ngại vật nhỏ ngay cả trong điều kiện ánh sáng yếu hoặc ban đêm. Dữ liệu này sau đó được kết hợp với camera và radar để tạo ra một bức tranh hoàn chỉnh về thế giới bên ngoài.</p>\r\n<p>Mặc dù LiDAR có chi phí cao, các nhà sản xuất đang nỗ lực giảm kích thước và giá thành của cảm biến trạng thái rắn (Solid-State LiDAR) để thúc đẩy việc thương mại hóa xe tự lái ở Cấp độ 4 và Cấp độ 5.</p>',2,'2025-12-13 14:10:16.000000','LiDAR: Mắt Thần của Xe Tự lái',69,'2025-12-13 14:10:16','2025-12-13 14:10:16'),(26,'<h1>Tối ưu hóa Hiệu suất Website bằng CDN: Tăng tốc Độ tải và Trải nghiệm Người dùng</h1>\r\n<p>Tốc độ tải trang là yếu tố sống còn đối với bất kỳ trang web thương mại điện tử hoặc dịch vụ trực tuyến nào. Mạng phân phối nội dung (CDN - Content Delivery Network) là một giải pháp kiến trúc mạng được thiết kế để giải quyết vấn đề này.</p>\r\n<p>CDN bao gồm một mạng lưới các máy chủ (PoP - Point of Presence) phân tán trên nhiều khu vực địa lý. Khi người dùng truy cập trang web, nội dung tĩnh (hình ảnh, video, CSS, JavaScript) sẽ được phục vụ từ máy chủ CDN gần vị trí của họ nhất, thay vì từ máy chủ gốc. Điều này làm giảm đáng kể khoảng cách vật lý và thời gian truyền tải dữ liệu.</p>\r\n<p>Lợi ích của CDN rất rõ ràng: 1) Tăng tốc độ tải trang, cải thiện trải nghiệm người dùng và tỷ lệ chuyển đổi; 2) Giảm tải cho máy chủ gốc, cho phép nó xử lý nhiều yêu cầu động hơn; và 3) Cung cấp một lớp bảo vệ chống lại các cuộc tấn công DDoS bằng cách phân tán lưu lượng truy cập.</p>',2,'2025-12-13 14:10:16.000000','CDN và Tăng tốc Độ tải Website',72,'2025-12-13 14:10:16','2025-12-13 14:10:16'),(27,'<h1>Cyber Resilience: Khả năng Phục hồi sau Tấn công Mạng</h1>\r\n<p>Trong môi trường đe dọa mạng ngày càng gia tăng, việc chỉ tập trung vào phòng thủ (ngăn chặn tấn công) là không đủ. Khả năng phục hồi không gian mạng (Cyber Resilience) là một khái niệm nâng cao, nhấn mạnh khả năng của một tổ chức không chỉ chống chịu mà còn nhanh chóng thích ứng, phục hồi và tiếp tục cung cấp dịch vụ sau khi một sự cố bảo mật xảy ra.</p>\r\n<p>Cyber Resilience bao gồm ba trụ cột chính: 1) **Phòng thủ:** Ngăn chặn các mối đe dọa được biết đến; 2) **Phát hiện:** Nhanh chóng nhận ra các mối đe dọa đã xâm nhập; và 3) **Phục hồi:** Khôi phục hệ thống và dữ liệu về trạng thái hoạt động bình thường một cách nhanh nhất.</p>\r\n<p>Chiến lược này đòi hỏi phải có kế hoạch ứng phó sự cố chi tiết, các giải pháp sao lưu và phục hồi dữ liệu tiên tiến, và một văn hóa tổ chức coi rủi ro mạng là một rủi ro kinh doanh, không chỉ là vấn đề của IT.</p>',2,'2025-12-13 14:10:16.000000','Cyber Resilience: Phục hồi sau Thảm họa Mạng',87,'2025-12-13 14:10:16','2025-12-13 14:10:16'),(28,'<h1>WebAssembly (Wasm) và Tương lai Web Hiệu năng cao</h1>\r\n<p>WebAssembly (Wasm) là một định dạng mã nhị phân cấp thấp được thiết kế để hoạt động như một máy ảo (virtual machine) bên trong trình duyệt web. Nó cho phép các ngôn ngữ lập trình như C, C++, Rust, và Go được biên dịch thành mã có thể chạy trên trình duyệt với tốc độ gần như tốc độ gốc (Native Speed).</p>\r\n<p>Wasm giải quyết vấn đề hiệu năng lâu đời của JavaScript, mở ra khả năng cho các ứng dụng web phức tạp và đòi hỏi tính toán cao như trò chơi 3D, chỉnh sửa video/ảnh chuyên nghiệp, và các ứng dụng CAD chạy trực tiếp trên trình duyệt mà không cần cài đặt plugin.</p>\r\n<p>Wasm không phải là công cụ thay thế JavaScript, mà là công cụ bổ trợ. JavaScript vẫn đóng vai trò là lớp điều khiển DOM và tích hợp, trong khi Wasm xử lý các tác vụ nặng về tính toán. Sự kết hợp này đang định hình lại khả năng của nền tảng web, biến trình duyệt thành một môi trường phát triển ứng dụng mạnh mẽ hơn bao giờ hết.</p>',2,'2025-12-13 14:10:16.000000','WebAssembly: Hiệu năng Cao cho Trình duyệt',57,'2025-12-13 14:10:16','2025-12-13 14:10:16'),(29,'<h1>API Economy: Mở khóa Giá trị Dữ liệu thông qua Tích hợp Hệ thống</h1>\r\n<p>Nền kinh tế API (API Economy) mô tả một môi trường kinh doanh nơi các dịch vụ và dữ liệu cốt lõi của tổ chức được đóng gói và chia sẻ với các bên thứ ba thông qua Giao diện Lập trình Ứng dụng (API - Application Programming Interface) một cách an toàn và có kiểm soát.</p>\r\n<p>API đã trở thành xương sống cho sự đổi mới và hợp tác kỹ thuật số. Chúng cho phép các công ty tài chính tích hợp dịch vụ thanh toán của bên thứ ba, các công ty bán lẻ kết nối kho hàng của mình với các nền tảng thương mại điện tử lớn, và các công ty khởi nghiệp xây dựng dịch vụ mới dựa trên dữ liệu của các tập đoàn lớn.</p>\r\n<p>Quản lý API (API Management) trở nên tối quan trọng để đảm bảo tính bảo mật, hiệu suất và khả năng mở rộng của các dịch vụ được cung cấp. Nền kinh tế API không chỉ thúc đẩy doanh thu mới mà còn tạo ra các mô hình kinh doanh hoàn toàn mới, dựa trên việc khai thác giá trị của dữ liệu thông qua kết nối.</p>',2,'2025-12-13 14:10:16.000000','API Economy: Mở khóa Giá trị Dữ liệu',65,'2025-12-13 14:10:16','2025-12-13 14:10:16'),(30,'<h1>Vệ tinh LEO và Internet Toàn cầu: Kết nối Những Khu vực Khó Tiếp cận</h1>\r\n<p>Internet vệ tinh đang bước vào một kỷ nguyên mới với sự ra đời của các chòm vệ tinh quỹ đạo thấp (LEO - Low-Earth Orbit), nổi bật là Starlink của SpaceX. Các vệ tinh LEO bay ở độ cao thấp hơn nhiều so với vệ tinh địa tĩnh (GEO) truyền thống, mang lại hai lợi ích lớn: độ trễ thấp và khả năng phủ sóng toàn cầu.</p>\r\n<p>Độ trễ thấp (low latency), thường dưới 50ms, làm cho Internet vệ tinh LEO trở nên khả dụng cho các ứng dụng yêu cầu phản hồi nhanh như trò chơi trực tuyến, cuộc gọi video và giao dịch tài chính. Quan trọng hơn, công nghệ này giải quyết vấn đề \"khoảng cách kỹ thuật số\" bằng cách cung cấp kết nối băng thông rộng tốc độ cao cho các khu vực nông thôn, miền núi, hoặc hải đảo—nơi việc lắp đặt cáp quang là không khả thi về mặt kinh tế.</p>\r\n<p>Các chòm vệ tinh LEO đang được triển khai nhanh chóng và hứa hẹn sẽ trở thành một phần không thể thiếu của cơ sở hạ tầng Internet toàn cầu trong thập kỷ tới.</p>',2,'2025-12-13 14:10:16.000000','Vệ tinh LEO: Internet cho Mọi Nơi',80,'2025-12-13 14:10:16','2025-12-13 14:10:16'),(31,'<h1>Đạo đức trong Phát triển Trí tuệ Nhân tạo: Đảm bảo Tính Công bằng và Minh bạch</h1>\r\n<p>Khi các hệ thống AI ngày càng được tích hợp sâu vào các quyết định quan trọng của cuộc sống (từ việc cho vay tín dụng đến việc tuyển dụng), các vấn đề về đạo đức AI trở nên cấp thiết. Nếu AI được huấn luyện trên dữ liệu có sẵn thiên vị (bias), nó có thể đưa ra các quyết định phân biệt đối xử và củng cố các định kiến xã hội.</p>\r\n<p>Các nguyên tắc cốt lõi của đạo đức AI bao gồm: **Tính công bằng (Fairness)**, **Tính minh bạch (Transparency)**, và **Tính trách nhiệm giải trình (Accountability)**. Các nhà phát triển AI phải nỗ lực kiểm tra và loại bỏ các thành kiến khỏi mô hình (Debiasing), và thiết kế các hệ thống cho phép người dùng hiểu tại sao AI đưa ra một quyết định cụ thể (Explainable AI - XAI).</p>\r\n<p>Việc xây dựng khung pháp lý rõ ràng và các ủy ban giám sát độc lập là cần thiết để đảm bảo rằng công nghệ AI được sử dụng vì lợi ích chung, không gây hại và không vi phạm quyền cơ bản của con người.</p>',2,'2025-12-13 14:10:16.000000','Đạo đức AI: Đảm bảo Tính Công bằng',50,'2025-12-13 14:10:16','2025-12-13 14:10:16'),(32,'<h1>Công nghệ AR/VR trong Bán lẻ: Cách mạng hóa Trải nghiệm Khách hàng</h1>\r\n<p>Thực tế Tăng cường (AR) và Thực tế Ảo (VR) đang tạo ra một sự thay đổi mô hình trong ngành bán lẻ và thương mại điện tử, xóa mờ ranh giới giữa mua sắm trực tuyến và trải nghiệm vật lý.</p>\r\n<p>AR cho phép khách hàng sử dụng camera điện thoại để \"thử\" sản phẩm ảo trong không gian thực của họ. Ví dụ, trước khi mua nội thất, khách hàng có thể đặt mô hình 3D của chiếc ghế sofa mới vào phòng khách của mình để xem kích thước và màu sắc có phù hợp không. Điều này giải quyết một trong những vấn đề lớn nhất của mua sắm trực tuyến: sự không chắc chắn về sản phẩm.</p>\r\n<p>VR mang lại trải nghiệm nhập vai hơn, cho phép khách hàng \"đi dạo\" trong các cửa hàng ảo 3D hoặc tham gia các sự kiện ra mắt sản phẩm. Bằng cách giảm tỷ lệ hoàn hàng và tăng sự tương tác, AR/VR không chỉ cải thiện doanh số bán hàng mà còn xây dựng lòng trung thành sâu sắc hơn với thương hiệu.</p>',2,'2025-12-13 14:10:16.000000','AR/VR và Trải nghiệm Mua sắm Trực tuyến',89,'2025-12-13 14:10:16','2025-12-13 14:10:16');
/*!40000 ALTER TABLE `news` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `news_comment`
--

DROP TABLE IF EXISTS `news_comment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `news_comment` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `comment` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `time` datetime(6) DEFAULT NULL,
  `id_news` int(11) DEFAULT NULL,
  `id_user` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */,
  KEY `FKme5wqxcvb2srdkdvno2uasjnp` (`id_news`),
  KEY `FKmx47ee9wyjetfpvlb7w7g96ev` (`id_user`),
  CONSTRAINT `FKme5wqxcvb2srdkdvno2uasjnp` FOREIGN KEY (`id_news`) REFERENCES `nckh`.`news` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FKmx47ee9wyjetfpvlb7w7g96ev` FOREIGN KEY (`id_user`) REFERENCES `nckh`.`user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=420005;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `news_comment`
--

LOCK TABLES `news_comment` WRITE;
/*!40000 ALTER TABLE `news_comment` DISABLE KEYS */;
INSERT INTO `news_comment` VALUES (330005,'đàasdfsdadsf',NULL,1,31,'2025-12-07 10:01:58','2025-12-07 10:01:58'),(330006,'tyuty',NULL,1,31,'2025-12-07 10:02:08','2025-12-07 10:02:08'),(330007,'fhgj',NULL,1,31,'2025-12-07 10:05:07','2025-12-07 10:05:07'),(330008,'gfhfgh',NULL,1,31,'2025-12-07 10:05:10','2025-12-07 10:05:10'),(330009,'fghfg',NULL,1,31,'2025-12-07 10:05:13','2025-12-07 10:05:13'),(330010,'hfghfg',NULL,1,31,'2025-12-07 10:05:17','2025-12-07 10:05:17'),(330011,'fghf',NULL,1,31,'2025-12-07 10:05:20','2025-12-07 10:05:20'),(330012,'fghf',NULL,1,31,'2025-12-07 10:05:24','2025-12-07 10:05:24'),(330013,'ghfghf',NULL,1,31,'2025-12-07 10:05:27','2025-12-07 10:05:27'),(330014,'hnggh',NULL,1,31,'2025-12-07 10:05:34','2025-12-07 10:05:34'),(330015,'nghng',NULL,1,31,'2025-12-07 10:05:37','2025-12-07 10:05:37'),(390005,'ừi',NULL,6,31,'2025-12-18 21:48:39','2025-12-18 21:48:39');
/*!40000 ALTER TABLE `news_comment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `news_image`
--

DROP TABLE IF EXISTS `news_image`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `news_image` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `image_name` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `id_news` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */,
  KEY `FKk7enm8n6r6isomdbcuxxs18ep` (`id_news`),
  CONSTRAINT `FKk7enm8n6r6isomdbcuxxs18ep` FOREIGN KEY (`id_news`) REFERENCES `nckh`.`news` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=30004;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `news_image`
--

LOCK TABLES `news_image` WRITE;
/*!40000 ALTER TABLE `news_image` DISABLE KEYS */;
INSERT INTO `news_image` VALUES (3,'image_1.jpg',1,'2025-09-18 11:15:06','2025-09-18 11:15:06');
/*!40000 ALTER TABLE `news_image` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `operating_standards`
--

DROP TABLE IF EXISTS `operating_standards`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `operating_standards` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `gs_pgs` int(11) DEFAULT NULL,
  `ks_cn` int(11) DEFAULT NULL,
  `ts` int(11) DEFAULT NULL,
  `ths` int(11) DEFAULT NULL,
  `criteria` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `id_type_of_criteria` int(11) DEFAULT NULL,
  `unit` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=30034;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `operating_standards`
--

LOCK TABLES `operating_standards` WRITE;
/*!40000 ALTER TABLE `operating_standards` DISABLE KEYS */;
INSERT INTO `operating_standards` VALUES (1,2,1,1,1,'Trình bày seminar ',1,'Lần/năm','2025-09-18 11:15:06','2025-09-18 11:15:06'),(5,3,6,3,6,'Tham dự seminar',1,'Lần/năm','2025-09-18 11:15:06','2025-09-18 11:15:06'),(9,2,1,1,1,'Bài tham luận trình bày tại hội thảo',2,NULL,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(13,2,4,2,4,'Tham gia hội thảo',2,NULL,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(20,1,NULL,0,NULL,'Bài báo quốc tế danh mục WoS/Scopus',3,'Bài/năm','2025-09-18 11:15:06','2025-09-18 11:15:06'),(21,1,NULL,NULL,1,'Bài báo tiếng Anh (tạp chí học viện)',3,'Bài/năm','2025-09-18 11:15:06','2025-09-18 11:15:06'),(22,NULL,1,1,1,'Bài báo tiếng việt (tạp chí học viện)',4,'Bài/năm','2025-09-18 11:15:06','2025-09-18 11:15:06'),(23,1,NULL,1,1,'Bài tham luận hội thảo có phản biện',5,'Bài/năm','2025-09-18 11:15:06','2025-09-18 11:15:06'),(24,1,NULL,1,0,'Bài tổng quan về lĩnh vực nghiên cứu',6,'Bài/năm','2025-09-18 11:15:06','2025-09-18 11:15:06'),(25,NULL,1,1,2,'Các hoạt động tư vấn/ Hướng dẫn kỹ thuật/ Bản tin KH&CN đăng trên website học viện',7,'Sản phẩm/năm','2025-09-18 11:15:06','2025-09-18 11:15:06'),(26,1,NULL,NULL,NULL,'Quy trình kỹ thuật/ Tiến bộ kỹ thuật/ Tiêu chuẩn kỹ thuật được công nhận cấp cơ sở ',8,'Sản phẩm/năm','2025-09-18 11:15:06','2025-09-18 11:15:06'),(27,2,NULL,2,1,'Đề xuất cấp bộ và tương đương',9,'Đề xuất/năm','2025-09-18 11:15:06','2025-09-18 11:15:06'),(28,0,NULL,0,NULL,'Đề xuất cấp bộ và tương đương( chủ trì )',10,'nv/năm','2025-09-18 11:15:06','2025-09-18 11:15:06'),(29,1,1,1,1,'Hướng dẫn nhóm sinh viên NCKH',10,'nv/năm','2025-09-18 11:15:06','2025-09-18 11:15:06'),(30,2,2,2,2,'Tham dự hội đồng tư vấn khoa học /tư vấn định hướng nghiên cứu, xây dựng các thuyết minh đề tài/ dự án ',11,'Hội dồng/năm','2025-09-18 11:15:06','2025-09-18 11:15:06'),(31,2,2,2,2,'Tham dự Seminar/ chuyên đề do chuyên gia (quốc tế, trong nước, cơ quan quản lí, doanh nghiệp, ...) trình bày',12,'Lần/năm','2025-09-18 11:15:06','2025-09-18 11:15:06'),(32,NULL,NULL,NULL,NULL,'Xây dựng và triển khai các đề án/ Nhiệm vụ KH&CN của học viện ',13,'Tiết/năm/nhóm','2025-09-18 11:15:06','2025-09-18 11:15:06'),(33,1,1,1,1,'Hợp dồng KH&CN khác: tập huấn',13,'nv/năm','2025-09-18 11:15:06','2025-09-18 11:15:06');
/*!40000 ALTER TABLE `operating_standards` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `operating_standards_2`
--

DROP TABLE IF EXISTS `operating_standards_2`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `operating_standards_2` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `catalog` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `unit` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `id_operating_standard` int(11) DEFAULT NULL,
  `id_type_of_criteria` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */,
  KEY `FKn2v4lrt4mu2oono54pax3s0cd` (`id_operating_standard`),
  KEY `FK4p4jwee4ue9c7ju8ahmd16tsv` (`id_type_of_criteria`),
  CONSTRAINT `FK4p4jwee4ue9c7ju8ahmd16tsv` FOREIGN KEY (`id_type_of_criteria`) REFERENCES `nckh`.`type_of_criteria` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FKn2v4lrt4mu2oono54pax3s0cd` FOREIGN KEY (`id_operating_standard`) REFERENCES `nckh`.`operating_standards` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=30041;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `operating_standards_2`
--

LOCK TABLES `operating_standards_2` WRITE;
/*!40000 ALTER TABLE `operating_standards_2` DISABLE KEYS */;
INSERT INTO `operating_standards_2` VALUES (1,'Seminar','Trình bày seminar','Giờ/bài',5,1,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(2,'Seminar','Trừ giờ NCKH do thiếu tham gia Seminar','Giờ/Lượt người',5,1,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(3,'Tổ chức hội thảo ','Tổ chức hội thảo cấp Quốc tế','Giờ/Hội thảo',9,2,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(4,'Tổ chức hội thảo ','Tổ chức hội thảo cấp Quốc Gia','Giờ/Hội thảo',9,2,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(5,'Tổ chức hội thảo ','Tổ chức hội thảo cấp Học Viện','Giờ/Hội thảo',9,2,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(6,'Tổ chức hội thảo ','Trừ giờ NCKH do thiếu tham gia hội thảo ','Giờ/Lượt người',9,2,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(7,'Bài tham luận trình bày tại hội thảo ','Trình bày tại hội thảo cấp Quốc Tế ','Giờ/bài',9,2,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(8,'Bài tham luận trình bày tại hội thảo ','Trình bày hội thảo cấp Quốc Gia','Giờ/bài',9,2,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(9,'Bài tham luận trình bày tại hội thảo ','Trình bày hội thảo cấp Học Viện ','Giờ/bài',9,2,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(10,'Bài báo quốc tế','Bài báo quốc tế thuộc danh mục Wos','Giờ/bài',20,3,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(11,'Bài báo quốc tế','Bài báo quốc tế thuộc danh mục Scopus','Giờ/bài',20,3,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(12,'Bài báo quốc tế','Bài báo tiếng Anh (Tạp chí của học viện)','Giờ/bài',21,3,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(13,'Bài báo quốc tế','Bài báo quốc tế không thuộc danh mục Wos/Scopus','Giờ/bài',21,3,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(14,'Bài báo quốc tế','Trích dẫn bài báo tiếng Anh của Học Viện ','Giờ/bài',21,3,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(15,'Bài báo tiếng việt  ','Bài báo tiếng Việt đăng trên Tạp chí của học viện ','Giờ/bài',22,4,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(16,'Bài báo tiếng việt  ','Bài báo tiếng Việt đăng trên các tạp chí khác','Giờ/bài',22,4,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(17,'Bài tham luận hội thảo đăng kỉ yếu ','Hội thảo cấp Quốc tế','Giờ/bài',23,5,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(18,'Bài tham luận hội thảo đăng kỉ yếu ','Hội thảo cấp Quốc gia','Giờ/bài',23,5,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(19,'Bài tham luận hội thảo đăng kỉ yếu ','Hội thảo cấp Học Viện','Giờ/bài',23,5,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(20,'Bài tổng quan lĩnh vực nghiên cứu','Bài tổng quan lĩnh vực nghiên cứu','Giờ/bài',24,6,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(21,'Quy trình kỹ thuật/ tiến bộ kĩ thuật/ Tiêu chuẩn kỹ thuật được công nhận cấp cơ sở;Góp ý văn bản quy phạm pháp luật;Thông tin kết quả nghiên cứu đăng trên Website/ tập san Học viện','Quy trình kỹ thuật/ tiến bộ kĩ thuật/ Tiêu chuẩn kỹ thuật được công nhận cấp cơ sở;Góp ý văn bản quy phạm pháp luật;Thông tin kết quả nghiên cứu đăng trên Website/ tập san Học viện','Giờ/Sản phẩm',26,8,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(22,'Đề xuất đưa vào danh mục tuyển chọn','Cấp quốc gia','Giờ/Đề xuất',27,9,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(23,'Đề xuất đưa vào danh mục tuyển chọn','Cấp bộ và tương đương','Giờ/Đề xuất',27,9,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(24,'Đề xuất đưa vào danh mục tuyển chọn','Cấp học viện trọng điểm','Giờ/Đề xuất',27,9,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(25,'Nhiệm vụ KH&CN được phê duyệt ','Cấp quốc gia ','Giờ/Đề tài',28,10,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(26,'Nhiệm vụ KH&CN được phê duyệt ','Cấp Bộ và tương đương','Giờ/Đề tài',28,10,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(27,'Nhiệm vụ KH&CN được phê duyệt ','Cấp Học viện trọng điểm','Giờ/Đề tài',28,10,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(28,'Nhiệm vụ KH&CN được phê duyệt ','Cấp Học viện','Giờ/Đề tài',28,10,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(29,'Nhiệm vụ KH&CN được phê duyệt ','Hướng dẫn sinh viên NCKH','Giờ/Nhóm',29,10,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(30,'Tổ chức hội đồng tư vấn định hướng nghiên cứu','Tổ chức hội đồng tư vấn định hướng nghiên cứu','Giờ/Hội đồng',30,11,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(31,'Mời chuyên gia trình bày seminar/ chuyên đề ','Mời chuyên gia trình bày seminar/ chuyên đề ','Giờ/Seminar',31,12,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(32,'Các hoạt động KH&CN khác','Chương sách nước ngoài có ISBN','Giờ/Chương',32,13,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(33,'Các hoạt động KH&CN khác','Xây dựng đề án của Học Viện (được phê duyệt)','Giờ/Đề án',32,13,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(34,'Các hoạt động KH&CN khác','Bài đăng tin quảng bá Học Viện (theo đặt hàng)','Giờ/Bài',32,13,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(35,'Các hoạt động KH&CN khác','Giáo trình được xuất bản (tái bản – lần đầu)','Giờ/Giáo trình',32,13,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(36,'Các hoạt động KH&CN khác','Bài giảng của môn học mới được phê duyệt','Giờ/Bài giảng',32,13,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(37,'Các hoạt động KH&CN khác','Sách chuyên khảo','Giờ/Sách',32,13,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(38,'Các hoạt động KH&CN khác','Sách tham khảo','Giờ/Sách',32,13,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(39,'Các hoạt động KH&CN khác','Hợp đồng KH&CN về tài khoản của học viện','Giờ/10 tr.đồng',32,13,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(40,'Các hoạt động tư vấn/ Hướng dẫn kỹ thuật/ Bản tin KH&CN đăng trên website học viện','Các hoạt động tư vấn/ Hướng dẫn kỹ thuật/ Bản tin KH&CN đăng trên website học viện','Giờ/Sản phẩm',25,7,'2025-09-18 11:15:06','2025-09-18 11:15:06');
/*!40000 ALTER TABLE `operating_standards_2` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `overview_paper`
--

DROP TABLE IF EXISTS `overview_paper`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `overview_paper` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `article_link` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `id_event` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=30005;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `overview_paper`
--

LOCK TABLES `overview_paper` WRITE;
/*!40000 ALTER TABLE `overview_paper` DISABLE KEYS */;
INSERT INTO `overview_paper` VALUES (1,'https://fita.vnua.edu.vn/tong-quan-ve-dien-toan-dam-may/',37,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(2,'https://fita.vnua.edu.vn/tong-quan-ve-cong-nghe-thong-tin-va-truyen-thong-ict-information-communication-technology-phan-i-cong-nghe-phan-cung/',38,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(3,'https://fita.vnua.edu.vn/it-business-analyst-va-xu-huong-nghe-nghiep/',39,'2025-09-18 11:15:06','2025-09-18 11:15:06'),(4,'https://fita.vnua.edu.vn/cac-ky-thuat-hoc-may-va-thi-giac-may-tinh-trong-cac-ung-dung-giam-sat-lien-tuc-to-ong/',40,'2025-09-18 11:15:06','2025-09-18 11:15:06');
/*!40000 ALTER TABLE `overview_paper` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `research_advisory_council`
--

DROP TABLE IF EXISTS `research_advisory_council`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `research_advisory_council` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `document_template` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `id_event` int(11) DEFAULT NULL,
  `image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `task_description` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `research_advisory_council`
--

LOCK TABLES `research_advisory_council` WRITE;
/*!40000 ALTER TABLE `research_advisory_council` DISABLE KEYS */;
/*!40000 ALTER TABLE `research_advisory_council` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `research_group`
--

DROP TABLE IF EXISTS `research_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `research_group` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `description` varchar(2000) DEFAULT NULL,
  `group_name` varchar(200) NOT NULL,
  `status` enum('APPROVED','PENDING','REJECTED') NOT NULL,
  `topic_name` varchar(500) NOT NULL,
  `advisor_id` int(11) DEFAULT NULL,
  `leader_id` int(11) NOT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */,
  KEY `FK8qbm225rkpvh74jk25e7j9r98` (`advisor_id`),
  KEY `FK2hpsnguhh34t3vo5xfd7ij1l5` (`leader_id`),
  CONSTRAINT `FK8qbm225rkpvh74jk25e7j9r98` FOREIGN KEY (`advisor_id`) REFERENCES `nckh`.`user` (`id`),
  CONSTRAINT `FK2hpsnguhh34t3vo5xfd7ij1l5` FOREIGN KEY (`leader_id`) REFERENCES `nckh`.`user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin AUTO_INCREMENT=120001;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `research_group`
--

LOCK TABLES `research_group` WRITE;
/*!40000 ALTER TABLE `research_group` DISABLE KEYS */;
INSERT INTO `research_group` VALUES (1,'2025-12-07 00:25:58','2025-12-07 11:05:40','dá','hty','APPROVED','sdfsdfsdkfbskdbfsdbkjfsdfsjdfnsjdfsdfsdjfffffffffffffffffffffffffffffffffffffffffffffffffffff',21,31),(60001,'2025-12-13 02:25:55','2025-12-15 14:11:17','f\n\nLý do từ chối: r','nhóm 1','APPROVED','hoạt động mô',18,31),(60002,'2025-01-15 10:30:00','2025-01-20 15:45:00','Nghiên cứu ứng dụng Học Tăng cường trong việc tối ưu hóa chuỗi cung ứng logistics.','Nhóm A2','APPROVED','Ứng dụng Reinforcement Learning trong Logistics',45,78),(60003,'2025-02-28 08:00:00','2025-03-05 11:20:00','Phân tích và triển khai kiến trúc Microservices cho các ứng dụng thương mại điện tử quy mô lớn.','NhómNghiên cứu mạng vcl luôn ấy ','PENDING','Kiến trúc Microservices cho E-commerce',88,55),(60004,'2025-03-10 14:15:00','2025-03-18 09:10:00','Nghiên cứu về bảo mật và chống tấn công DDoS sử dụng AI và Machine Learning.','Nhóm C5','APPROVED','Bảo mật Mạng và Phát hiện DDoS bằng AI',76,42),(60005,'2025-04-05 09:30:00','2025-04-12 16:00:00','Phát triển mô hình dự đoán năng suất cây trồng dựa trên dữ liệu IoT và ảnh vệ tinh.','Nhóm D3','APPROVED','AI và IoT trong Nông nghiệp Thông minh',60,91),(60006,'2025-05-18 11:00:00','2025-05-25 10:40:00','Thiết kế và triển khai hệ thống quản lý dữ liệu phân tán sử dụng công nghệ Blockchain.','Nhóm E2','APPROVED','Blockchain cho Quản lý Dữ liệu Phân tán',52,63),(60007,'2025-06-01 13:20:00','2025-06-08 17:15:00','Nghiên cứu về tối ưu hóa thuật toán nén dữ liệu cho môi trường điện toán biên (Edge Computing).','Nhóm F1','APPROVED','Tối ưu hóa Nén Dữ liệu trên Edge',70,84),(60008,'2025-07-22 10:00:00','2025-07-30 14:00:00','Phát triển ứng dụng giáo dục sử dụng Thực tế Tăng cường (AR) cho khối phổ thông.','Nhóm G4','APPROVED','AR trong Giáo dục Trực quan',49,58),(60009,'2025-08-01 07:45:00','2025-08-10 12:30:00','Nghiên cứu so sánh hiệu năng giữa Pin Lithium-ion và Pin thể rắn cho xe điện.','Nhóm H3','APPROVED','Công nghệ Pin cho Xe Điện Tương lai',81,75),(60010,'2025-09-11 16:00:00','2025-09-18 08:30:00','Xây dựng hệ thống nhận dạng khuôn mặt với độ chính xác cao trong điều kiện ánh sáng yếu.','Nhóm I2','APPROVED','Hệ thống Nhận dạng Khuôn mặt Độ chính xác cao',72,47),(60011,'2025-10-04 11:10:00','2025-10-15 13:55:00','Nghiên cứu về tính công bằng và loại bỏ thiên vị trong mô hình AI tuyển dụng.','Nhóm J1','APPROVED','Đạo đức AI và Tính Công bằng Thuật toán',66,82),(60012,'2025-11-09 14:40:00','2025-11-20 16:20:00','Phát triển nền tảng Low-Code/No-Code để tạo ứng dụng quản lý quy trình nghiệp vụ (BPM).','Nhóm K5','APPROVED','Nền tảng Low-Code cho BPM',57,68),(60013,'2025-12-01 12:00:00','2025-12-10 09:00:00','Nghiên cứu ứng dụng IoT và Big Data trong việc quản lý tài nguyên nước đô thị.','Nhóm L3','APPROVED','IoT và Quản lý Nước Thông minh',90,79),(60014,'2025-01-25 14:50:00','2025-02-05 11:30:00','Phân tích và triển khai tiêu chuẩn bảo mật mã hóa Hậu lượng tử (Post-Quantum Cryptography).','Nhóm M2','APPROVED','Bảo mật Mã hóa Hậu Lượng tử',51,46),(60015,'2025-03-20 17:00:00','2025-04-01 08:50:00','Xây dựng mô hình dự báo thị trường chứng khoán sử dụng mạng nơ-ron hồi quy (RNN).','Nhóm N1','APPROVED','Dự báo Thị trường bằng Deep Learning',74,87),(60016,'2025-05-10 09:25:00','2025-05-18 13:45:00','Nghiên cứu về tối ưu hóa mạng CDN cho việc phân phối nội dung video độ nét cao.','Nhóm P4','APPROVED','Tối ưu hóa Hiệu năng CDN',43,61),(60017,'2025-06-28 10:50:00','2025-07-07 15:10:00','Phát triển giao diện người dùng trực quan cho WebAssembly (Wasm) trong trình duyệt.','Nhóm Q3','APPROVED','WebAssembly và UI/UX',64,77),(60018,'2025-08-15 14:00:00','2025-08-25 11:50:00','Nghiên cứu về khả năng tích hợp Robot Cộng tác (Cobot) trong dây chuyền lắp ráp linh kiện điện tử.','Nhóm R2','APPROVED','Tích hợp Cobot trong Sản xuất',89,59),(60019,'2025-09-29 08:15:00','2025-10-05 14:20:00','Thiết kế hệ thống quản lý rác thải đô thị thông minh dựa trên cảm biến trọng lượng và IoT.','Nhóm S1','APPROVED','IoT cho Quản lý Rác thải Đô thị',67,86),(60020,'2025-11-05 15:30:00','2025-11-12 10:10:00','Phân tích tác động của Mạng 6G đối với các ứng dụng Metaverse và Real-time Holography.','Nhóm T5','APPROVED','6G và Ứng dụng Metaverse',59,73),(60021,'2025-12-11 09:40:00','2025-12-13 18:00:00','Nghiên cứu về ứng dụng công nghệ In 3D trong việc sản xuất các thiết bị y tế cá nhân hóa.','Nhóm U4','APPROVED','In 3D trong Y tế Cá nhân hóa',84,53);
/*!40000 ALTER TABLE `research_group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `research_group_document`
--

DROP TABLE IF EXISTS `research_group_document`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `research_group_document` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `description` varchar(1000) DEFAULT NULL,
  `document_name` varchar(500) NOT NULL,
  `document_type` varchar(100) NOT NULL,
  `file_url` varchar(500) NOT NULL,
  `research_group_id` int(11) NOT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */,
  KEY `FKji3reylt7w5hmdrtga8dacdbu` (`research_group_id`),
  CONSTRAINT `FKji3reylt7w5hmdrtga8dacdbu` FOREIGN KEY (`research_group_id`) REFERENCES `nckh`.`research_group` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `research_group_document`
--

LOCK TABLES `research_group_document` WRITE;
/*!40000 ALTER TABLE `research_group_document` DISABLE KEYS */;
/*!40000 ALTER TABLE `research_group_document` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `research_group_members`
--

DROP TABLE IF EXISTS `research_group_members`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `research_group_members` (
  `group_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`group_id`,`user_id`) /*T![clustered_index] CLUSTERED */,
  KEY `FKgry64eb6voyku1xuktycpkso1` (`user_id`),
  CONSTRAINT `FKgry64eb6voyku1xuktycpkso1` FOREIGN KEY (`user_id`) REFERENCES `nckh`.`user` (`id`),
  CONSTRAINT `FKejdgq5x856elah92hy42m3ws9` FOREIGN KEY (`group_id`) REFERENCES `nckh`.`research_group` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `research_group_members`
--

LOCK TABLES `research_group_members` WRITE;
/*!40000 ALTER TABLE `research_group_members` DISABLE KEYS */;
INSERT INTO `research_group_members` VALUES (1,19),(1,20),(1,31),(1,39),(60001,25),(60001,26),(60001,31),(60002,43),(60002,57),(60002,69),(60002,85),(60003,44),(60003,62),(60003,73),(60004,50),(60004,68),(60004,80),(60004,91),(60005,42),(60005,59),(60005,77),(60006,47),(60006,64),(60006,82),(60006,88),(60007,53),(60007,70),(60007,86),(60008,45),(60008,61),(60008,79),(60008,89),(60009,48),(60009,65),(60009,83),(60010,52),(60010,71),(60010,87),(60010,90),(60011,54),(60011,60),(60011,74),(60012,46),(60012,63),(60012,75),(60012,81),(60013,49),(60013,66),(60013,84),(60014,42),(60014,55),(60014,72),(60014,88),(60015,51),(60015,67),(60015,85),(60016,44),(60016,56),(60016,76),(60016,89),(60017,58),(60017,78),(60017,86),(60018,57),(60018,60),(60018,70),(60018,81),(60019,43),(60019,71),(60019,82),(60020,48),(60020,50),(60020,65),(60020,80),(60021,49),(60021,66),(60021,75);
/*!40000 ALTER TABLE `research_group_members` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `research_proposal`
--

DROP TABLE IF EXISTS `research_proposal`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `research_proposal` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_event` int(11) DEFAULT NULL,
  `proposal_type` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `research_proposal`
--

LOCK TABLES `research_proposal` WRITE;
/*!40000 ALTER TABLE `research_proposal` DISABLE KEYS */;
/*!40000 ALTER TABLE `research_proposal` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `resume`
--

DROP TABLE IF EXISTS `resume`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `resume` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `address` varchar(250) COLLATE utf8mb4_unicode_ci NOT NULL,
  `birthday` date NOT NULL,
  `email` varchar(256) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=120024;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `resume`
--

LOCK TABLES `resume` WRITE;
/*!40000 ALTER TABLE `resume` DISABLE KEYS */;
INSERT INTO `resume` VALUES (1,'thanh hóa','2025-09-05','ngocduongxk2003@gmail.com','0962498015','2025-09-18 11:15:07','2025-11-02 12:50:08'),(2,'ssssssssssssssssssss','1999-09-09','ptla@gmail.com','0987654545','2025-09-18 11:15:07','2025-09-18 11:15:07'),(3,'abcdxyz bla bla, bla bla','2000-08-09','user2@gmail.com','0212345671','2025-09-18 11:15:07','2025-11-15 23:14:02'),(5,'abcdxyz bla bla, bla bla','2000-08-09','user1@gmail.com','0212345679','2025-09-18 11:15:07','2025-11-02 13:28:55'),(6,'abcdxyz bla bla, bla bla','2000-08-09','user@gmail.com','0212345678','2025-09-18 11:15:07','2025-09-18 11:15:07'),(7,'abcdxyz bla bla, bla bla','2000-08-09','user@gmail.com','0212345678','2025-09-18 11:15:07','2025-09-18 11:15:07'),(8,'abcdxyz bla bla, bla bla','2000-08-09','user@gmail.com','0212345678','2025-09-18 11:15:07','2025-09-18 11:15:07'),(9,'abcdxyz bla bla, bla bla','2000-08-09','userDung@gmail.com','0987654321','2025-09-18 11:15:07','2025-09-18 11:15:07'),(10,'abcdxyz bla bla, bla bla','2000-08-09','user@gmail.com','0212345678','2025-09-18 11:15:07','2025-09-18 11:15:07'),(11,'abcdxyz bla bla, bla bla','2000-08-09','user@gmail.com','0212345678','2025-09-18 11:15:07','2025-09-18 11:15:07'),(12,'Trâu Quỳ - Gia Lâm - Hà Nội','2003-11-04','ngominh041103@gmail.com','0974647799','2025-09-18 11:15:07','2025-09-18 11:15:07'),(13,'Trâu Quỳ - Gia Lâm - Hà Nội','2003-04-04','ngominh0411032@gmail.com','0123456789','2025-09-18 11:15:07','2025-09-18 11:15:07'),(18,'','2222-07-31','duong@gmail.com','','2025-11-04 11:57:16','2025-11-04 11:57:16'),(21,'','2025-11-04','fsd@gmail.com','','2025-11-07 23:16:17','2025-11-07 23:16:17'),(22,'','2025-11-03','ngocduongxk9403@gmail.com','','2025-11-09 14:57:55','2025-12-07 06:22:07'),(23,'','2025-11-03','ewr@sv.edu.vn','','2025-11-09 14:58:26','2025-11-09 14:58:26'),(24,'45B Ngõ 335 Nguyễn Trãi, Thanh Xuân, Hà Nội','1995-01-01','user24@example.com','0912345024','2025-12-13 13:50:53','2025-12-13 13:50:53'),(25,'102/53 Đường Lê Văn Sỹ, Phường 13, Quận 3, TP.HCM','1996-02-02','user25@example.com','0912345025','2025-12-13 13:50:53','2025-12-13 13:50:53'),(26,'22 Đường Quang Trung, Phường Hải Châu 1, Hải Châu, Đà Nẵng','1997-03-03','user26@example.com','0912345026','2025-12-13 13:50:53','2025-12-13 13:50:53'),(27,'68 Ngõ Hàng Kênh, Lê Chân, Hải Phòng','1998-04-04','user27@example.com','0912345027','2025-12-13 13:50:53','2025-12-13 13:50:53'),(28,'34A Đường Trần Phú, Phường Lộc Thọ, Nha Trang, Khánh Hòa','1999-05-05','user28@example.com','0912345028','2025-12-13 13:50:53','2025-12-13 13:50:53'),(29,'15/22 Đường Hùng Vương, Phường Phú Nhuận, Huế','2000-06-06','user29@example.com','0912345029','2025-12-13 13:50:53','2025-12-13 13:50:53'),(30,'40 Đường 30 Tháng 4, Phường Xuân Khánh, Ninh Kiều, Cần Thơ','2001-07-07','user30@example.com','0912345030','2025-12-13 13:50:53','2025-12-13 13:50:53'),(31,'99/5 Đường Ba Cu, Phường 3, Vũng Tàu, Bà Rịa - Vũng Tàu','2002-08-08','user31@example.com','0912345031','2025-12-13 13:50:53','2025-12-13 13:50:53'),(32,'77 Đường Nguyễn Văn Linh, Phường An Khánh, Ninh Kiều, Cần Thơ','2003-09-09','user32@example.com','0912345032','2025-12-13 13:50:53','2025-12-13 13:50:53'),(33,'18 Đường Yersin, Phường Phú Hòa, Thủ Dầu Một, Bình Dương','1994-10-10','user33@example.com','0912345033','2025-12-13 13:50:53','2025-12-13 13:50:53'),(34,'205/10 Đường Trần Hưng Đạo, Phường Mỹ Bình, Long Xuyên, An Giang','1995-11-11','user34@example.com','0912345034','2025-12-13 13:50:53','2025-12-13 13:50:53'),(35,'343/1 Đường Bùi Thị Xuân, Phường 2, Đà Lạt, Lâm Đồng','1996-12-12','user35@example.com','0912345035','2025-12-13 13:50:53','2025-12-13 13:50:53'),(36,'19 Đường Mạc Cửu, Vĩnh Thanh, Rạch Giá, Kiên Giang','1997-01-13','user36@example.com','0912345036','2025-12-13 13:50:53','2025-12-13 13:50:53'),(37,'55 Đường Đồng Khởi, Phường Bến Nghé, Quận 1, TP.HCM','1998-02-14','user37@example.com','0912345037','2025-12-13 13:50:53','2025-12-13 13:50:53'),(38,'90 Đường Nguyễn Huệ, Phường 3, Đông Hà, Quảng Trị','1999-03-15','user38@example.com','0912345038','2025-12-13 13:50:53','2025-12-13 13:50:53'),(39,'88 Đường Lý Thái Tổ, Phường Võ Cường, Bắc Ninh','2000-04-16','user39@example.com','0912345039','2025-12-13 13:50:53','2025-12-13 13:50:53'),(40,'12A Đường 30/4, Phường 2, Tây Ninh','2001-05-17','user40@example.com','0912345040','2025-12-13 13:50:53','2025-12-13 13:50:53'),(41,'119 Phố Cát Dài, Lê Chân, Hải Phòng','2002-06-18','user41@example.com','0912345041','2025-12-13 13:50:53','2025-12-13 13:50:53'),(42,'56 Đường Thống Nhất, Phường 8, Vũng Tàu, Bà Rịa - Vũng Tàu','2003-07-19','user42@example.com','0912345042','2025-12-13 13:50:53','2025-12-13 13:50:53'),(43,'210/8 Đường Nguyễn Công Trứ, Phường 8, TP. Tuy Hòa, Phú Yên','1994-08-20','user43@example.com','0912345043','2025-12-13 13:50:53','2025-12-13 13:50:53'),(44,'35 Đường Láng Hạ, Đống Đa, Hà Nội','1995-09-21','user44@example.com','0912345044','2025-12-13 13:50:53','2025-12-13 13:50:53'),(45,'11 Đường 3 Tháng 2, Phường Thuận Phước, Hải Châu, Đà Nẵng','1996-10-22','user45@example.com','0912345045','2025-12-13 13:50:53','2025-12-13 13:50:53'),(46,'32/11 Đường Nguyễn Đình Chiểu, Phường 6, Quận 3, TP.HCM','1997-11-23','user46@example.com','0912345046','2025-12-13 13:50:53','2025-12-13 13:50:53'),(47,'70 Đường Chi Lăng, Phường Phú Hiệp, Huế','1998-12-24','user47@example.com','0912345047','2025-12-13 13:50:53','2025-12-13 13:50:53'),(48,'18 Đường Trần Văn Hoài, Phường Xuân Khánh, Ninh Kiều, Cần Thơ','1999-01-25','user48@example.com','0912345048','2025-12-13 13:50:53','2025-12-13 13:50:53'),(49,'30 Đường Lê Lợi, Phường 1, Đông Hà, Quảng Trị','2000-02-26','user49@example.com','0912345049','2025-12-13 13:50:53','2025-12-13 13:50:53'),(50,'99 Đường Hai Bà Trưng, Quận Hoàn Kiếm, Hà Nội','2001-03-27','user50@example.com','0912345050','2025-12-13 13:50:53','2025-12-13 13:50:53'),(51,'41 Đường Lê Hồng Phong, Phường Phước Ninh, Hải Châu, Đà Nẵng','2002-04-28','user51@example.com','0912345051','2025-12-13 13:50:53','2025-12-13 13:50:53'),(52,'54 Đường Nguyễn Thị Minh Khai, Phường Bến Thành, Quận 1, TP.HCM','2003-05-29','user52@example.com','0912345052','2025-12-13 13:50:53','2025-12-13 13:50:53'),(53,'111 Đường Lê Quý Đôn, Phường 1, Vũng Tàu, Bà Rịa - Vũng Tàu','1994-06-30','user53@example.com','0912345053','2025-12-13 13:50:53','2025-12-13 13:50:53'),(54,'66 Đường Hùng Vương, Phường Thới Bình, Ninh Kiều, Cần Thơ','1995-07-01','user54@example.com','0912345054','2025-12-13 13:50:53','2025-12-13 13:50:53'),(55,'205 Đường Phạm Ngọc Thạch, Phường Hiệp Thành, Thủ Dầu Một, Bình Dương','1996-08-02','user55@example.com','0912345055','2025-12-13 13:50:53','2025-12-13 13:50:53'),(56,'17 Đường Cách Mạng Tháng Tám, Phường 3, Tây Ninh','1997-09-03','user56@example.com','0912345056','2025-12-13 13:50:53','2025-12-13 13:50:53'),(57,'80/7 Phố Trần Khát Chân, Hai Bà Trưng, Hà Nội','1998-10-04','user57@example.com','0912345057','2025-12-13 13:50:53','2025-12-13 13:50:53'),(58,'120/15 Đường Hoàng Văn Thụ, Phường 9, Phú Nhuận, TP.HCM','1999-11-05','user58@example.com','0912345058','2025-12-13 13:50:53','2025-12-13 13:50:53'),(59,'50 Đường Tiểu La, Phường Hòa Cường Bắc, Hải Châu, Đà Nẵng','2000-12-06','user59@example.com','0912345059','2025-12-13 13:50:53','2025-12-13 13:50:53'),(60,'25 Đường Tô Hiệu, Lê Chân, Hải Phòng','2001-01-07','user60@example.com','0912345060','2025-12-13 13:50:53','2025-12-13 13:50:53'),(61,'10 Đường Pasteur, Phường Xương Huân, Nha Trang, Khánh Hòa','2002-02-08','user61@example.com','0912345061','2025-12-13 13:50:53','2025-12-13 13:50:53'),(62,'44 Đường Phan Bội Châu, Phường Phú Hội, Huế','2003-03-09','user62@example.com','0912345062','2025-12-13 13:50:53','2025-12-13 13:50:53'),(63,'98 Đường Nguyễn Trãi, Phường Cái Khế, Ninh Kiều, Cần Thơ','1994-04-10','user63@example.com','0912345063','2025-12-13 13:50:53','2025-12-13 13:50:53'),(64,'40 Đường Trương Công Định, Phường 3, Vũng Tàu, Bà Rịa - Vũng Tàu','1995-05-11','user64@example.com','0912345064','2025-12-13 13:50:53','2025-12-13 13:50:53'),(65,'112 Đường Trần Phú, Phường Cái Khế, Ninh Kiều, Cần Thơ','1996-06-12','user65@example.com','0912345065','2025-12-13 13:50:53','2025-12-13 13:50:53'),(66,'22 Đường Đồng Khởi, Phường Phú Khương, TP. Bến Tre','1997-07-13','user66@example.com','0912345066','2025-12-13 13:50:53','2025-12-13 13:50:53'),(67,'16 Đường Nguyễn Du, Phường Mỹ Long, Long Xuyên, An Giang','1998-08-14','user67@example.com','0912345067','2025-12-13 13:50:53','2025-12-13 13:50:53'),(68,'75 Đường Phan Đình Phùng, Phường 1, Đà Lạt, Lâm Đồng','1999-09-15','user68@example.com','0912345068','2025-12-13 13:50:53','2025-12-13 13:50:53'),(69,'33 Đường 3 Tháng 2, Phường Vĩnh Lạc, Rạch Giá, Kiên Giang','2000-10-16','user69@example.com','0912345069','2025-12-13 13:50:53','2025-12-13 13:50:53'),(70,'15 Đường Nguyễn Hữu Cảnh, Phường 22, Bình Thạnh, TP.HCM','2001-11-17','user70@example.com','0912345070','2025-12-13 13:50:53','2025-12-13 13:50:53'),(71,'8 Đường Quốc Lộ 9, Phường 5, Đông Hà, Quảng Trị','2002-12-18','user71@example.com','0912345071','2025-12-13 13:50:53','2025-12-13 13:50:53'),(72,'100 Đường Trần Hưng Đạo, Phường Đại Phúc, Bắc Ninh','2003-01-19','user72@example.com','0912345072','2025-12-13 13:50:53','2025-12-13 13:50:53'),(73,'40 Đường Huỳnh Văn Nghệ, Phường 1, Tây Ninh','1994-02-20','user73@example.com','0912345073','2025-12-13 13:50:53','2025-12-13 13:50:53'),(60024,'Hà Nội','2000-12-12','thanhwww102@gmail.com','0366315518','2025-12-15 14:44:49','2025-12-15 14:44:49'),(90024,'HN','2012-12-12','xuan123@gmail.com','0987654320','2025-12-20 04:40:29','2025-12-20 04:40:29');
/*!40000 ALTER TABLE `resume` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role`
--

DROP TABLE IF EXISTS `role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(150) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notes` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=30003;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role`
--

LOCK TABLES `role` WRITE;
/*!40000 ALTER TABLE `role` DISABLE KEYS */;
INSERT INTO `role` VALUES (1,'admin','người quản lý','2025-09-18 11:15:07','2025-09-18 11:15:07'),(2,'user','người dùng','2025-09-18 11:15:07','2025-09-18 11:15:07');
/*!40000 ALTER TABLE `role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role_of_event`
--

DROP TABLE IF EXISTS `role_of_event`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role_of_event` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `max_member` int(11) DEFAULT NULL,
  `norm` float DEFAULT NULL,
  `role_of_event` int(11) DEFAULT NULL,
  `id_operating_standard_2` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */,
  KEY `FK6jxx9afy5d1hguj02tgwi7cd0` (`id_operating_standard_2`),
  CONSTRAINT `FK6jxx9afy5d1hguj02tgwi7cd0` FOREIGN KEY (`id_operating_standard_2`) REFERENCES `nckh`.`operating_standards_2` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=30047;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role_of_event`
--

LOCK TABLES `role_of_event` WRITE;
/*!40000 ALTER TABLE `role_of_event` DISABLE KEYS */;
INSERT INTO `role_of_event` VALUES (1,NULL,10,4,1,'2025-09-18 11:15:07','2025-09-18 11:15:07'),(2,NULL,5,4,2,'2025-09-18 11:15:07','2025-09-18 11:15:07'),(3,NULL,100,4,3,'2025-09-18 11:15:07','2025-09-18 11:15:07'),(4,NULL,60,4,4,'2025-09-18 11:15:07','2025-09-18 11:15:07'),(5,NULL,20,4,5,'2025-09-18 11:15:07','2025-09-18 11:15:07'),(6,NULL,10,4,6,'2025-09-18 11:15:07','2025-09-18 11:15:07'),(7,NULL,50,4,7,'2025-09-18 11:15:07','2025-09-18 11:15:07'),(8,NULL,30,4,8,'2025-09-18 11:15:07','2025-09-18 11:15:07'),(9,NULL,20,4,9,'2025-09-18 11:15:07','2025-09-18 11:15:07'),(10,NULL,210,4,10,'2025-09-18 11:15:07','2025-09-18 11:15:07'),(11,NULL,140,4,11,'2025-09-18 11:15:07','2025-09-18 11:15:07'),(12,NULL,70,4,12,'2025-09-18 11:15:07','2025-09-18 11:15:07'),(13,NULL,70,4,13,'2025-09-18 11:15:07','2025-09-18 11:15:07'),(14,NULL,1,4,14,'2025-09-18 11:15:07','2025-09-18 11:15:07'),(15,NULL,40,4,15,'2025-09-18 11:15:07','2025-09-18 11:15:07'),(16,NULL,40,4,16,'2025-09-18 11:15:07','2025-09-18 11:15:07'),(17,NULL,25,4,17,'2025-09-18 11:15:07','2025-09-18 11:15:07'),(18,NULL,15,4,18,'2025-09-18 11:15:07','2025-09-18 11:15:07'),(19,NULL,10,4,19,'2025-09-18 11:15:07','2025-09-18 11:15:07'),(20,NULL,10,4,20,'2025-09-18 11:15:07','2025-09-18 11:15:07'),(21,NULL,10,4,21,'2025-09-18 11:15:07','2025-09-18 11:15:07'),(22,NULL,10,4,22,'2025-09-18 11:15:07','2025-09-18 11:15:07'),(23,NULL,5,4,23,'2025-09-18 11:15:07','2025-09-18 11:15:07'),(24,NULL,2.5,4,24,'2025-09-18 11:15:07','2025-09-18 11:15:07'),(25,NULL,5,4,40,'2025-09-18 11:15:07','2025-09-18 11:15:07'),(26,NULL,90,1,25,'2025-09-18 11:15:07','2025-09-18 11:15:07'),(27,NULL,40,2,25,'2025-09-18 11:15:07','2025-09-18 11:15:07'),(28,8,150,3,25,'2025-09-18 11:15:07','2025-09-18 11:15:07'),(29,NULL,70,1,26,'2025-09-18 11:15:07','2025-09-18 11:15:07'),(30,NULL,30,2,26,'2025-09-18 11:15:07','2025-09-18 11:15:07'),(31,8,110,3,26,'2025-09-18 11:15:07','2025-09-18 11:15:07'),(32,NULL,40,1,27,'2025-09-18 11:15:07','2025-09-18 11:15:07'),(33,5,50,3,27,'2025-09-18 11:15:07','2025-09-18 11:15:07'),(34,NULL,15,1,28,'2025-09-18 11:15:07','2025-09-18 11:15:07'),(35,4,25,3,28,'2025-09-18 11:15:07','2025-09-18 11:15:07'),(36,NULL,15,4,29,'2025-09-18 11:15:07','2025-09-18 11:15:07'),(37,NULL,20,4,30,'2025-09-18 11:15:07','2025-09-18 11:15:07'),(38,NULL,15,4,31,'2025-09-18 11:15:07','2025-09-18 11:15:07'),(39,NULL,80,4,32,'2025-09-18 11:15:07','2025-09-18 11:15:07'),(40,NULL,120,4,33,'2025-09-18 11:15:07','2025-09-18 11:15:07'),(41,NULL,10,4,34,'2025-09-18 11:15:07','2025-09-18 11:15:07'),(42,NULL,100,4,35,'2025-09-18 11:15:07','2025-09-18 11:15:07'),(43,NULL,30,4,36,'2025-09-18 11:15:07','2025-09-18 11:15:07'),(44,NULL,40,4,37,'2025-09-18 11:15:07','2025-09-18 11:15:07'),(45,NULL,20,4,38,'2025-09-18 11:15:07','2025-09-18 11:15:07'),(46,NULL,1,4,39,'2025-09-18 11:15:07','2025-09-18 11:15:07');
/*!40000 ALTER TABLE `role_of_event` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `room`
--

DROP TABLE IF EXISTS `room`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `room` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `room_name` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=30004;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `room`
--

LOCK TABLES `room` WRITE;
/*!40000 ALTER TABLE `room` DISABLE KEYS */;
INSERT INTO `room` VALUES (1,'Phòng 207, Giảng Đường Nguyễn Đăng','Hội trường A','2025-09-18 11:15:07','2025-09-18 11:15:07'),(2,'Nhà Hành Chính','Hội trường C','2025-09-18 11:15:07','2025-09-18 11:15:07'),(3,'Phòng 323, Tầng 3, Tòa Nhà Bùi Huy Đáp','Phòng Vinh Quang','2025-09-18 11:15:07','2025-09-18 11:15:07');
/*!40000 ALTER TABLE `room` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `seminar`
--

DROP TABLE IF EXISTS `seminar`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seminar` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `article_link` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `id_event` int(11) DEFAULT NULL,
  `main_author` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `minutes_of_meeting` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `presentation_file` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `seminar_photo` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=30014;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `seminar`
--

LOCK TABLES `seminar` WRITE;
/*!40000 ALTER TABLE `seminar` DISABLE KEYS */;
INSERT INTO `seminar` VALUES (1,'abc.com',1,'Phạm Thị Lan Anh','BB Seminar 30.9.24.pdf','Web 4.0.pptx','z5861478531794_41dc1b8ad34c03ec6217e54efa8b62c5.jpg','2025-09-18 11:15:07','2025-09-18 11:15:07'),(2,'https://fita.vnua.edu.vn/seminar-khoa-hoc-nghien-cuu-xay-dung-bo-co-so-du-lieu-phan-tich-trang-thai-cam-xuc-khuon-mat/',11,'Lương Minh Quân','BB Seminar 20.5.24.pdf','Seminar_T5_2024.pdf','12345-1536x864 (1).jpg','2025-09-18 11:15:07','2025-09-18 11:15:07'),(3,'https://fita.vnua.edu.vn/seminar-khoa-hoc-nghien-cuu-xay-dung-tram-do-danh-gia-muc-do-o-nhiem-bang-cong-nghe-iot/',12,'Lương Minh Quân','BB Seminar 9.9.24.pdf','Seminar_T6_6-9-2024_v1 (1).pptx','z5861235015522_d2305d24ae8322f043ef1dacbea8bac6.jpg','2025-09-18 11:15:07','2025-09-18 11:15:07'),(4,'https://fita.vnua.edu.vn/seminar-phuong-phap-nghien-cuu-khoa-hoc-va-dinh-huong-nghien-cuu-ung-dung-cntt-trong-nong-nghiep/',13,'Nguyễn Xuân Thảo','BB Seminar 11.4.24.pdf','BC_Mô hình ra quyết định mờ nhóm và UD.pptx','z5336907071695_d3ce9f2da78346ed07ed7a5c1ca0cb39-1536x1152.jpg','2025-09-18 11:15:07','2025-09-18 11:15:07'),(5,'https://fita.vnua.edu.vn/khoa-cong-nghe-thong-tin-to-chuc-seminar-khoa-hoc-so-luoc-ve-ky-thuat-dung-anh-tu-song-sieu-am/',14,'Nguyễn Trọng Kương','BB Seminar 13.5.24.pdf','IVUS imaging.pdf','z5448960280247_b579d3b872bb16e4dd2479847f35a158.jpg','2025-09-18 11:15:07','2025-09-18 11:15:07'),(6,'https://fita.vnua.edu.vn/seminar-gioi-thieu-giai-phap-xay-dung-phan-mem-ho-tro-cong-tac-quan-ly-day-va-hoc-cap-bo-mon/',15,'Vũ Thị Lưu','BB Seminar 30.9.24.pdf','06-12-2024Seminar_Vtluu-2024.pdf','z5881100562717_434e162670dae0f854d1956f1a299cd3-1536x1152.jpg','2025-09-18 11:15:07','2025-09-18 11:15:07'),(7,'https://fita.vnua.edu.vn/seminar-thang-12-cua-nhom-ncm-ung-dung-cong-nghe-thong-tin-trong-nong-nghiep/',16,'Lê Thị Nhung','BB Seminar T12.pdf','07_Phat hien ong mang phan tu hinh anh va van de mat can bang du lieu_Le Thi Nhung_24-12-2024.pdf','z6160543669423_92ccadcc7bc13d4eefb29a4da4516631.jpg','2025-09-18 11:15:07','2025-09-18 11:15:07'),(8,'https://fita.vnua.edu.vn/seminar-thang-12-cua-nhom-ncm-ung-dung-cong-nghe-thong-tin-trong-nong-nghiep/',17,'Hoàng Thị Hà','BB Seminar T12.pdf','Seminar_IT_BA.pdf','z6160543341416_22d399697e2e6b72232dd59c3e1f5834.jpg','2025-09-18 11:15:07','2025-09-18 11:15:07'),(9,'https://fita.vnua.edu.vn/seminar-thang-12-cua-nhom-ncm-ung-dung-cong-nghe-thong-tin-trong-nong-nghiep/',18,'Trần Trung Hiếu','BB Seminar T12.pdf','Bao cao seminar_TTHieu.pdf','z6160543482685_bc31428c12b050abe22a8daa27807c15.jpg','2025-09-18 11:15:07','2025-09-18 11:15:07'),(11,'https://fita.vnua.edu.vn/seminar-khoa-hoc-nghien-cuu-xay-dung-bo-co-so-du-lieu-phan-tich-trang-thai-cam-xuc-khuon-mat/',55,'Ngô Văn Minh','MÔI TRƯỜNG VĨ MÔ.docx','MÔI TRƯỜNG VĨ MÔ.docx','12345-1536x864 (1).jpg','2025-09-18 11:15:07','2025-09-18 11:15:07'),(12,'',58,'ádasdasd',NULL,NULL,NULL,'2025-11-22 17:05:07','2025-11-22 17:05:07'),(13,NULL,59,'ád',NULL,NULL,'/file/event-banner-3f7a66b4-201c-4102-8ecb-bff3a9ef5576.jpg','2025-11-22 22:25:06','2025-11-22 22:25:06');
/*!40000 ALTER TABLE `seminar` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student_research_guidance`
--

DROP TABLE IF EXISTS `student_research_guidance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student_research_guidance` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `end_time` date DEFAULT NULL,
  `id_event` int(11) DEFAULT NULL,
  `result` int(11) DEFAULT NULL,
  `start_time` date DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `supervisor_name` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=30006;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student_research_guidance`
--

LOCK TABLES `student_research_guidance` WRITE;
/*!40000 ALTER TABLE `student_research_guidance` DISABLE KEYS */;
INSERT INTO `student_research_guidance` VALUES (1,'2024-12-01',41,NULL,'2024-01-01',2,'Phạm Thị Lan Anh','2025-09-18 11:15:07','2025-09-18 11:15:07'),(2,'2024-12-01',42,NULL,'2024-01-01',2,'Vũ Thị Lưu','2025-09-18 11:15:07','2025-09-18 11:15:07'),(3,'2024-12-01',44,NULL,'2024-01-01',2,'Phạm Quang Dũng','2025-09-18 11:15:07','2025-09-18 11:15:07'),(4,'2024-12-01',45,NULL,'2024-01-01',2,'Nguyễn Trọng Kương','2025-09-18 11:15:07','2025-09-18 11:15:07'),(5,'2024-12-01',46,NULL,'2024-01-01',2,'Hoàng Thị Hà','2025-09-18 11:15:07','2025-09-18 11:15:07');
/*!40000 ALTER TABLE `student_research_guidance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `time`
--

DROP TABLE IF EXISTS `time`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `time` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `time` time(6) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=30014;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `time`
--

LOCK TABLES `time` WRITE;
/*!40000 ALTER TABLE `time` DISABLE KEYS */;
INSERT INTO `time` VALUES (1,'07:00:00.000000','2025-09-18 11:15:07','2025-09-18 11:15:07'),(2,'07:55:00.000000','2025-09-18 11:15:07','2025-09-18 11:15:07'),(3,'08:50:00.000000','2025-09-18 11:15:07','2025-09-18 11:15:07'),(4,'09:55:00.000000','2025-09-18 11:15:07','2025-09-18 11:15:07'),(5,'10:50:00.000000','2025-09-18 11:15:07','2025-09-18 11:15:07'),(6,'12:45:00.000000','2025-09-18 11:15:07','2025-09-18 11:15:07'),(7,'13:40:00.000000','2025-09-18 11:15:07','2025-09-18 11:15:07'),(8,'14:35:00.000000','2025-09-18 11:15:07','2025-09-18 11:15:07'),(9,'15:40:00.000000','2025-09-18 11:15:07','2025-09-18 11:15:07'),(10,'16:35:00.000000','2025-09-18 11:15:07','2025-09-18 11:15:07'),(11,'18:00:00.000000','2025-09-18 11:15:07','2025-09-18 11:15:07'),(12,'18:55:00.000000','2025-09-18 11:15:07','2025-09-18 11:15:07'),(13,'19:50:00.000000','2025-09-18 11:15:07','2025-09-18 11:15:07');
/*!40000 ALTER TABLE `time` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `time_conversion`
--

DROP TABLE IF EXISTS `time_conversion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `time_conversion` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `criteria` varchar(250) DEFAULT NULL,
  `norm` int(11) NOT NULL,
  `unit` varchar(150) DEFAULT NULL,
  `id_type_of_criteria` int(11) NOT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */,
  KEY `FKiruyr0y4ig3r1l6mvo5w8ehcy` (`id_type_of_criteria`),
  CONSTRAINT `FKiruyr0y4ig3r1l6mvo5w8ehcy` FOREIGN KEY (`id_type_of_criteria`) REFERENCES `nckh`.`type_of_criteria` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `time_conversion`
--

LOCK TABLES `time_conversion` WRITE;
/*!40000 ALTER TABLE `time_conversion` DISABLE KEYS */;
/*!40000 ALTER TABLE `time_conversion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `title`
--

DROP TABLE IF EXISTS `title`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `title` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `total_norm` int(11) DEFAULT NULL COMMENT 'Tong dinh muc voi tung vai tro',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=30006;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `title`
--

LOCK TABLES `title` WRITE;
/*!40000 ALTER TABLE `title` DISABLE KEYS */;
INSERT INTO `title` VALUES (1,'GS_PGS',300,'2025-09-18 11:15:07','2025-09-18 11:15:07'),(2,'TS',220,'2025-09-18 11:15:07','2025-09-18 11:15:07'),(3,'THS',140,'2025-09-18 11:15:07','2025-09-18 11:15:07'),(4,'KS_CN',70,'2025-09-18 11:15:07','2025-09-18 11:15:07'),(5,'Sinh Viên',0,'2025-10-04 17:04:51','2025-10-04 17:04:51');
/*!40000 ALTER TABLE `title` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `type_of_criteria`
--

DROP TABLE IF EXISTS `type_of_criteria`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `type_of_criteria` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `is_event` bit(1) DEFAULT NULL,
  `name` varchar(256) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=30014;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `type_of_criteria`
--

LOCK TABLES `type_of_criteria` WRITE;
/*!40000 ALTER TABLE `type_of_criteria` DISABLE KEYS */;
INSERT INTO `type_of_criteria` VALUES (1,_binary '','Seminar','2025-09-18 11:15:07','2025-09-18 11:15:07'),(2,_binary '','Hội thảo','2025-09-18 11:15:07','2025-09-18 11:15:07'),(3,_binary '\0','Bài báo quốc tế','2025-09-18 11:15:07','2025-09-18 11:15:07'),(4,_binary '\0','Bài báo tiếng việt','2025-09-18 11:15:07','2025-09-18 11:15:07'),(5,_binary '\0','Bài tham luận hội thảo đăng kỉ yếu ','2025-09-18 11:15:07','2025-09-18 11:15:07'),(6,_binary '\0','Bài tổng quan về lĩnh vực nghiên cứu','2025-09-18 11:15:07','2025-09-18 11:15:07'),(7,_binary '\0','Các hoạt động tư vấn/ Hướng dẫn kỹ thuật/ Bản tin KH&CN đăng trên website học viện','2025-09-18 11:15:07','2025-09-18 11:15:07'),(8,_binary '\0','Quy trình kỹ thuật/ Tiến bộ kỹ thuật/ Tiêu chuẩn kỹ thuật được công nhận cấp cơ sở ','2025-09-18 11:15:07','2025-09-18 11:15:07'),(9,_binary '\0','Đề xuất nhiệm vụ NCKH','2025-09-18 11:15:07','2025-09-18 11:15:07'),(10,_binary '\0','Nhiệm vụ KH&CN được phê duyệt','2025-09-18 11:15:07','2025-09-18 11:15:07'),(11,_binary '','Tham dự hội đồng tư vấn khoa học tư vấn định hướng nghiên cứu, xây dựng các thuyết minh đề tài,dự án','2025-09-18 11:15:07','2025-09-18 11:15:07'),(12,_binary '','Tham dự Seminar/ chuyên đề do chuyên gia (quốc tế, trong nước, cơ quan quản lí, doanh nghiệp, ...) trình bày','2025-09-18 11:15:07','2025-09-18 11:15:07'),(13,_binary '\0','Xây dựng và triển khai các đề án/ Nhiệm vụ KH&CN của học viện ','2025-09-18 11:15:07','2025-09-18 11:15:07');
/*!40000 ALTER TABLE `type_of_criteria` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `power` int(11) DEFAULT NULL,
  `username` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `id_role` int(11) DEFAULT NULL,
  `id_title` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `in_active` bit(1) DEFAULT NULL,
  `is_deleted` bit(1) DEFAULT NULL,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `id_resume` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */,
  UNIQUE KEY `UK85q9amtvotcvfw8vumwqgmrq1` (`id_resume`),
  KEY `FK6njoh3pti5jnlkowken3r8ttn` (`id_role`),
  KEY `FKcl9l9ffbtooorchjhw8ffn8t` (`id_title`),
  CONSTRAINT `FK6njoh3pti5jnlkowken3r8ttn` FOREIGN KEY (`id_role`) REFERENCES `nckh`.`role` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FKcl9l9ffbtooorchjhw8ffn8t` FOREIGN KEY (`id_title`) REFERENCES `nckh`.`title` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FKkkm0203s4cjg4axp58dalec9k` FOREIGN KEY (`id_resume`) REFERENCES `nckh`.`resume` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=120042;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'Ngô Văn Minh','03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4',4,'6660555',2,5,'2025-09-06 20:46:21',_binary '\0',_binary '','2025-11-05 21:51:06',2),(2,'Phạm Thị Lan Anh','a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3',3,'00409002109',2,3,'2025-09-06 20:50:42',_binary '',_binary '\0','2025-11-15 23:14:02',3),(18,'Hoàng Thị Hà','a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3',3,'00409001013',2,3,'2025-09-06 20:50:42',_binary '\0',_binary '\0','2025-11-02 13:29:00',5),(19,'Lê Thị Nhung','a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3',3,'00400601292',2,3,'2025-09-06 20:50:42',_binary '\0',_binary '\0','2025-09-06 20:50:42',6),(20,'Lương Minh Quân','a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3',3,'00400401180',2,3,'2025-09-06 20:50:42',_binary '\0',_binary '\0','2025-09-06 20:50:42',7),(21,'Nguyễn Hữu Hải','a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3',3,'00409001819',2,3,'2025-09-06 20:50:42',_binary '\0',_binary '\0','2025-11-04 11:59:31',8),(22,'Nguyễn Trọng Kương','a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3',2,'00401001532',2,2,'2025-09-06 20:50:42',_binary '\0',_binary '\0','2025-09-06 20:50:42',9),(23,'Nguyễn Xuân Thảo','a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3',3,'00409001649',2,3,'2025-09-06 20:50:42',_binary '\0',_binary '\0','2025-09-06 20:50:42',10),(24,'Phạm Quang Dũng','a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3',1,'00400601082',2,2,'2025-09-06 20:50:42',_binary '\0',_binary '\0','2025-09-06 20:50:42',11),(25,'Trần Trung Hiếu','a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3',3,'00409001645',2,3,'2025-09-06 20:50:42',_binary '\0',_binary '\0','2025-09-06 20:50:42',12),(26,'Vũ Thị Lưu','a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3',3,'00409001588',2,3,'2025-09-06 20:50:42',_binary '\0',_binary '\0','2025-09-06 20:50:42',13),(31,'Admin','240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9',3,'admin',1,5,'2025-09-06 20:57:07',_binary '\0',_binary '\0','2025-12-15 14:40:38',1),(36,'Le Duong','240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9',4,'admin22',1,5,'2025-11-04 11:57:17',_binary '\0',_binary '\0','2025-11-07 23:14:25',18),(39,'Asd Fs','588804abd17c2b01c25a11d30729e211ad0b2ef0e42aee95060ecb23a3d4d2f2',4,'duong',2,5,'2025-11-07 23:16:17',_binary '\0',_binary '\0','2025-12-13 13:54:29',21),(40,'Manager','925ffdbd4036d405b65dccc2ceab9235093502365875b4ee7fafc594ffb39937',4,'manager456',2,2,'2025-11-09 14:57:55',_binary '\0',_binary '\0','2025-12-07 06:28:35',22),(41,'Dasdas Adsa','47cd4a3841783c01db7cf7580bebf5b8697c5a9047be28631411cfdd939e9b81',4,'asdasd',2,5,'2025-11-09 14:58:26',_binary '\0',_binary '\0','2025-11-09 14:58:26',23),(42,'Trần Minh Hải','588804abd17c2b01c25a11d30729e211ad0b2ef0e42aee95060ecb23a3d4d2f2',3,'67000',2,4,'2025-12-13 14:03:40',_binary '\0',_binary '\0','2025-12-13 14:03:40',24),(43,'Lê Thị Thu','588804abd17c2b01c25a11d30729e211ad0b2ef0e42aee95060ecb23a3d4d2f2',2,'67001',2,1,'2025-12-13 14:03:40',_binary '\0',_binary '\0','2025-12-13 14:03:40',25),(44,'Phạm Văn Long','588804abd17c2b01c25a11d30729e211ad0b2ef0e42aee95060ecb23a3d4d2f2',4,'67002',2,5,'2025-12-13 14:03:40',_binary '\0',_binary '\0','2025-12-13 14:03:40',26),(45,'Nguyễn Thanh Tùng','588804abd17c2b01c25a11d30729e211ad0b2ef0e42aee95060ecb23a3d4d2f2',3,'67003',2,2,'2025-12-13 14:03:40',_binary '\0',_binary '\0','2025-12-13 14:03:40',27),(46,'Bùi Thị Lan','588804abd17c2b01c25a11d30729e211ad0b2ef0e42aee95060ecb23a3d4d2f2',2,'67004',2,3,'2025-12-13 14:03:40',_binary '\0',_binary '\0','2025-12-13 14:03:40',28),(47,'Đỗ Khắc Trung','588804abd17c2b01c25a11d30729e211ad0b2ef0e42aee95060ecb23a3d4d2f2',4,'67005',2,4,'2025-12-13 14:03:40',_binary '\0',_binary '\0','2025-12-13 14:03:40',29),(48,'Võ Minh Nhật','588804abd17c2b01c25a11d30729e211ad0b2ef0e42aee95060ecb23a3d4d2f2',3,'67006',2,1,'2025-12-13 14:03:40',_binary '\0',_binary '\0','2025-12-13 14:03:40',30),(49,'Hồ Ngọc Ánh','588804abd17c2b01c25a11d30729e211ad0b2ef0e42aee95060ecb23a3d4d2f2',2,'67007',2,5,'2025-12-13 14:03:40',_binary '\0',_binary '\0','2025-12-13 14:03:40',31),(50,'Đặng Duy Khanh','588804abd17c2b01c25a11d30729e211ad0b2ef0e42aee95060ecb23a3d4d2f2',4,'67008',2,2,'2025-12-13 14:03:40',_binary '\0',_binary '\0','2025-12-13 14:03:40',32),(51,'Mai Văn Cường','588804abd17c2b01c25a11d30729e211ad0b2ef0e42aee95060ecb23a3d4d2f2',3,'67009',2,3,'2025-12-13 14:03:40',_binary '\0',_binary '\0','2025-12-13 14:03:40',33),(52,'Huỳnh Tấn Phát','588804abd17c2b01c25a11d30729e211ad0b2ef0e42aee95060ecb23a3d4d2f2',2,'67010',2,4,'2025-12-13 14:03:40',_binary '\0',_binary '\0','2025-12-13 14:03:40',34),(53,'Dương Mỹ Linh','588804abd17c2b01c25a11d30729e211ad0b2ef0e42aee95060ecb23a3d4d2f2',4,'67011',2,1,'2025-12-13 14:03:40',_binary '\0',_binary '\0','2025-12-13 14:03:40',35),(54,'Tống Đình Nghĩa','588804abd17c2b01c25a11d30729e211ad0b2ef0e42aee95060ecb23a3d4d2f2',3,'67012',2,5,'2025-12-13 14:03:40',_binary '\0',_binary '\0','2025-12-13 14:03:40',36),(55,'Ngô Gia Huy','588804abd17c2b01c25a11d30729e211ad0b2ef0e42aee95060ecb23a3d4d2f2',2,'67013',2,2,'2025-12-13 14:03:40',_binary '\0',_binary '\0','2025-12-13 14:03:40',37),(56,'Cao Thị Phương','588804abd17c2b01c25a11d30729e211ad0b2ef0e42aee95060ecb23a3d4d2f2',4,'67014',2,3,'2025-12-13 14:03:40',_binary '\0',_binary '\0','2025-12-13 14:03:40',38),(57,'Hoàng Đình Đức','588804abd17c2b01c25a11d30729e211ad0b2ef0e42aee95060ecb23a3d4d2f2',3,'67015',2,4,'2025-12-13 14:03:40',_binary '\0',_binary '\0','2025-12-13 14:03:40',39),(58,'Lý Hoàng Nam','588804abd17c2b01c25a11d30729e211ad0b2ef0e42aee95060ecb23a3d4d2f2',2,'67016',2,1,'2025-12-13 14:03:40',_binary '\0',_binary '\0','2025-12-13 14:03:40',40),(59,'Phan Văn Hưng','588804abd17c2b01c25a11d30729e211ad0b2ef0e42aee95060ecb23a3d4d2f2',4,'67017',2,5,'2025-12-13 14:03:40',_binary '\0',_binary '\0','2025-12-13 14:03:40',41),(60,'Nguyễn Anh Khoa','588804abd17c2b01c25a11d30729e211ad0b2ef0e42aee95060ecb23a3d4d2f2',3,'67018',2,2,'2025-12-13 14:03:40',_binary '\0',_binary '\0','2025-12-13 14:03:40',42),(61,'Vũ Thị Ngọc','588804abd17c2b01c25a11d30729e211ad0b2ef0e42aee95060ecb23a3d4d2f2',2,'67019',2,3,'2025-12-13 14:03:40',_binary '\0',_binary '\0','2025-12-13 14:03:40',43),(62,'Trần Minh Khang','588804abd17c2b01c25a11d30729e211ad0b2ef0e42aee95060ecb23a3d4d2f2',4,'67020',2,4,'2025-12-13 14:03:40',_binary '\0',_binary '\0','2025-12-13 14:03:40',44),(63,'Lê Văn Tài','588804abd17c2b01c25a11d30729e211ad0b2ef0e42aee95060ecb23a3d4d2f2',3,'67021',2,1,'2025-12-13 14:03:40',_binary '\0',_binary '\0','2025-12-13 14:03:40',45),(64,'Phạm Thị Mai','588804abd17c2b01c25a11d30729e211ad0b2ef0e42aee95060ecb23a3d4d2f2',2,'67022',2,5,'2025-12-13 14:03:40',_binary '\0',_binary '\0','2025-12-13 14:03:40',46),(65,'Nguyễn Hoàng Lân','588804abd17c2b01c25a11d30729e211ad0b2ef0e42aee95060ecb23a3d4d2f2',4,'67023',2,2,'2025-12-13 14:03:40',_binary '\0',_binary '\0','2025-12-13 14:03:40',47),(66,'Bùi Văn Đạt','588804abd17c2b01c25a11d30729e211ad0b2ef0e42aee95060ecb23a3d4d2f2',3,'67024',2,3,'2025-12-13 14:03:40',_binary '\0',_binary '\0','2025-12-13 14:03:40',48),(67,'Đỗ Thị Hiền','588804abd17c2b01c25a11d30729e211ad0b2ef0e42aee95060ecb23a3d4d2f2',2,'67025',2,4,'2025-12-13 14:03:40',_binary '\0',_binary '\0','2025-12-13 14:03:40',49),(68,'Võ Hoàng Quân','588804abd17c2b01c25a11d30729e211ad0b2ef0e42aee95060ecb23a3d4d2f2',4,'67026',2,1,'2025-12-13 14:03:40',_binary '\0',_binary '\0','2025-12-13 14:03:40',50),(69,'Hồ Viết An','588804abd17c2b01c25a11d30729e211ad0b2ef0e42aee95060ecb23a3d4d2f2',3,'67027',2,5,'2025-12-13 14:03:40',_binary '\0',_binary '\0','2025-12-13 14:03:40',51),(70,'Đặng Thị Thảo','588804abd17c2b01c25a11d30729e211ad0b2ef0e42aee95060ecb23a3d4d2f2',2,'67028',2,2,'2025-12-13 14:03:40',_binary '\0',_binary '\0','2025-12-13 14:03:40',52),(71,'Mai Đình Công','588804abd17c2b01c25a11d30729e211ad0b2ef0e42aee95060ecb23a3d4d2f2',4,'67029',2,3,'2025-12-13 14:03:40',_binary '\0',_binary '\0','2025-12-13 14:03:40',53),(72,'Huỳnh Văn Thành','588804abd17c2b01c25a11d30729e211ad0b2ef0e42aee95060ecb23a3d4d2f2',3,'67030',2,4,'2025-12-13 14:03:40',_binary '\0',_binary '\0','2025-12-13 14:03:40',54),(73,'Dương Gia Hân','588804abd17c2b01c25a11d30729e211ad0b2ef0e42aee95060ecb23a3d4d2f2',2,'67031',2,1,'2025-12-13 14:03:40',_binary '\0',_binary '\0','2025-12-13 14:03:40',55),(74,'Tống Minh Quân','588804abd17c2b01c25a11d30729e211ad0b2ef0e42aee95060ecb23a3d4d2f2',4,'67032',2,5,'2025-12-13 14:03:40',_binary '\0',_binary '\0','2025-12-13 14:03:40',56),(75,'Ngô Văn Tín','588804abd17c2b01c25a11d30729e211ad0b2ef0e42aee95060ecb23a3d4d2f2',3,'67033',2,2,'2025-12-13 14:03:40',_binary '\0',_binary '\0','2025-12-13 14:03:40',57),(76,'Cao Thanh Hùng','588804abd17c2b01c25a11d30729e211ad0b2ef0e42aee95060ecb23a3d4d2f2',2,'67034',2,3,'2025-12-13 14:03:40',_binary '\0',_binary '\0','2025-12-13 14:03:40',58),(77,'Hoàng Thị Yến','588804abd17c2b01c25a11d30729e211ad0b2ef0e42aee95060ecb23a3d4d2f2',4,'67035',2,4,'2025-12-13 14:03:40',_binary '\0',_binary '\0','2025-12-13 14:03:40',59),(78,'Lý Văn Phúc','588804abd17c2b01c25a11d30729e211ad0b2ef0e42aee95060ecb23a3d4d2f2',3,'67036',2,1,'2025-12-13 14:03:40',_binary '\0',_binary '\0','2025-12-13 14:03:40',60),(79,'Phan Thị Kim','588804abd17c2b01c25a11d30729e211ad0b2ef0e42aee95060ecb23a3d4d2f2',2,'67037',2,5,'2025-12-13 14:03:40',_binary '\0',_binary '\0','2025-12-13 14:03:40',61),(80,'Nguyễn Tuấn Kiệt','588804abd17c2b01c25a11d30729e211ad0b2ef0e42aee95060ecb23a3d4d2f2',4,'67038',2,2,'2025-12-13 14:03:40',_binary '\0',_binary '\0','2025-12-13 14:03:40',62),(81,'Vũ Đình Mạnh','588804abd17c2b01c25a11d30729e211ad0b2ef0e42aee95060ecb23a3d4d2f2',3,'67039',2,3,'2025-12-13 14:03:40',_binary '\0',_binary '\0','2025-12-13 14:03:40',63),(82,'Trần Đức Thiện','588804abd17c2b01c25a11d30729e211ad0b2ef0e42aee95060ecb23a3d4d2f2',2,'67040',2,4,'2025-12-13 14:03:40',_binary '\0',_binary '\0','2025-12-13 14:03:40',64),(83,'Lê Thị Hà','588804abd17c2b01c25a11d30729e211ad0b2ef0e42aee95060ecb23a3d4d2f2',4,'67041',2,1,'2025-12-13 14:03:40',_binary '\0',_binary '\0','2025-12-13 14:03:40',65),(84,'Phạm Văn Nam','588804abd17c2b01c25a11d30729e211ad0b2ef0e42aee95060ecb23a3d4d2f2',3,'67042',2,5,'2025-12-13 14:03:40',_binary '\0',_binary '\0','2025-12-13 14:03:40',66),(85,'Nguyễn Đình Phong','588804abd17c2b01c25a11d30729e211ad0b2ef0e42aee95060ecb23a3d4d2f2',2,'67043',2,2,'2025-12-13 14:03:40',_binary '\0',_binary '\0','2025-12-13 14:03:40',67),(86,'Bùi Thị Hồng','588804abd17c2b01c25a11d30729e211ad0b2ef0e42aee95060ecb23a3d4d2f2',4,'67044',2,3,'2025-12-13 14:03:40',_binary '\0',_binary '\0','2025-12-13 14:03:40',68),(87,'Đỗ Văn Cường','588804abd17c2b01c25a11d30729e211ad0b2ef0e42aee95060ecb23a3d4d2f2',3,'67045',2,4,'2025-12-13 14:03:40',_binary '\0',_binary '\0','2025-12-13 14:03:40',69),(88,'Võ Thị Lệ','588804abd17c2b01c25a11d30729e211ad0b2ef0e42aee95060ecb23a3d4d2f2',2,'67046',2,1,'2025-12-13 14:03:40',_binary '\0',_binary '\0','2025-12-13 14:03:40',70),(89,'Hồ Văn Trung','588804abd17c2b01c25a11d30729e211ad0b2ef0e42aee95060ecb23a3d4d2f2',4,'67047',2,5,'2025-12-13 14:03:40',_binary '\0',_binary '\0','2025-12-13 14:03:40',71),(90,'Đặng Minh Châu','588804abd17c2b01c25a11d30729e211ad0b2ef0e42aee95060ecb23a3d4d2f2',3,'67048',2,2,'2025-12-13 14:03:40',_binary '\0',_binary '\0','2025-12-13 14:03:40',72),(91,'Mai Văn Thắng','588804abd17c2b01c25a11d30729e211ad0b2ef0e42aee95060ecb23a3d4d2f2',2,'67049',2,3,'2025-12-13 14:03:40',_binary '\0',_binary '\0','2025-12-13 14:03:40',73),(60042,'Nguyễn Văn Thành','1d3301d1380e962fd75b9b135de76496881673cb1879eba547ad9cb26745ebfe',4,'671887',2,5,'2025-12-15 14:44:49',_binary '\0',_binary '\0','2025-12-15 14:44:49',60024),(90042,'Nguyễn Xuân Sang','b0c564d3c5f89b0e6e93076738c868bfc447c0adba3975adc252ccc4feef47f2',2,'670000',2,2,'2025-12-20 04:40:29',_binary '\0',_binary '\0','2025-12-20 04:40:29',90024);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_infor_ncm`
--

DROP TABLE IF EXISTS `user_infor_ncm`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_infor_ncm` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `date_in` date DEFAULT NULL,
  `date_out` date DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `id_group` int(11) DEFAULT NULL,
  `id_user` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */,
  KEY `FKhvue6xoswhyx71l7w5wyp5phj` (`id_group`),
  KEY `FK86rn9dqs7c1vpauvobjg1uu7h` (`id_user`),
  CONSTRAINT `FK86rn9dqs7c1vpauvobjg1uu7h` FOREIGN KEY (`id_user`) REFERENCES `nckh`.`user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FKhvue6xoswhyx71l7w5wyp5phj` FOREIGN KEY (`id_group`) REFERENCES `nckh`.`group` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_infor_ncm`
--

LOCK TABLES `user_infor_ncm` WRITE;
/*!40000 ALTER TABLE `user_infor_ncm` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_infor_ncm` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vietnamese_paper`
--

DROP TABLE IF EXISTS `vietnamese_paper`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vietnamese_paper` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `article_link` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `id_event` int(11) DEFAULT NULL,
  `main_author` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=30003;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vietnamese_paper`
--

LOCK TABLES `vietnamese_paper` WRITE;
/*!40000 ALTER TABLE `vietnamese_paper` DISABLE KEYS */;
INSERT INTO `vietnamese_paper` VALUES (1,'https://start.spring.io/',3,'Phạm Thị Lan Anh',3,'2025-09-18 11:15:07','2025-09-18 11:15:07'),(2,'https://start.spring.io/',26,'Vũ Thị Lưu',3,'2025-09-18 11:15:07','2025-09-18 11:15:07');
/*!40000 ALTER TABLE `vietnamese_paper` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-24 23:13:43
