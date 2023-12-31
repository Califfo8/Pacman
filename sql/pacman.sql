-- Progettazione Web 
DROP DATABASE if exists califano_616510; 
CREATE DATABASE califano_616510; 
USE califano_616510; 
-- MySQL dump 10.13  Distrib 5.7.28, for Win64 (x86_64)
--
-- Host: localhost    Database: pacman
-- ------------------------------------------------------
-- Server version	5.7.28

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `scoreboard`
--

DROP TABLE IF EXISTS `scoreboard`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `scoreboard` (
  `username` varchar(255) NOT NULL DEFAULT '',
  `score` bigint(20) DEFAULT '0',
  `data` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`username`,`data`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `scoreboard`
--

LOCK TABLES `scoreboard` WRITE;
/*!40000 ALTER TABLE `scoreboard` DISABLE KEYS */;
INSERT INTO `scoreboard` VALUES ('first lady',2050,'2023-05-30 18:46:01'),('first lady',4160,'2023-05-31 13:55:38'),('first lady',2110,'2023-05-31 14:17:22'),('il presidente',2680,'2023-06-01 16:45:47'),('il presidente',970,'2023-06-01 16:46:01'),('kratos',3000000,'2023-06-01 17:14:16'),('luigi',3590,'2023-06-01 17:09:32'),('luigi',80,'2023-06-01 17:10:01'),('luigi',1230,'2023-06-01 17:10:06'),('mario',16000,'2023-06-01 17:11:04'),('tizio bello',320,'2023-06-01 17:11:50'),('tizio brutto',2,'2023-06-01 17:15:09'),('tommaso',900,'2023-06-01 17:02:19'),('tommaso',50,'2023-06-01 17:02:33'),('tommaso',50,'2023-06-01 17:02:42'),('tommaso',910,'2023-06-01 17:02:50'),('tommaso',3910,'2023-06-01 17:02:56'),('tommaso',110,'2023-06-01 17:03:03'),('tommaso',350,'2023-06-01 17:03:10'),('tommaso',110,'2023-06-01 17:03:17'),('tommaso',90,'2023-06-01 17:03:22'),('tommaso',110,'2023-06-01 17:03:29'),('tommaso',110,'2023-06-01 17:03:35'),('tommaso',2220,'2023-06-01 17:43:08'),('tommaso',4400,'2023-06-01 17:48:29'),('tommaso',50,'2023-06-01 18:13:28'),('tommaso',50,'2023-06-01 18:16:23');
/*!40000 ALTER TABLE `scoreboard` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `username` varchar(255) NOT NULL DEFAULT '',
  `password` varchar(255) NOT NULL DEFAULT '',
  `ban` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('admin','$2y$10$7XP6Z6oBj2brXC26lOgHYOwJBkkjLn.eH6X/DNZudFq.xwK4uOoOG',0),('first lady','$2y$10$KmqX74/MY99zhJYk4NkOqO/mIe/xMsg8L5Eq4pSt5FUdBaNlRcJ5S',0),('giraffa98','$2y$10$HgkPZl5mhcqp.1DyRSP0/eDFLEpd01QvndiI.vQ1Un0ddXsYG5hE6',0),('il presidente','$2y$10$7pWf2GA7AuTzZTE2kK.n8u1a/2dqHQF1.de/.XI4JHcAHy0oiGg9O',0),('kratos','$2y$10$CvLWD7UY0z1p4aQIL.viy.XU.RPNpucgK0Tuqyqa7DIMVa47r/oQ.',0),('luigi','$2y$10$JAGEZ0/8GodEyBUgHrdBVuW6pa2T6UsonQrHIz3SC/jGUfU.m7gRO',0),('mario','$2y$10$q3tLYOs264RUmSOcp49gjO54kvOsJhnyPc2wdCejN1NqkpaEAstq6',0),('tizio bello','$2y$10$Ds3nTjk9XpIJ3/tIjkVO7O3IzBYXp.N6rvZ.wN0vXrnGfObFEZq12',1),('tizio brutto','$2y$10$5GakTdEZMZGjq1VArOmAtuaZM2dWdpaAqD1zHAjGD8gA7OepUloUG',1),('tommaso','$2y$10$LEkRx.7cxJwuybxKnmAGoOsk/r8JHXg/he2Zz8reUjUQn5IxyD8iq',0);
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

-- Dump completed on 2023-06-02 18:50:42
