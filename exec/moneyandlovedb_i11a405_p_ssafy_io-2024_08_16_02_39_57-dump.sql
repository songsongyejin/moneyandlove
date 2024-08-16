-- MySQL dump 10.13  Distrib 8.0.35, for macos13 (arm64)
--
-- Host: i11a405.p.ssafy.io    Database: moneyandlovedb
-- ------------------------------------------------------
-- Server version	8.0.33

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `alarm`
--

DROP TABLE IF EXISTS `alarm`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `alarm` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `message` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `alarm`
--

LOCK TABLES `alarm` WRITE;
/*!40000 ALTER TABLE `alarm` DISABLE KEYS */;
/*!40000 ALTER TABLE `alarm` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `attendance`
--

DROP TABLE IF EXISTS `attendance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attendance` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `attendance_date` date DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK46cuxphi3uh5quom51s6i2q8x` (`user_id`),
  CONSTRAINT `FK46cuxphi3uh5quom51s6i2q8x` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attendance`
--

LOCK TABLES `attendance` WRITE;
/*!40000 ALTER TABLE `attendance` DISABLE KEYS */;
INSERT INTO `attendance` VALUES (2,'2024-08-10 06:21:25.283398','2024-08-10 06:21:25.283398','2024-08-10',15),(3,'2024-08-11 07:37:29.969414','2024-08-11 07:37:29.969414','2024-08-11',15),(9,'2024-08-12 05:53:54.448743','2024-08-12 05:53:54.448743','2024-08-12',15),(12,'2024-08-13 00:23:44.317451','2024-08-13 00:23:44.317451','2024-08-13',15),(20,'2024-08-14 00:29:53.279348','2024-08-14 00:29:53.279348','2024-08-14',15),(27,'2024-08-14 13:45:16.731542','2024-08-14 13:45:16.731542','2024-08-14',34),(32,'2024-08-15 08:05:02.611566','2024-08-15 08:05:02.611566','2024-08-15',42),(33,'2024-08-15 08:12:07.537629','2024-08-15 08:12:07.537629','2024-08-15',15),(34,'2024-08-15 08:51:33.536077','2024-08-15 08:51:33.536077','2024-08-15',40),(35,'2024-08-15 14:17:19.321563','2024-08-15 14:17:19.321563','2024-08-15',34),(38,'2024-08-15 15:36:18.820248','2024-08-15 15:36:18.820248','2024-08-15',45),(41,'2024-08-15 17:08:10.583617','2024-08-15 17:08:10.583617','2024-08-15',48);
/*!40000 ALTER TABLE `attendance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chat_room`
--

DROP TABLE IF EXISTS `chat_room`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chat_room` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `from_user_id` bigint DEFAULT NULL,
  `to_user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKa81vi4wve7dd5psfylradqerg` (`to_user_id`),
  KEY `FKdc9edbpesphm7c5qjaplcx2hi` (`from_user_id`),
  CONSTRAINT `FKa81vi4wve7dd5psfylradqerg` FOREIGN KEY (`to_user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `FKdc9edbpesphm7c5qjaplcx2hi` FOREIGN KEY (`from_user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chat_room`
--

LOCK TABLES `chat_room` WRITE;
/*!40000 ALTER TABLE `chat_room` DISABLE KEYS */;
INSERT INTO `chat_room` VALUES (29,'2024-08-15 09:56:25.534081','2024-08-15 09:56:25.534081',42,15),(31,'2024-08-15 09:59:03.253530','2024-08-15 09:59:03.253530',40,15),(36,'2024-08-15 17:11:28.163021','2024-08-15 17:11:28.163021',45,48);
/*!40000 ALTER TABLE `chat_room` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `face`
--

DROP TABLE IF EXISTS `face`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `face` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `face_auth` int NOT NULL,
  `face_score` int NOT NULL,
  `montageurl` varchar(255) DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_drsryp1t14et2kyvmgfgjxot1` (`user_id`),
  CONSTRAINT `FKtw6l595sef32gav007u4b1qv` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `face`
--

LOCK TABLES `face` WRITE;
/*!40000 ALTER TABLE `face` DISABLE KEYS */;
INSERT INTO `face` VALUES (11,'2024-08-10 06:20:12.192391','2024-08-14 14:44:44.382914',0,85,'https://moneyandlove-s3-bucket.s3.ap-northeast-2.amazonaws.com/montage/38328938-68ca-4ae8-99c6-77c72cf69e76-22709415-82a7-4737-becb-0bf16567ac6a.png',15),(18,'2024-08-14 06:10:11.068988','2024-08-14 06:41:16.446183',0,0,'https://moneyandlove-s3-bucket.s3.ap-northeast-2.amazonaws.com/montage/7ecc82ab-31e5-4805-a1fb-ec0328796040-aa0dee2d-835d-4342-900b-0432b7d6e6e7.png',26),(26,'2024-08-14 13:44:53.882509','2024-08-15 14:19:10.103368',0,54,'https://moneyandlove-s3-bucket.s3.ap-northeast-2.amazonaws.com/montage/ba02fc14-3da6-4fb1-a53f-d4dabef0e6c7-9002c335-2694-4209-91e3-8d033d362d60.png',34),(32,'2024-08-15 07:59:22.286862','2024-08-15 08:01:21.714808',0,76,'https://moneyandlove-s3-bucket.s3.ap-northeast-2.amazonaws.com/montage/3c33baff-5820-4459-b343-fb10316e87a9-953b4fac-300c-43e9-9148-e665c064afb9.png',40),(34,'2024-08-15 08:04:30.020267','2024-08-15 08:12:27.840152',0,52,'https://moneyandlove-s3-bucket.s3.ap-northeast-2.amazonaws.com/montage/f9d96e92-90e1-43f1-97e3-d58fa13a49f2-e592cee0-da0d-410d-b519-1d2d2aaca3fe.png',42),(35,'2024-08-15 12:41:46.802029','2024-08-15 12:46:43.626372',0,42,'https://moneyandlove-s3-bucket.s3.ap-northeast-2.amazonaws.com/montage/1aaaca67-bdaf-41d2-90e0-d649de59ba98-f7922693-96f3-43dc-a0a7-cfc0eb98c781.png',43),(37,'2024-08-15 15:10:23.490808','2024-08-15 15:10:57.112567',0,84,'https://moneyandlove-s3-bucket.s3.ap-northeast-2.amazonaws.com/montage/f018bea8-4ed5-4d92-a1d4-3d818fa873e7-18b71f09-b113-4c3e-9fb6-eb05399f9ddd.png',45),(40,'2024-08-15 17:08:04.457540','2024-08-15 17:19:00.936007',0,52,'https://moneyandlove-s3-bucket.s3.ap-northeast-2.amazonaws.com/montage/65f2ca7a-b882-4d8e-96fc-be9f506f1dcf-78e38094-a473-46c3-8ec1-46099c1cffaa.png',48);
/*!40000 ALTER TABLE `face` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `friend`
--

DROP TABLE IF EXISTS `friend`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `friend` (
  `friend_id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `follower_id` bigint DEFAULT NULL,
  `following_id` bigint DEFAULT NULL,
  PRIMARY KEY (`friend_id`),
  KEY `FKcssr1pehjsl6uj51bhlj57au4` (`following_id`),
  KEY `FKeki75k6w4miqtwaeeg2geohl5` (`follower_id`),
  CONSTRAINT `FKcssr1pehjsl6uj51bhlj57au4` FOREIGN KEY (`following_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `FKeki75k6w4miqtwaeeg2geohl5` FOREIGN KEY (`follower_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `friend`
--

LOCK TABLES `friend` WRITE;
/*!40000 ALTER TABLE `friend` DISABLE KEYS */;
INSERT INTO `friend` VALUES (33,'2024-08-15 09:56:14.900953','2024-08-15 09:56:14.900953',15,42),(34,'2024-08-15 09:56:25.523053','2024-08-15 09:56:25.523053',42,15),(35,'2024-08-15 09:58:56.803575','2024-08-15 09:58:56.803575',15,40),(36,'2024-08-15 09:59:03.246149','2024-08-15 09:59:03.246149',40,15),(41,'2024-08-15 17:11:28.151170','2024-08-15 17:11:28.151170',45,48),(42,'2024-08-15 17:11:30.140270','2024-08-15 17:11:30.140270',48,45);
/*!40000 ALTER TABLE `friend` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `game_history`
--

DROP TABLE IF EXISTS `game_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `game_history` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `from_user_select_type` enum('LOVE','MONEY') DEFAULT NULL,
  `to_user_select_type` enum('LOVE','MONEY') DEFAULT NULL,
  `from_user_id` bigint DEFAULT NULL,
  `to_user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK60nhjoesuxjyi1ofgakkgu0nx` (`from_user_id`),
  KEY `FKovoojjuu2fk835uxymyn5diya` (`to_user_id`),
  CONSTRAINT `FK60nhjoesuxjyi1ofgakkgu0nx` FOREIGN KEY (`from_user_id`) REFERENCES `user` (`user_id`),
  CONSTRAINT `FKovoojjuu2fk835uxymyn5diya` FOREIGN KEY (`to_user_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `game_history`
--

LOCK TABLES `game_history` WRITE;
/*!40000 ALTER TABLE `game_history` DISABLE KEYS */;
/*!40000 ALTER TABLE `game_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ranking`
--

DROP TABLE IF EXISTS `ranking`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ranking` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `rank_point` bigint DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_aucygnu7i292wgrhikhgbogu7` (`user_id`),
  CONSTRAINT `FKehvphu7jeof7k2ha7p3osmf6i` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ranking`
--

LOCK TABLES `ranking` WRITE;
/*!40000 ALTER TABLE `ranking` DISABLE KEYS */;
INSERT INTO `ranking` VALUES (17,'2024-08-10 06:20:12.185299','2024-08-15 13:03:15.202140',300,15),(24,'2024-08-14 06:10:11.063408','2024-08-14 06:10:11.063408',100,26),(32,'2024-08-14 13:44:53.879744','2024-08-14 13:44:53.879744',200,34),(38,'2024-08-15 07:59:22.279734','2024-08-15 07:59:22.279734',900,40),(40,'2024-08-15 08:04:30.016877','2024-08-15 13:24:01.429868',200,42),(41,'2024-08-15 12:41:46.796741','2024-08-15 12:41:46.796741',800,43),(43,'2024-08-15 15:10:23.488467','2024-08-15 15:10:23.488467',0,45),(46,'2024-08-15 17:08:04.449264','2024-08-15 17:08:04.449264',0,48);
/*!40000 ALTER TABLE `ranking` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `user_id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `age` int NOT NULL,
  `email` varchar(255) NOT NULL,
  `game_point` bigint NOT NULL,
  `gender` enum('FEMALE','MALE') DEFAULT NULL,
  `kakao_id` bigint NOT NULL,
  `nickname` varchar(255) DEFAULT NULL,
  `profile_url` varchar(255) DEFAULT NULL,
  `region` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `UK_ob8kqyqqgmefl0aco34akdtpe` (`email`),
  UNIQUE KEY `UK_4tp32nb01jmfcirpipti37lfs` (`kakao_id`)
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (15,'2024-08-10 06:20:12.158906','2024-08-15 16:02:14.662294',26,'ohj220@gmail.com',7940900,'MALE',3658678225,'남자오현진','http://t1.kakaocdn.net/account_images/default_profile.jpeg.twg.thumb.R640x640','안양'),(26,'2024-08-14 06:10:11.050732','2024-08-14 07:03:06.599012',24,'yun9869@naver.com',99999999899,'FEMALE',3663998547,'채오니','http://t1.kakaocdn.net/account_images/default_profile.jpeg.twg.thumb.R640x640','경기도광주'),(34,'2024-08-14 13:44:53.875485','2024-08-15 14:17:19.375552',24,'jth121091@gmail.com',1000000099,'MALE',3664576348,'태호롤로','http://t1.kakaocdn.net/account_images/default_profile.jpeg.twg.thumb.R640x640','서울'),(40,'2024-08-15 07:59:22.253937','2024-08-15 12:53:35.091410',26,'yaejin5195@naver.com',900,'FEMALE',3651424160,'파송송','http://k.kakaocdn.net/dn/Z6kYc/btsI4VaAJPK/bP5UMD1lR7ApH9je6egcx1/img_640x640.jpg','용인'),(42,'2024-08-15 08:04:30.012258','2024-08-15 16:02:14.662168',26,'ohj220@naver.com',99999998699,'FEMALE',3651647741,'여현진','http://k.kakaocdn.net/dn/bfH9k1/btsI5sFu6Ga/5aw1P365bKF9hnpj1Ugwdk/img_640x640.jpg','안양'),(43,'2024-08-15 12:41:46.792800','2024-08-15 13:13:55.795795',25,'jjw981210@naver.com',600,'MALE',3642138550,'지환짱','http://k.kakaocdn.net/dn/heGCx/btsGBjec2qg/uOVQOcmzFiihmsDzw3K0a1/img_640x640.jpg','잠실'),(45,'2024-08-15 15:10:23.485025','2024-08-15 17:23:35.963403',26,'imagen33@daum.net',89999999400,'FEMALE',3643279506,'얼짱규빈','http://k.kakaocdn.net/dn/xEz1u/btrSbSWW1VW/pVR3m9tcFuQHEWFJS4rjt1/img_640x640.jpg','신림'),(48,'2024-08-15 17:08:04.420317','2024-08-15 17:23:34.190978',20,'test1@naver.com',200,'MALE',3647898839,'asdfasdf','http://t1.kakaocdn.net/account_images/default_profile.jpeg.twg.thumb.R640x640','서울');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `whats_it_to_ya`
--

DROP TABLE IF EXISTS `whats_it_to_ya`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `whats_it_to_ya` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `word` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=351 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `whats_it_to_ya`
--

LOCK TABLES `whats_it_to_ya` WRITE;
/*!40000 ALTER TABLE `whats_it_to_ya` DISABLE KEYS */;
INSERT INTO `whats_it_to_ya` VALUES (1,NULL,NULL,'행복'),(2,NULL,NULL,'슬픔'),(3,NULL,NULL,'사랑'),(4,NULL,NULL,'미움'),(5,NULL,NULL,'웃음'),(6,NULL,NULL,'눈물'),(7,NULL,NULL,'기쁨'),(8,NULL,NULL,'분노'),(9,NULL,NULL,'놀람'),(10,NULL,NULL,'두려움'),(11,NULL,NULL,'용기'),(12,NULL,NULL,'희망'),(13,NULL,NULL,'절망'),(14,NULL,NULL,'열정'),(15,NULL,NULL,'지루함'),(16,NULL,NULL,'만족'),(17,NULL,NULL,'실망'),(18,NULL,NULL,'편안함'),(19,NULL,NULL,'불안'),(20,NULL,NULL,'기대'),(21,NULL,NULL,'상상'),(22,NULL,NULL,'꿈'),(23,NULL,NULL,'기억'),(24,NULL,NULL,'우정'),(25,NULL,NULL,'배신'),(26,NULL,NULL,'진실'),(27,NULL,NULL,'거짓말'),(28,NULL,NULL,'비밀'),(29,NULL,NULL,'복수'),(30,NULL,NULL,'용서'),(31,NULL,NULL,'성공'),(32,NULL,NULL,'실패'),(33,NULL,NULL,'도전'),(34,NULL,NULL,'인내'),(35,NULL,NULL,'노력'),(36,NULL,NULL,'운명'),(37,NULL,NULL,'선택'),(38,NULL,NULL,'기회'),(39,NULL,NULL,'재능'),(40,NULL,NULL,'희생'),(41,NULL,NULL,'감동'),(42,NULL,NULL,'행운'),(43,NULL,NULL,'불행'),(44,NULL,NULL,'감사'),(45,NULL,NULL,'무관심'),(46,NULL,NULL,'호기심'),(47,NULL,NULL,'흥미'),(48,NULL,NULL,'열등감'),(49,NULL,NULL,'자부심'),(50,NULL,NULL,'질투'),(51,NULL,NULL,'동경'),(52,NULL,NULL,'실수'),(53,NULL,NULL,'교훈'),(54,NULL,NULL,'발견'),(55,NULL,NULL,'발명'),(56,NULL,NULL,'창조'),(57,NULL,NULL,'모험'),(58,NULL,NULL,'여행'),(59,NULL,NULL,'휴식'),(60,NULL,NULL,'피로'),(61,NULL,NULL,'전통'),(62,NULL,NULL,'혁신'),(63,NULL,NULL,'발전'),(64,NULL,NULL,'퇴보'),(65,NULL,NULL,'평화'),(66,NULL,NULL,'갈등'),(67,NULL,NULL,'전쟁'),(68,NULL,NULL,'승리'),(69,NULL,NULL,'패배'),(70,NULL,NULL,'정의'),(71,NULL,NULL,'부정'),(72,NULL,NULL,'법'),(73,NULL,NULL,'규칙'),(74,NULL,NULL,'자유'),(75,NULL,NULL,'구속'),(76,NULL,NULL,'예술'),(77,NULL,NULL,'과학'),(78,NULL,NULL,'기술'),(79,NULL,NULL,'자연'),(80,NULL,NULL,'인공'),(81,NULL,NULL,'도시'),(82,NULL,NULL,'시골'),(83,NULL,NULL,'가족'),(84,NULL,NULL,'고독'),(85,NULL,NULL,'관계'),(86,NULL,NULL,'이별'),(87,NULL,NULL,'만남'),(88,NULL,NULL,'성장'),(89,NULL,NULL,'노화'),(90,NULL,NULL,'탄생'),(91,NULL,NULL,'죽음'),(92,NULL,NULL,'건강'),(93,NULL,NULL,'질병'),(94,NULL,NULL,'치료'),(95,NULL,NULL,'예방'),(96,NULL,NULL,'음식'),(97,NULL,NULL,'요리'),(98,NULL,NULL,'운동'),(99,NULL,NULL,'취미'),(100,NULL,NULL,'습관'),(101,NULL,NULL,'학습'),(102,NULL,NULL,'교육'),(103,NULL,NULL,'지식'),(104,NULL,NULL,'지혜'),(105,NULL,NULL,'정보'),(106,NULL,NULL,'통신'),(107,NULL,NULL,'언어'),(108,NULL,NULL,'문화'),(109,NULL,NULL,'전통'),(110,NULL,NULL,'현대'),(111,NULL,NULL,'미래'),(112,NULL,NULL,'과거'),(113,NULL,NULL,'현재'),(114,NULL,NULL,'시간'),(115,NULL,NULL,'공간'),(116,NULL,NULL,'세계'),(117,NULL,NULL,'우주'),(118,NULL,NULL,'지구'),(119,NULL,NULL,'환경'),(120,NULL,NULL,'기후'),(121,NULL,NULL,'날씨'),(122,NULL,NULL,'자연재해'),(123,NULL,NULL,'풍경'),(124,NULL,NULL,'동물'),(125,NULL,NULL,'식물'),(126,NULL,NULL,'생명'),(127,NULL,NULL,'진화'),(128,NULL,NULL,'멸종'),(129,NULL,NULL,'보호'),(130,NULL,NULL,'연구'),(131,NULL,NULL,'실험'),(132,NULL,NULL,'발견'),(133,NULL,NULL,'발명'),(134,NULL,NULL,'이론'),(135,NULL,NULL,'분석'),(136,NULL,NULL,'종합'),(137,NULL,NULL,'데이터'),(138,NULL,NULL,'통계'),(139,NULL,NULL,'수학'),(140,NULL,NULL,'물리'),(141,NULL,NULL,'화학'),(142,NULL,NULL,'생물'),(143,NULL,NULL,'지구과학'),(144,NULL,NULL,'천문학'),(145,NULL,NULL,'의학'),(146,NULL,NULL,'공학'),(147,NULL,NULL,'컴퓨터'),(148,NULL,NULL,'소프트웨어'),(149,NULL,NULL,'하드웨어'),(150,NULL,NULL,'인터넷'),(151,NULL,NULL,'네트워크'),(152,NULL,NULL,'보안'),(153,NULL,NULL,'인공지능'),(154,NULL,NULL,'로봇'),(155,NULL,NULL,'자동화'),(156,NULL,NULL,'가상현실'),(157,NULL,NULL,'증강현실'),(158,NULL,NULL,'게임'),(159,NULL,NULL,'엔터테인먼트'),(160,NULL,NULL,'음악'),(161,NULL,NULL,'영화'),(162,NULL,NULL,'드라마'),(163,NULL,NULL,'공연'),(164,NULL,NULL,'축제'),(165,NULL,NULL,'스포츠'),(166,NULL,NULL,'경주'),(167,NULL,NULL,'팀워크'),(168,NULL,NULL,'경쟁'),(169,NULL,NULL,'협력'),(170,NULL,NULL,'전략'),(171,NULL,NULL,'전술'),(172,NULL,NULL,'훈련'),(173,NULL,NULL,'기록'),(174,NULL,NULL,'목표'),(175,NULL,NULL,'계획'),(176,NULL,NULL,'실행'),(177,NULL,NULL,'성취'),(178,NULL,NULL,'실패'),(179,NULL,NULL,'분석'),(180,NULL,NULL,'평가'),(181,NULL,NULL,'피드백'),(182,NULL,NULL,'성장'),(183,NULL,NULL,'발전'),(184,NULL,NULL,'변화'),(185,NULL,NULL,'혁신'),(186,NULL,NULL,'전통'),(187,NULL,NULL,'보존'),(188,NULL,NULL,'복원'),(189,NULL,NULL,'재건'),(190,NULL,NULL,'창조'),(191,NULL,NULL,'파괴'),(192,NULL,NULL,'재생'),(193,NULL,NULL,'발전'),(194,NULL,NULL,'퇴보'),(195,NULL,NULL,'적응'),(196,NULL,NULL,'경쟁'),(197,NULL,NULL,'협력'),(198,NULL,NULL,'상생'),(199,NULL,NULL,'갈등'),(200,NULL,NULL,'해결'),(201,NULL,NULL,'문제'),(202,NULL,NULL,'기회'),(203,NULL,NULL,'위기'),(204,NULL,NULL,'극복'),(205,NULL,NULL,'도전'),(206,NULL,NULL,'모험'),(207,NULL,NULL,'안전'),(208,NULL,NULL,'위험'),(209,NULL,NULL,'보호'),(210,NULL,NULL,'방어'),(211,NULL,NULL,'공격'),(212,NULL,NULL,'전쟁'),(213,NULL,NULL,'평화'),(214,NULL,NULL,'협상'),(215,NULL,NULL,'타협'),(216,NULL,NULL,'양보'),(217,NULL,NULL,'승리'),(218,NULL,NULL,'패배'),(219,NULL,NULL,'영광'),(220,NULL,NULL,'수치'),(221,NULL,NULL,'명예'),(222,NULL,NULL,'불명예'),(223,NULL,NULL,'인정'),(224,NULL,NULL,'무시'),(225,NULL,NULL,'칭찬'),(226,NULL,NULL,'비판'),(227,NULL,NULL,'존경'),(228,NULL,NULL,'경멸'),(229,NULL,NULL,'사랑'),(230,NULL,NULL,'증오'),(231,NULL,NULL,'친절'),(232,NULL,NULL,'냉정'),(233,NULL,NULL,'열정'),(234,NULL,NULL,'무관심'),(235,NULL,NULL,'노력'),(236,NULL,NULL,'게으름'),(237,NULL,NULL,'성실'),(238,NULL,NULL,'불성실'),(239,NULL,NULL,'책임'),(240,NULL,NULL,'무책임'),(241,NULL,NULL,'신뢰'),(242,NULL,NULL,'불신'),(243,NULL,NULL,'정직'),(244,NULL,NULL,'거짓'),(245,NULL,NULL,'용기'),(246,NULL,NULL,'비겁'),(247,NULL,NULL,'희망'),(248,NULL,NULL,'절망'),(249,NULL,NULL,'기쁨'),(250,NULL,NULL,'슬픔'),(251,NULL,NULL,'행복'),(252,NULL,NULL,'불행'),(253,NULL,NULL,'만족'),(254,NULL,NULL,'불만'),(255,NULL,NULL,'성공'),(256,NULL,NULL,'실패'),(257,NULL,NULL,'도전'),(258,NULL,NULL,'포기'),(259,NULL,NULL,'성장'),(260,NULL,NULL,'정체'),(261,NULL,NULL,'발전'),(262,NULL,NULL,'퇴보'),(263,NULL,NULL,'생명'),(264,NULL,NULL,'죽음'),(265,NULL,NULL,'건강'),(266,NULL,NULL,'질병'),(267,NULL,NULL,'치료'),(268,NULL,NULL,'예방'),(269,NULL,NULL,'운동'),(270,NULL,NULL,'휴식'),(271,NULL,NULL,'식사'),(272,NULL,NULL,'간식'),(273,NULL,NULL,'아침'),(274,NULL,NULL,'점심'),(275,NULL,NULL,'저녁'),(276,NULL,NULL,'밤'),(277,NULL,NULL,'낮'),(278,NULL,NULL,'바다'),(279,NULL,NULL,'산'),(280,NULL,NULL,'하늘'),(281,NULL,NULL,'땅'),(282,NULL,NULL,'물'),(283,NULL,NULL,'불'),(284,NULL,NULL,'바람'),(285,NULL,NULL,'소리'),(286,NULL,NULL,'빛'),(287,NULL,NULL,'어둠'),(288,NULL,NULL,'그림자'),(289,NULL,NULL,'색깔'),(290,NULL,NULL,'모양'),(291,NULL,NULL,'크기'),(292,NULL,NULL,'공간'),(293,NULL,NULL,'시간'),(294,NULL,NULL,'과거'),(295,NULL,NULL,'현재'),(296,NULL,NULL,'미래'),(297,NULL,NULL,'시작'),(298,NULL,NULL,'끝'),(299,NULL,NULL,'전환'),(300,NULL,NULL,'변화'),(301,NULL,NULL,'피자'),(302,NULL,NULL,'햄버거'),(303,NULL,NULL,'파스타'),(304,NULL,NULL,'스시'),(305,NULL,NULL,'타코'),(306,NULL,NULL,'샐러드'),(307,NULL,NULL,'스테이크'),(308,NULL,NULL,'김치'),(309,NULL,NULL,'된장찌개'),(310,NULL,NULL,'불고기'),(311,NULL,NULL,'라면'),(312,NULL,NULL,'김밥'),(313,NULL,NULL,'떡볶이'),(314,NULL,NULL,'잡채'),(315,NULL,NULL,'비빔밥'),(316,NULL,NULL,'냉면'),(317,NULL,NULL,'삼겹살'),(318,NULL,NULL,'치킨'),(319,NULL,NULL,'튀김'),(320,NULL,NULL,'국수'),(321,NULL,NULL,'초밥'),(322,NULL,NULL,'회'),(323,NULL,NULL,'빵'),(324,NULL,NULL,'케이크'),(325,NULL,NULL,'쿠키'),(326,NULL,NULL,'아이스크림'),(327,NULL,NULL,'샌드위치'),(328,NULL,NULL,'토스트'),(329,NULL,NULL,'버섯전골'),(330,NULL,NULL,'갈비탕'),(331,NULL,NULL,'설렁탕'),(332,NULL,NULL,'부대찌개'),(333,NULL,NULL,'육개장'),(334,NULL,NULL,'감자탕'),(335,NULL,NULL,'된장국'),(336,NULL,NULL,'콩나물국밥'),(337,NULL,NULL,'순두부찌개'),(338,NULL,NULL,'잔치국수'),(339,NULL,NULL,'수제비'),(340,NULL,NULL,'칼국수'),(341,NULL,NULL,'해물찜'),(342,NULL,NULL,'매운탕'),(343,NULL,NULL,'닭갈비'),(344,NULL,NULL,'보쌈'),(345,NULL,NULL,'족발'),(346,NULL,NULL,'소불고기'),(347,NULL,NULL,'돈까스'),(348,NULL,NULL,'오징어볶음'),(349,NULL,NULL,'낙지볶음'),(350,NULL,NULL,'해물파전');
/*!40000 ALTER TABLE `whats_it_to_ya` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-08-16  2:39:59
