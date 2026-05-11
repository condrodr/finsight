CREATE DATABASE  IF NOT EXISTS `finsight` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `finsight`;
-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: finsight
-- ------------------------------------------------------
-- Server version	8.0.46

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
-- Table structure for table `kategori`
--

DROP TABLE IF EXISTS `kategori`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `kategori` (
  `id_kategori` int NOT NULL AUTO_INCREMENT,
  `nama_kategori` varchar(100) NOT NULL,
  `jenis` enum('pendapatan','pengeluaran') NOT NULL,
  `kelompok_analisis` enum('pendapatan','kebutuhan','kewajiban','konsumtif','tabungan_investasi','lainnya') NOT NULL,
  `tanggal_dibuat` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_kategori`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kategori`
--

LOCK TABLES `kategori` WRITE;
/*!40000 ALTER TABLE `kategori` DISABLE KEYS */;
INSERT INTO `kategori` (`id_kategori`, `nama_kategori`, `jenis`, `kelompok_analisis`, `tanggal_dibuat`) VALUES (1,'Pendapatan','pendapatan','pendapatan','2026-04-24 07:15:07'),(2,'Belanja','pengeluaran','konsumtif','2026-04-24 07:15:07'),(3,'Belanja Bulanan','pengeluaran','kebutuhan','2026-04-24 07:15:07'),(4,'Hadiah & Amal','pengeluaran','lainnya','2026-04-24 07:15:07'),(5,'Hobi & Hiburan','pengeluaran','konsumtif','2026-04-24 07:15:07'),(6,'Kebutuhan Keluarga','pengeluaran','kebutuhan','2026-04-24 07:15:07'),(7,'Kesehatan & Perawatan Diri','pengeluaran','kebutuhan','2026-04-24 07:15:07'),(8,'Makan & Minuman','pengeluaran','kebutuhan','2026-04-24 07:15:07'),(9,'Olahraga','pengeluaran','konsumtif','2026-04-24 07:15:07'),(10,'Pendidikan','pengeluaran','kebutuhan','2026-04-24 07:15:07'),(11,'Pinjaman','pengeluaran','kewajiban','2026-04-24 07:15:07'),(12,'Tabungan & Investasi','pengeluaran','tabungan_investasi','2026-04-24 07:15:07'),(13,'Tagihan','pengeluaran','kewajiban','2026-04-24 07:15:07'),(14,'Transportasi','pengeluaran','kebutuhan','2026-04-24 07:15:07'),(15,'Travelling','pengeluaran','konsumtif','2026-04-24 07:15:07'),(16,'Lainnya','pengeluaran','lainnya','2026-04-24 07:15:07');
/*!40000 ALTER TABLE `kategori` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subkategori`
--

DROP TABLE IF EXISTS `subkategori`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subkategori` (
  `id_subkategori` int NOT NULL AUTO_INCREMENT,
  `id_kategori` int NOT NULL,
  `nama_subkategori` varchar(100) NOT NULL,
  `tanggal_dibuat` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_subkategori`),
  KEY `id_kategori` (`id_kategori`),
  CONSTRAINT `subkategori_ibfk_1` FOREIGN KEY (`id_kategori`) REFERENCES `kategori` (`id_kategori`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subkategori`
--

LOCK TABLES `subkategori` WRITE;
/*!40000 ALTER TABLE `subkategori` DISABLE KEYS */;
INSERT INTO `subkategori` (`id_subkategori`, `id_kategori`, `nama_subkategori`, `tanggal_dibuat`) VALUES (1,1,'Gaji','2026-04-24 07:15:13'),(2,1,'Bonus','2026-04-24 07:15:13'),(3,1,'Freelance','2026-04-24 07:15:13'),(4,1,'Bisnis','2026-04-24 07:15:13'),(5,1,'Pendapatan Lainnya','2026-04-24 07:15:13'),(6,2,'Fashion','2026-04-24 07:15:13'),(7,2,'Gadget & Elektronik','2026-04-24 07:15:13'),(8,2,'Peralatan Rumah Tangga','2026-04-24 07:15:13'),(9,4,'Hadiah','2026-04-24 07:15:13'),(10,4,'Amal / Sedekah','2026-04-24 07:15:13'),(11,5,'Buku','2026-04-24 07:15:13'),(12,5,'Film & Musik','2026-04-24 07:15:13'),(13,5,'Games','2026-04-24 07:15:13'),(14,5,'Hobi','2026-04-24 07:15:13'),(15,5,'Peliharaan','2026-04-24 07:15:13'),(16,6,'Anak','2026-04-24 07:15:13'),(17,6,'Orang Tua','2026-04-24 07:15:13'),(18,7,'Dokter & Rumah Sakit','2026-04-24 07:15:13'),(19,7,'Obat','2026-04-24 07:15:13'),(20,7,'Perawatan Diri','2026-04-24 07:15:13'),(21,8,'Camilan & Minuman','2026-04-24 07:15:13'),(22,8,'Makan Harian','2026-04-24 07:15:13'),(23,9,'Aktivitas Olahraga','2026-04-24 07:15:13'),(24,9,'Perlengkapan Olahraga','2026-04-24 07:15:13'),(25,10,'Biaya Sekolah','2026-04-24 07:15:13'),(26,10,'Kursus & Workshop','2026-04-24 07:15:13'),(27,10,'Perlengkapan Sekolah','2026-04-24 07:15:13'),(28,11,'Cicilan Mobil','2026-04-24 07:15:13'),(29,11,'Cicilan Rumah','2026-04-24 07:15:13'),(30,11,'Cicilan Motor','2026-04-24 07:15:13'),(31,11,'Kartu Kredit','2026-04-24 07:15:13'),(32,12,'Investasi','2026-04-24 07:15:13'),(33,12,'Tabungan','2026-04-24 07:15:13'),(34,13,'Asuransi','2026-04-24 07:15:13'),(35,13,'Listrik','2026-04-24 07:15:13'),(36,13,'Air','2026-04-24 07:15:13'),(37,13,'Gas','2026-04-24 07:15:13'),(38,13,'Pulsa & Data','2026-04-24 07:15:13'),(39,13,'TV & Internet','2026-04-24 07:15:13'),(40,14,'Bensin','2026-04-24 07:15:13'),(41,14,'Biaya Parkir & Tol','2026-04-24 07:15:13'),(42,14,'Servis Kendaraan','2026-04-24 07:15:13'),(43,14,'Transportasi Harian','2026-04-24 07:15:13'),(44,15,'Atraksi & Tur','2026-04-24 07:15:13'),(45,15,'Hotel & Villa','2026-04-24 07:15:13'),(46,15,'Transportasi Travelling','2026-04-24 07:15:13'),(47,16,'Top Up E-Wallet','2026-04-24 07:15:13'),(48,16,'Bayar Pajak','2026-04-24 07:15:13');
/*!40000 ALTER TABLE `subkategori` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transactions`
--

DROP TABLE IF EXISTS `transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transactions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `type` enum('income','expense') NOT NULL,
  `category` varchar(100) NOT NULL,
  `subcategory` varchar(100) DEFAULT NULL,
  `amount` decimal(15,2) NOT NULL,
  `description` text,
  `date` date NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transactions`
--

LOCK TABLES `transactions` WRITE;
/*!40000 ALTER TABLE `transactions` DISABLE KEYS */;
/*!40000 ALTER TABLE `transactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id_pengguna` int NOT NULL AUTO_INCREMENT,
  `nama` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `kata_sandi` varchar(255) NOT NULL,
  `tanggal_dibuat` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_pengguna`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` (`id`, `name`, `email`, `password`, `created_at`) VALUES (1,'Test User','testbaru@test.com','$2b$10$6i4bBQYRETqR5cF47qPYsuFJJhedoe9hTCp8XLM6WZuxgBtfdAU8K','2026-04-28 04:30:09'),(2,'Dewi C','dewi@gmail.com','$2b$10$SPOnj09XXrBg7jPxuXurauOrKNANYbwaP8c4mbAt0n0oT59OqCoIO','2026-04-28 04:30:20');
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

-- Dump completed on 2026-04-28 15:05:55