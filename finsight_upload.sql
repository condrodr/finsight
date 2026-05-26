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
-- Table structure for table `financial_health_results`
--

DROP TABLE IF EXISTS `financial_health_results`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `financial_health_results` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `period_year` year NOT NULL,
  `period_month` tinyint NOT NULL,
  `total_income` decimal(15,2) NOT NULL DEFAULT '0.00',
  `total_expense` decimal(15,2) NOT NULL DEFAULT '0.00',
  `total_saving_investment` decimal(15,2) NOT NULL DEFAULT '0.00',
  `total_debt_payment` decimal(15,2) NOT NULL DEFAULT '0.00',
  `total_consumptive_expense` decimal(15,2) NOT NULL DEFAULT '0.00',
  `transaction_count` int NOT NULL DEFAULT '0',
  `consumptive_transaction_count` int NOT NULL DEFAULT '0',
  `saving_ratio` decimal(8,4) NOT NULL DEFAULT '0.0000',
  `expense_ratio` decimal(8,4) NOT NULL DEFAULT '0.0000',
  `cash_flow` decimal(15,2) NOT NULL DEFAULT '0.00',
  `debt_ratio` decimal(8,4) NOT NULL DEFAULT '0.0000',
  `consumptive_ratio` decimal(8,4) NOT NULL DEFAULT '0.0000',
  `transaction_frequency_ratio` decimal(8,4) NOT NULL DEFAULT '0.0000',
  `saving_score` tinyint NOT NULL DEFAULT '1',
  `expense_score` tinyint NOT NULL DEFAULT '1',
  `cash_flow_score` tinyint NOT NULL DEFAULT '1',
  `debt_score` tinyint NOT NULL DEFAULT '1',
  `consumptive_score` tinyint NOT NULL DEFAULT '1',
  `frequency_score` tinyint NOT NULL DEFAULT '1',
  `budget_discipline_score` tinyint NOT NULL DEFAULT '1',
  `subjective_score` tinyint DEFAULT NULL,
  `total_indicator_score` decimal(6,2) NOT NULL DEFAULT '0.00',
  `max_indicator_score` decimal(6,2) NOT NULL DEFAULT '0.00',
  `financial_health_score` decimal(5,2) NOT NULL DEFAULT '0.00',
  `health_category` enum('Sangat Sehat','Sehat','Cukup','Berisiko','Tidak Sehat') NOT NULL DEFAULT 'Tidak Sehat',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_fhr_user_period` (`user_id`,`period_year`,`period_month`),
  KEY `idx_fhr_category` (`health_category`),
  CONSTRAINT `fhr_user_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `chk_fhr_month` CHECK ((`period_month` between 1 and 12)),
  CONSTRAINT `chk_fhr_ordinal_scores` CHECK (((`saving_score` between 1 and 5) and (`expense_score` between 1 and 5) and (`cash_flow_score` between 1 and 5) and (`debt_score` between 1 and 5) and (`consumptive_score` between 1 and 5) and (`frequency_score` between 1 and 5) and (`budget_discipline_score` between 1 and 5) and ((`subjective_score` is null) or (`subjective_score` between 1 and 5)))),
  CONSTRAINT `chk_fhr_score_range` CHECK ((`financial_health_score` between 0 and 100))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `financial_health_results`
--

LOCK TABLES `financial_health_results` WRITE;
/*!40000 ALTER TABLE `financial_health_results` DISABLE KEYS */;
/*!40000 ALTER TABLE `financial_health_results` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `insights`
--

DROP TABLE IF EXISTS `insights`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `insights` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `financial_health_result_id` int DEFAULT NULL,
  `insight_type` enum('objective','behavioral','subjective','trend','general') NOT NULL DEFAULT 'general',
  `title` varchar(150) NOT NULL,
  `message` text NOT NULL,
  `severity` enum('info','success','warning','danger') NOT NULL DEFAULT 'info',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_insights_user` (`user_id`),
  KEY `idx_insights_result` (`financial_health_result_id`),
  CONSTRAINT `insights_result_fk` FOREIGN KEY (`financial_health_result_id`) REFERENCES `financial_health_results` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `insights_user_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `insights`
--

LOCK TABLES `insights` WRITE;
/*!40000 ALTER TABLE `insights` DISABLE KEYS */;
/*!40000 ALTER TABLE `insights` ENABLE KEYS */;
UNLOCK TABLES;

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
  PRIMARY KEY (`id_kategori`),
  KEY `idx_kategori_jenis` (`jenis`),
  KEY `idx_kategori_kelompok_analisis` (`kelompok_analisis`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `kategori`
--

LOCK TABLES `kategori` WRITE;
/*!40000 ALTER TABLE `kategori` DISABLE KEYS */;
INSERT INTO `kategori` VALUES (1,'Pendapatan','pendapatan','pendapatan','2026-04-24 00:15:07'),(2,'Belanja','pengeluaran','konsumtif','2026-04-24 00:15:07'),(3,'Belanja Bulanan','pengeluaran','kebutuhan','2026-04-24 00:15:07'),(4,'Hadiah & Amal','pengeluaran','lainnya','2026-04-24 00:15:07'),(5,'Hobi & Hiburan','pengeluaran','konsumtif','2026-04-24 00:15:07'),(6,'Kebutuhan Keluarga','pengeluaran','kebutuhan','2026-04-24 00:15:07'),(7,'Kesehatan & Perawatan Diri','pengeluaran','kebutuhan','2026-04-24 00:15:07'),(8,'Makan & Minuman','pengeluaran','kebutuhan','2026-04-24 00:15:07'),(9,'Olahraga','pengeluaran','konsumtif','2026-04-24 00:15:07'),(10,'Pendidikan','pengeluaran','kebutuhan','2026-04-24 00:15:07'),(11,'Pinjaman','pengeluaran','kewajiban','2026-04-24 00:15:07'),(12,'Tabungan & Investasi','pengeluaran','tabungan_investasi','2026-04-24 00:15:07'),(13,'Tagihan','pengeluaran','kewajiban','2026-04-24 00:15:07'),(14,'Transportasi','pengeluaran','kebutuhan','2026-04-24 00:15:07'),(15,'Travelling','pengeluaran','konsumtif','2026-04-24 00:15:07'),(16,'Lainnya','pengeluaran','lainnya','2026-04-24 00:15:07');
/*!40000 ALTER TABLE `kategori` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recommendations`
--

DROP TABLE IF EXISTS `recommendations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recommendations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `financial_health_result_id` int DEFAULT NULL,
  `recommendation_type` enum('saving','expense_control','consumptive_control','debt_control','budgeting','general') NOT NULL DEFAULT 'general',
  `title` varchar(150) NOT NULL,
  `message` text NOT NULL,
  `priority` enum('low','medium','high') NOT NULL DEFAULT 'medium',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_recommendations_user` (`user_id`),
  KEY `idx_recommendations_result` (`financial_health_result_id`),
  CONSTRAINT `recommendations_result_fk` FOREIGN KEY (`financial_health_result_id`) REFERENCES `financial_health_results` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `recommendations_user_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recommendations`
--

LOCK TABLES `recommendations` WRITE;
/*!40000 ALTER TABLE `recommendations` DISABLE KEYS */;
/*!40000 ALTER TABLE `recommendations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subjective_surveys`
--

DROP TABLE IF EXISTS `subjective_surveys`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subjective_surveys` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `period_year` year NOT NULL,
  `period_month` tinyint NOT NULL,
  `financial_satisfaction` tinyint NOT NULL,
  `financial_security` tinyint NOT NULL,
  `financial_confidence` tinyint NOT NULL,
  `note` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_subjective_user_period` (`user_id`,`period_year`,`period_month`),
  CONSTRAINT `subjective_surveys_user_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `chk_financial_confidence` CHECK ((`financial_confidence` between 1 and 5)),
  CONSTRAINT `chk_financial_satisfaction` CHECK ((`financial_satisfaction` between 1 and 5)),
  CONSTRAINT `chk_financial_security` CHECK ((`financial_security` between 1 and 5)),
  CONSTRAINT `chk_subjective_month` CHECK ((`period_month` between 1 and 12))
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subjective_surveys`
--

LOCK TABLES `subjective_surveys` WRITE;
/*!40000 ALTER TABLE `subjective_surveys` DISABLE KEYS */;
INSERT INTO `subjective_surveys` VALUES (1,1,2026,4,4,4,4,'Merasa stabil meski pengeluaran cukup tinggi','2026-05-11 07:54:30'),(2,1,2026,5,5,5,5,'Bonus masuk, tabungan bertambah, merasa sangat aman','2026-05-11 07:54:30'),(7,2,2026,5,3,4,4,NULL,'2026-05-26 02:24:42'),(8,2,2026,4,3,3,2,NULL,'2026-05-26 02:44:52');
/*!40000 ALTER TABLE `subjective_surveys` ENABLE KEYS */;
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
INSERT INTO `subkategori` VALUES (1,1,'Gaji','2026-04-24 00:15:13'),(2,1,'Bonus','2026-04-24 00:15:13'),(3,1,'Freelance','2026-04-24 00:15:13'),(4,1,'Bisnis','2026-04-24 00:15:13'),(5,1,'Pendapatan Lainnya','2026-04-24 00:15:13'),(6,2,'Fashion','2026-04-24 00:15:13'),(7,2,'Gadget & Elektronik','2026-04-24 00:15:13'),(8,2,'Peralatan Rumah Tangga','2026-04-24 00:15:13'),(9,4,'Hadiah','2026-04-24 00:15:13'),(10,4,'Amal / Sedekah','2026-04-24 00:15:13'),(11,5,'Buku','2026-04-24 00:15:13'),(12,5,'Film & Musik','2026-04-24 00:15:13'),(13,5,'Games','2026-04-24 00:15:13'),(14,5,'Hobi','2026-04-24 00:15:13'),(15,5,'Peliharaan','2026-04-24 00:15:13'),(16,6,'Anak','2026-04-24 00:15:13'),(17,6,'Orang Tua','2026-04-24 00:15:13'),(18,7,'Dokter & Rumah Sakit','2026-04-24 00:15:13'),(19,7,'Obat','2026-04-24 00:15:13'),(20,7,'Perawatan Diri','2026-04-24 00:15:13'),(21,8,'Camilan & Minuman','2026-04-24 00:15:13'),(22,8,'Makan Harian','2026-04-24 00:15:13'),(23,9,'Aktivitas Olahraga','2026-04-24 00:15:13'),(24,9,'Perlengkapan Olahraga','2026-04-24 00:15:13'),(25,10,'Biaya Sekolah','2026-04-24 00:15:13'),(26,10,'Kursus & Workshop','2026-04-24 00:15:13'),(27,10,'Perlengkapan Sekolah','2026-04-24 00:15:13'),(28,11,'Cicilan Mobil','2026-04-24 00:15:13'),(29,11,'Cicilan Rumah','2026-04-24 00:15:13'),(30,11,'Cicilan Motor','2026-04-24 00:15:13'),(31,11,'Kartu Kredit','2026-04-24 00:15:13'),(32,12,'Investasi','2026-04-24 00:15:13'),(33,12,'Tabungan','2026-04-24 00:15:13'),(34,13,'Asuransi','2026-04-24 00:15:13'),(35,13,'Listrik','2026-04-24 00:15:13'),(36,13,'Air','2026-04-24 00:15:13'),(37,13,'Gas','2026-04-24 00:15:13'),(38,13,'Pulsa & Data','2026-04-24 00:15:13'),(39,13,'TV & Internet','2026-04-24 00:15:13'),(40,14,'Bensin','2026-04-24 00:15:13'),(41,14,'Biaya Parkir & Tol','2026-04-24 00:15:13'),(42,14,'Servis Kendaraan','2026-04-24 00:15:13'),(43,14,'Transportasi Harian','2026-04-24 00:15:13'),(44,15,'Atraksi & Tur','2026-04-24 00:15:13'),(45,15,'Hotel & Villa','2026-04-24 00:15:13'),(46,15,'Transportasi Travelling','2026-04-24 00:15:13'),(47,16,'Top Up E-Wallet','2026-04-24 00:15:13'),(48,16,'Bayar Pajak','2026-04-24 00:15:13');
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
  `id_kategori` int NOT NULL,
  `id_subkategori` int DEFAULT NULL,
  `category` varchar(100) NOT NULL,
  `subcategory` varchar(100) DEFAULT NULL,
  `amount` decimal(15,2) NOT NULL,
  `description` text,
  `date` date NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_transactions_user_date` (`user_id`,`date`),
  KEY `idx_transactions_type` (`type`),
  KEY `idx_transactions_id_kategori` (`id_kategori`),
  KEY `idx_transactions_id_subkategori` (`id_subkategori`),
  CONSTRAINT `transactions_kategori_fk` FOREIGN KEY (`id_kategori`) REFERENCES `kategori` (`id_kategori`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `transactions_subkategori_fk` FOREIGN KEY (`id_subkategori`) REFERENCES `subkategori` (`id_subkategori`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `transactions_user_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `chk_transactions_amount_positive` CHECK ((`amount` > 0))
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transactions`
--

LOCK TABLES `transactions` WRITE;
/*!40000 ALTER TABLE `transactions` DISABLE KEYS */;
INSERT INTO `transactions` VALUES (1,1,'income',1,1,'Pendapatan','Gaji',6000000.00,'Gaji bulan April','2026-04-01','2026-05-11 07:54:30','2026-05-11 07:54:30'),(2,1,'expense',13,35,'Tagihan','Listrik',600000.00,'Tagihan listrik April','2026-04-03','2026-05-11 07:54:30','2026-05-11 07:54:30'),(3,1,'expense',14,40,'Transportasi','Bensin',500000.00,'Bensin motor sebulan','2026-04-05','2026-05-11 07:54:30','2026-05-11 07:54:30'),(4,1,'expense',6,17,'Kebutuhan Keluarga','Orang Tua',1000000.00,'Kiriman orang tua','2026-04-07','2026-05-11 07:54:30','2026-05-11 07:54:30'),(5,1,'expense',2,6,'Belanja','Fashion',1200000.00,'Beli baju baru','2026-04-10','2026-05-11 07:54:30','2026-05-11 07:54:30'),(6,1,'expense',5,12,'Hobi & Hiburan','Film & Musik',800000.00,'Nonton dan streaming','2026-04-15','2026-05-11 07:54:30','2026-05-11 07:54:30'),(7,1,'expense',8,22,'Makan & Minuman','Makan Harian',500000.00,'Makan siang luar kantor','2026-04-20','2026-05-11 07:54:30','2026-05-11 07:54:30'),(8,1,'expense',12,32,'Tabungan & Investasi','Investasi',500000.00,'Investasi reksa dana','2026-04-25','2026-05-11 07:54:30','2026-05-11 07:54:30'),(9,1,'income',1,1,'Pendapatan','Gaji',10000000.00,'Gaji + bonus Mei','2026-05-01','2026-05-11 07:54:30','2026-05-11 07:54:30'),(10,1,'expense',13,35,'Tagihan','Listrik',500000.00,'Tagihan listrik Mei','2026-05-03','2026-05-11 07:54:30','2026-05-11 07:54:30'),(11,1,'expense',13,38,'Tagihan','Pulsa & Data',300000.00,'Paket data bulanan','2026-05-04','2026-05-11 07:54:30','2026-05-11 07:54:30'),(12,1,'expense',14,40,'Transportasi','Bensin',400000.00,'Bensin motor','2026-05-05','2026-05-11 07:54:30','2026-05-11 07:54:30'),(13,1,'expense',14,43,'Transportasi','Transportasi Harian',250000.00,'Ojek & commuter line','2026-05-07','2026-05-11 07:54:30','2026-05-11 07:54:30'),(14,1,'expense',12,32,'Tabungan & Investasi','Investasi',1500000.00,'Top up reksa dana saham','2026-05-08','2026-05-11 07:54:30','2026-05-11 07:54:30'),(15,1,'expense',5,12,'Hobi & Hiburan','Film & Musik',300000.00,'Streaming + nonton bioskop','2026-05-10','2026-05-11 07:54:30','2026-05-11 07:54:30'),(16,2,'income',1,1,'Pendapatan','Gaji',4000000.00,'Gaji bulan April','2026-04-01','2026-05-11 07:54:30','2026-05-11 07:54:30'),(17,2,'expense',13,35,'Tagihan','Listrik',1500000.00,'Tagihan listrik + air','2026-04-04','2026-05-11 07:54:30','2026-05-11 07:54:30'),(18,2,'expense',14,42,'Transportasi','Servis Kendaraan',1200000.00,'Servis motor + bensin','2026-04-08','2026-05-11 07:54:30','2026-05-11 07:54:30'),(19,2,'expense',6,16,'Kebutuhan Keluarga','Anak',1000000.00,'Biaya keperluan anak','2026-04-12','2026-05-11 07:54:30','2026-05-11 07:54:30'),(20,2,'expense',2,6,'Belanja','Fashion',500000.00,'Beli pakaian','2026-04-18','2026-05-11 07:54:30','2026-05-11 07:54:30'),(21,2,'expense',5,13,'Hobi & Hiburan','Games',200000.00,'Beli game mobile','2026-04-25','2026-05-11 07:54:30','2026-05-11 07:54:30'),(22,2,'income',1,1,'Pendapatan','Gaji',5000000.00,'Gaji bulan Mei','2026-05-01','2026-05-11 07:54:30','2026-05-11 07:54:30'),(23,2,'expense',13,35,'Tagihan','Listrik',500000.00,'Tagihan listrik Mei','2026-05-03','2026-05-11 07:54:30','2026-05-11 07:54:30'),(24,2,'expense',14,40,'Transportasi','Bensin',400000.00,'Bensin motor','2026-05-05','2026-05-11 07:54:30','2026-05-11 07:54:30'),(25,2,'expense',2,6,'Belanja','Fashion',1200000.00,'Belanja bulanan fashion','2026-05-07','2026-05-11 07:54:30','2026-05-11 07:54:30'),(26,2,'expense',5,13,'Hobi & Hiburan','Games',900000.00,'Beli game + hiburan','2026-05-08','2026-05-11 07:54:30','2026-05-11 07:54:30'),(27,2,'expense',8,22,'Makan & Minuman','Makan Harian',750000.00,'Makan siang & dinner luar','2026-05-09','2026-05-11 07:54:30','2026-05-11 07:54:30'),(28,2,'expense',6,17,'Kebutuhan Keluarga','Orang Tua',500000.00,'Kiriman orang tua','2026-05-10','2026-05-11 07:54:30','2026-05-11 07:54:30'),(29,2,'expense',16,47,'Lainnya','Top Up E-Wallet',500000.00,'Top up GoPay & OVO','2026-05-10','2026-05-11 07:54:30','2026-05-11 07:54:30'),(30,3,'income',1,1,'Pendapatan','Gaji',3000000.00,'Gaji bulan Mei','2026-05-01','2026-05-11 07:54:30','2026-05-11 07:54:30'),(31,3,'expense',2,6,'Belanja','Fashion',1500000.00,'Belanja baju & aksesoris','2026-05-02','2026-05-11 07:54:30','2026-05-11 07:54:30'),(32,3,'expense',5,13,'Hobi & Hiburan','Games',1200000.00,'Beli game & konsol','2026-05-04','2026-05-11 07:54:30','2026-05-11 07:54:30'),(33,3,'expense',15,45,'Travelling','Hotel & Villa',800000.00,'Menginap akhir pekan','2026-05-06','2026-05-11 07:54:30','2026-05-11 07:54:30'),(34,3,'expense',8,22,'Makan & Minuman','Makan Harian',900000.00,'Makan di resto setiap hari','2026-05-08','2026-05-11 07:54:30','2026-05-11 07:54:30'),(35,2,'expense',14,NULL,'Transportasi','Biaya Parkir & Tol',1000.00,'Parkir','2026-05-26','2026-05-26 02:08:34','2026-05-26 02:08:34');
/*!40000 ALTER TABLE `transactions` ENABLE KEYS */;
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
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Ahmad Reza','testbaru@test.com','$2b$10$6i4bBQYRETqR5cF47qPYsuFJJhedoe9hTCp8XLM6WZuxgBtfdAU8K','2026-04-01 01:00:00','2026-05-11 07:54:30'),(2,'Dewi C','dewi@gmail.com','$2b$10$SPOnj09XXrBg7jPxuXurauOrKNANYbwaP8c4mbAt0n0oT59OqCoIO','2026-04-01 01:05:00','2026-05-11 07:54:30'),(3,'Budi Santoso','budi@test.com','$2b$10$6i4bBQYRETqR5cF47qPYsuFJJhedoe9hTCp8XLM6WZuxgBtfdAU8K','2026-04-01 01:10:00','2026-05-11 07:54:30');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `vw_monthly_financial_summary`
--

DROP TABLE IF EXISTS `vw_monthly_financial_summary`;
/*!50001 DROP VIEW IF EXISTS `vw_monthly_financial_summary`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_monthly_financial_summary` AS SELECT 
 1 AS `user_id`,
 1 AS `period_year`,
 1 AS `period_month`,
 1 AS `total_income`,
 1 AS `total_expense`,
 1 AS `total_saving_investment`,
 1 AS `total_debt_payment`,
 1 AS `total_consumptive_expense`,
 1 AS `transaction_count`,
 1 AS `consumptive_transaction_count`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vw_transaction_detail`
--

DROP TABLE IF EXISTS `vw_transaction_detail`;
/*!50001 DROP VIEW IF EXISTS `vw_transaction_detail`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_transaction_detail` AS SELECT 
 1 AS `id`,
 1 AS `user_id`,
 1 AS `user_name`,
 1 AS `type`,
 1 AS `amount`,
 1 AS `description`,
 1 AS `date`,
 1 AS `id_kategori`,
 1 AS `nama_kategori`,
 1 AS `jenis`,
 1 AS `kelompok_analisis`,
 1 AS `id_subkategori`,
 1 AS `nama_subkategori`,
 1 AS `created_at`,
 1 AS `updated_at`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `warnings`
--

DROP TABLE IF EXISTS `warnings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `warnings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `financial_health_result_id` int DEFAULT NULL,
  `warning_code` varchar(50) NOT NULL,
  `title` varchar(150) NOT NULL,
  `message` text NOT NULL,
  `trigger_value` decimal(12,4) DEFAULT NULL,
  `threshold_value` decimal(12,4) DEFAULT NULL,
  `is_resolved` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_warnings_user` (`user_id`),
  KEY `idx_warnings_result` (`financial_health_result_id`),
  CONSTRAINT `warnings_result_fk` FOREIGN KEY (`financial_health_result_id`) REFERENCES `financial_health_results` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `warnings_user_fk` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `warnings`
--

LOCK TABLES `warnings` WRITE;
/*!40000 ALTER TABLE `warnings` DISABLE KEYS */;
/*!40000 ALTER TABLE `warnings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Final view structure for view `vw_monthly_financial_summary`
--

/*!50001 DROP VIEW IF EXISTS `vw_monthly_financial_summary`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_monthly_financial_summary` AS select `t`.`user_id` AS `user_id`,year(`t`.`date`) AS `period_year`,month(`t`.`date`) AS `period_month`,coalesce(sum((case when (`t`.`type` = 'income') then `t`.`amount` else 0 end)),0) AS `total_income`,coalesce(sum((case when (`t`.`type` = 'expense') then `t`.`amount` else 0 end)),0) AS `total_expense`,coalesce(sum((case when (`k`.`kelompok_analisis` = 'tabungan_investasi') then `t`.`amount` else 0 end)),0) AS `total_saving_investment`,coalesce(sum((case when (`k`.`kelompok_analisis` = 'kewajiban') then `t`.`amount` else 0 end)),0) AS `total_debt_payment`,coalesce(sum((case when (`k`.`kelompok_analisis` = 'konsumtif') then `t`.`amount` else 0 end)),0) AS `total_consumptive_expense`,count(0) AS `transaction_count`,coalesce(sum((case when (`k`.`kelompok_analisis` = 'konsumtif') then 1 else 0 end)),0) AS `consumptive_transaction_count` from (`transactions` `t` join `kategori` `k` on((`t`.`id_kategori` = `k`.`id_kategori`))) group by `t`.`user_id`,year(`t`.`date`),month(`t`.`date`) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_transaction_detail`
--

/*!50001 DROP VIEW IF EXISTS `vw_transaction_detail`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_transaction_detail` AS select `t`.`id` AS `id`,`t`.`user_id` AS `user_id`,`u`.`name` AS `user_name`,`t`.`type` AS `type`,`t`.`amount` AS `amount`,`t`.`description` AS `description`,`t`.`date` AS `date`,`t`.`id_kategori` AS `id_kategori`,`k`.`nama_kategori` AS `nama_kategori`,`k`.`jenis` AS `jenis`,`k`.`kelompok_analisis` AS `kelompok_analisis`,`t`.`id_subkategori` AS `id_subkategori`,`s`.`nama_subkategori` AS `nama_subkategori`,`t`.`created_at` AS `created_at`,`t`.`updated_at` AS `updated_at` from (((`transactions` `t` join `users` `u` on((`t`.`user_id` = `u`.`id`))) join `kategori` `k` on((`t`.`id_kategori` = `k`.`id_kategori`))) left join `subkategori` `s` on((`t`.`id_subkategori` = `s`.`id_subkategori`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-26 10:30:36
