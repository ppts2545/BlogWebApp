-- MySQL dump 10.13  Distrib 8.0.42, for Linux (x86_64)
--
-- Host: localhost    Database: Blog_db
-- ------------------------------------------------------
-- Server version	8.0.42-0ubuntu0.24.04.1

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
-- Table structure for table `blog`
--

DROP TABLE IF EXISTS `blog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `blog` (
  `blog_id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `short_explain` varchar(255) DEFAULT NULL,
  `author_id` int NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `status` enum('draft','published','archived') DEFAULT 'draft',
  `tags` varchar(255) DEFAULT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `images` varchar(255) DEFAULT NULL,
  `content` longtext,
  PRIMARY KEY (`blog_id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `fk_user_id` (`author_id`),
  CONSTRAINT `fk_user_id` FOREIGN KEY (`author_id`) REFERENCES `users` (`author_id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blog`
--

LOCK TABLES `blog` WRITE;
/*!40000 ALTER TABLE `blog` DISABLE KEYS */;
INSERT INTO `blog` VALUES (14,'My Cartoon','My Favorite Cartoon.',1,'2025-05-15 09:55:41','2025-05-15 09:55:41','draft','Cartoon, Anime',NULL,NULL,NULL),(16,'WTF is this','WTF Happen to my life.',1,'2025-05-15 09:58:16','2025-05-15 09:58:16','draft','Wondering',NULL,NULL,NULL),(17,'MY Money.','My Money discuuss , how to manage money well.',1,'2025-05-15 10:07:53','2025-05-15 10:07:53','draft','Daily life, discuss',NULL,NULL,NULL),(19,'My Idols','daszdasdasdsad',3,'2025-05-16 14:03:30','2025-05-16 14:03:59','draft','KPOP idol',NULL,NULL,'asddasadsdasdsa'),(22,'My Kpop Idol.','KPop idol, KPOP, Motivation',3,'2025-05-16 16:47:33','2025-05-16 16:55:36','draft','IDOL, K-Pop',NULL,NULL,'safdaddasdas');
/*!40000 ALTER TABLE `blog` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `media`
--

DROP TABLE IF EXISTS `media`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `media` (
  `id` int NOT NULL AUTO_INCREMENT,
  `blog_id` int NOT NULL,
  `filename` varchar(255) DEFAULT NULL,
  `filepath` varchar(500) NOT NULL,
  `caption` text,
  `order_index` int DEFAULT '0',
  `uploaded_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `is_thumbnail` tinyint(1) DEFAULT '0',
  `media_type` enum('image','video','youtube','other') NOT NULL DEFAULT 'other',
  PRIMARY KEY (`id`),
  KEY `blog_id` (`blog_id`),
  CONSTRAINT `fk_media_blog` FOREIGN KEY (`blog_id`) REFERENCES `blog` (`blog_id`),
  CONSTRAINT `media_ibfk_1` FOREIGN KEY (`blog_id`) REFERENCES `blog` (`blog_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `media`
--

LOCK TABLES `media` WRITE;
/*!40000 ALTER TABLE `media` DISABLE KEYS */;
INSERT INTO `media` VALUES (7,14,'1747277741801-pokÃ©mon help line.jpeg','images/1747277741801-pokÃ©mon help line.jpeg',NULL,0,'2025-05-15 02:55:41',1,'image'),(9,16,'1747277896946-ranita.jpeg','images/1747277896946-ranita.jpeg',NULL,0,'2025-05-15 02:58:16',1,'image'),(10,17,'1747278473233-wallet.jpeg','images/1747278473233-wallet.jpeg',NULL,0,'2025-05-15 03:07:53',1,'image'),(13,19,'1747379010141-_ (3).jpeg','images/1747379010141-_ (3).jpeg',NULL,0,'2025-05-16 07:03:30',1,'image'),(14,19,'1747379039732-_ (1).jpeg','images/1747379039732-_ (1).jpeg',NULL,0,'2025-05-16 07:03:59',0,'image'),(15,19,'1747379039733-_ (1).jpeg','images/1747379039733-_ (1).jpeg',NULL,0,'2025-05-16 07:03:59',0,'image'),(20,22,'1747388853242-iu.jpeg','images/1747388853242-iu.jpeg',NULL,0,'2025-05-16 09:47:33',1,'image'),(21,22,'1747389336588-IU.jpeg','images/1747389336588-IU.jpeg',NULL,0,'2025-05-16 09:55:36',0,'image'),(22,22,'1747389336591-iu.jpeg','images/1747389336591-iu.jpeg',NULL,0,'2025-05-16 09:55:36',0,'image'),(23,22,'1747389336591-IU    Lee ji-eun.jpeg','images/1747389336591-IU    Lee ji-eun.jpeg',NULL,0,'2025-05-16 09:55:36',0,'image'),(24,22,'1747389336590-IU.jpeg','images/1747389336590-IU.jpeg',NULL,0,'2025-05-16 09:55:36',0,'image'),(25,22,'1747389336591-iu.jpeg','images/1747389336591-iu.jpeg',NULL,0,'2025-05-16 09:55:36',0,'image'),(26,22,'1747389336591-IU    Lee ji-eun.jpeg','images/1747389336591-IU    Lee ji-eun.jpeg',NULL,0,'2025-05-16 09:55:36',0,'image'),(27,22,NULL,'https://youtu.be/uS4iBiEs3Ew?si=gZNgkCXC-6tePJQ8',NULL,0,'2025-05-16 09:55:36',0,'youtube');
/*!40000 ALTER TABLE `media` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `author_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`author_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Poommy','ttppoomu@gmail.com','$2b$10$z1wn5Wo8OgMgJ8Z1pDilnuqiq1EdxgKPAPMgL8OuWaQ02sQGK480.'),(2,'','','$2b$10$ZalFRIg9U36hz9vrSUUZ1.fvMIatkxdqERPU3vY0itiEDHT2Izoxm'),(3,'John Wick','johnwick@gmail.com','$2b$10$hOLy.2idCxyCS.Xfok1fw.J3CNomvm4upD6.S0W2eBsJ94qHDnMwu');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-23 21:37:36
