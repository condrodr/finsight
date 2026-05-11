CREATE DATABASE IF NOT EXISTS `finsight`
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_0900_ai_ci;

USE `finsight`;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `recommendations`;
DROP TABLE IF EXISTS `warnings`;
DROP TABLE IF EXISTS `insights`;
DROP TABLE IF EXISTS `financial_health_results`;
DROP TABLE IF EXISTS `subjective_answers`;
DROP TABLE IF EXISTS `subjective_surveys`;
DROP TABLE IF EXISTS `transactions`;
DROP TABLE IF EXISTS `subkategori`;
DROP TABLE IF EXISTS `kategori`;
DROP TABLE IF EXISTS `users`;

SET FOREIGN_KEY_CHECKS = 1;

-- =====================================================
-- USERS
-- =====================================================

CREATE TABLE `users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `users` (`id`, `name`, `email`, `password`, `created_at`) VALUES
(1,'Test User','testbaru@test.com','$2b$10$6i4bBQYRETqR5cF47qPYsuFJJhedoe9hTCp8XLM6WZuxgBtfdAU8K','2026-04-28 04:30:09'),
(2,'Dewi C','dewi@gmail.com','$2b$10$SPOnj09XXrBg7jPxuXurauOrKNANYbwaP8c4mbAt0n0oT59OqCoIO','2026-04-28 04:30:20');

-- =====================================================
-- KATEGORI
-- Catatan: nama kategori, subkategori, dan isi tabel tidak diubah.
-- Kolom kelompok_analisis dipertahankan sebagai dasar perhitungan backend.
-- =====================================================

CREATE TABLE `kategori` (
  `id_kategori` INT NOT NULL AUTO_INCREMENT,
  `nama_kategori` VARCHAR(100) NOT NULL,
  `jenis` ENUM('pendapatan','pengeluaran') NOT NULL,
  `kelompok_analisis` ENUM('pendapatan','kebutuhan','kewajiban','konsumtif','tabungan_investasi','lainnya') NOT NULL,
  `tanggal_dibuat` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_kategori`),
  KEY `idx_kategori_jenis` (`jenis`),
  KEY `idx_kategori_kelompok_analisis` (`kelompok_analisis`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `kategori` (`id_kategori`, `nama_kategori`, `jenis`, `kelompok_analisis`, `tanggal_dibuat`) VALUES
(1,'Pendapatan','pendapatan','pendapatan','2026-04-24 07:15:07'),
(2,'Belanja','pengeluaran','konsumtif','2026-04-24 07:15:07'),
(3,'Belanja Bulanan','pengeluaran','kebutuhan','2026-04-24 07:15:07'),
(4,'Hadiah & Amal','pengeluaran','lainnya','2026-04-24 07:15:07'),
(5,'Hobi & Hiburan','pengeluaran','konsumtif','2026-04-24 07:15:07'),
(6,'Kebutuhan Keluarga','pengeluaran','kebutuhan','2026-04-24 07:15:07'),
(7,'Kesehatan & Perawatan Diri','pengeluaran','kebutuhan','2026-04-24 07:15:07'),
(8,'Makan & Minuman','pengeluaran','kebutuhan','2026-04-24 07:15:07'),
(9,'Olahraga','pengeluaran','konsumtif','2026-04-24 07:15:07'),
(10,'Pendidikan','pengeluaran','kebutuhan','2026-04-24 07:15:07'),
(11,'Pinjaman','pengeluaran','kewajiban','2026-04-24 07:15:07'),
(12,'Tabungan & Investasi','pengeluaran','tabungan_investasi','2026-04-24 07:15:07'),
(13,'Tagihan','pengeluaran','kewajiban','2026-04-24 07:15:07'),
(14,'Transportasi','pengeluaran','kebutuhan','2026-04-24 07:15:07'),
(15,'Travelling','pengeluaran','konsumtif','2026-04-24 07:15:07'),
(16,'Lainnya','pengeluaran','lainnya','2026-04-24 07:15:07');

-- =====================================================
-- SUBKATEGORI
-- Isi subkategori tidak diubah.
-- =====================================================

CREATE TABLE `subkategori` (
  `id_subkategori` INT NOT NULL AUTO_INCREMENT,
  `id_kategori` INT NOT NULL,
  `nama_subkategori` VARCHAR(100) NOT NULL,
  `tanggal_dibuat` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_subkategori`),
  KEY `id_kategori` (`id_kategori`),
  CONSTRAINT `subkategori_ibfk_1`
    FOREIGN KEY (`id_kategori`) REFERENCES `kategori` (`id_kategori`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `subkategori` (`id_subkategori`, `id_kategori`, `nama_subkategori`, `tanggal_dibuat`) VALUES
(1,1,'Gaji','2026-04-24 07:15:13'),
(2,1,'Bonus','2026-04-24 07:15:13'),
(3,1,'Freelance','2026-04-24 07:15:13'),
(4,1,'Bisnis','2026-04-24 07:15:13'),
(5,1,'Pendapatan Lainnya','2026-04-24 07:15:13'),
(6,2,'Fashion','2026-04-24 07:15:13'),
(7,2,'Gadget & Elektronik','2026-04-24 07:15:13'),
(8,2,'Peralatan Rumah Tangga','2026-04-24 07:15:13'),
(9,4,'Hadiah','2026-04-24 07:15:13'),
(10,4,'Amal / Sedekah','2026-04-24 07:15:13'),
(11,5,'Buku','2026-04-24 07:15:13'),
(12,5,'Film & Musik','2026-04-24 07:15:13'),
(13,5,'Games','2026-04-24 07:15:13'),
(14,5,'Hobi','2026-04-24 07:15:13'),
(15,5,'Peliharaan','2026-04-24 07:15:13'),
(16,6,'Anak','2026-04-24 07:15:13'),
(17,6,'Orang Tua','2026-04-24 07:15:13'),
(18,7,'Dokter & Rumah Sakit','2026-04-24 07:15:13'),
(19,7,'Obat','2026-04-24 07:15:13'),
(20,7,'Perawatan Diri','2026-04-24 07:15:13'),
(21,8,'Camilan & Minuman','2026-04-24 07:15:13'),
(22,8,'Makan Harian','2026-04-24 07:15:13'),
(23,9,'Aktivitas Olahraga','2026-04-24 07:15:13'),
(24,9,'Perlengkapan Olahraga','2026-04-24 07:15:13'),
(25,10,'Biaya Sekolah','2026-04-24 07:15:13'),
(26,10,'Kursus & Workshop','2026-04-24 07:15:13'),
(27,10,'Perlengkapan Sekolah','2026-04-24 07:15:13'),
(28,11,'Cicilan Mobil','2026-04-24 07:15:13'),
(29,11,'Cicilan Rumah','2026-04-24 07:15:13'),
(30,11,'Cicilan Motor','2026-04-24 07:15:13'),
(31,11,'Kartu Kredit','2026-04-24 07:15:13'),
(32,12,'Investasi','2026-04-24 07:15:13'),
(33,12,'Tabungan','2026-04-24 07:15:13'),
(34,13,'Asuransi','2026-04-24 07:15:13'),
(35,13,'Listrik','2026-04-24 07:15:13'),
(36,13,'Air','2026-04-24 07:15:13'),
(37,13,'Gas','2026-04-24 07:15:13'),
(38,13,'Pulsa & Data','2026-04-24 07:15:13'),
(39,13,'TV & Internet','2026-04-24 07:15:13'),
(40,14,'Bensin','2026-04-24 07:15:13'),
(41,14,'Biaya Parkir & Tol','2026-04-24 07:15:13'),
(42,14,'Servis Kendaraan','2026-04-24 07:15:13'),
(43,14,'Transportasi Harian','2026-04-24 07:15:13'),
(44,15,'Atraksi & Tur','2026-04-24 07:15:13'),
(45,15,'Hotel & Villa','2026-04-24 07:15:13'),
(46,15,'Transportasi Travelling','2026-04-24 07:15:13'),
(47,16,'Top Up E-Wallet','2026-04-24 07:15:13'),
(48,16,'Bayar Pajak','2026-04-24 07:15:13');

-- =====================================================
-- TRANSACTIONS
-- Menggunakan relasi id_kategori dan id_subkategori agar analisis lebih akurat.
-- Kolom category dan subcategory tetap disediakan agar kompatibel dengan frontend lama.
-- =====================================================

CREATE TABLE `transactions` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `type` ENUM('income','expense') NOT NULL,
  `id_kategori` INT NOT NULL,
  `id_subkategori` INT NULL,
  `category` VARCHAR(100) NOT NULL,
  `subcategory` VARCHAR(100) DEFAULT NULL,
  `amount` DECIMAL(15,2) NOT NULL,
  `description` TEXT,
  `date` DATE NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_transactions_user_date` (`user_id`, `date`),
  KEY `idx_transactions_type` (`type`),
  KEY `idx_transactions_id_kategori` (`id_kategori`),
  KEY `idx_transactions_id_subkategori` (`id_subkategori`),
  CONSTRAINT `transactions_user_fk`
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `transactions_kategori_fk`
    FOREIGN KEY (`id_kategori`) REFERENCES `kategori` (`id_kategori`)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `transactions_subkategori_fk`
    FOREIGN KEY (`id_subkategori`) REFERENCES `subkategori` (`id_subkategori`)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `chk_transactions_amount_positive` CHECK (`amount` > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =====================================================
-- SUBJECTIVE SURVEY
-- Dipakai untuk indikator subjektif: financial satisfaction, security, confidence.
-- Skala Likert 1-5 dikonversi oleh backend menjadi skor 0-100 atau skor ordinal.
-- =====================================================

CREATE TABLE `subjective_surveys` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `period_year` YEAR NOT NULL,
  `period_month` TINYINT NOT NULL,
  `financial_satisfaction` TINYINT NOT NULL,
  `financial_security` TINYINT NOT NULL,
  `financial_confidence` TINYINT NOT NULL,
  `note` TEXT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_subjective_user_period` (`user_id`, `period_year`, `period_month`),
  CONSTRAINT `subjective_surveys_user_fk`
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `chk_subjective_month` CHECK (`period_month` BETWEEN 1 AND 12),
  CONSTRAINT `chk_financial_satisfaction` CHECK (`financial_satisfaction` BETWEEN 1 AND 5),
  CONSTRAINT `chk_financial_security` CHECK (`financial_security` BETWEEN 1 AND 5),
  CONSTRAINT `chk_financial_confidence` CHECK (`financial_confidence` BETWEEN 1 AND 5)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =====================================================
-- FINANCIAL HEALTH RESULTS
-- Menyimpan hasil evaluasi bulanan berbasis Composite Index + Equal Weighting.
-- Formula utama backend:
-- Financial Health Score = (total_indicator_score / max_indicator_score) * 100
-- =====================================================

CREATE TABLE `financial_health_results` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `period_year` YEAR NOT NULL,
  `period_month` TINYINT NOT NULL,

  -- raw monthly totals
  `total_income` DECIMAL(15,2) NOT NULL DEFAULT 0,
  `total_expense` DECIMAL(15,2) NOT NULL DEFAULT 0,
  `total_saving_investment` DECIMAL(15,2) NOT NULL DEFAULT 0,
  `total_debt_payment` DECIMAL(15,2) NOT NULL DEFAULT 0,
  `total_consumptive_expense` DECIMAL(15,2) NOT NULL DEFAULT 0,
  `transaction_count` INT NOT NULL DEFAULT 0,
  `consumptive_transaction_count` INT NOT NULL DEFAULT 0,

  -- ratios
  `saving_ratio` DECIMAL(8,4) NOT NULL DEFAULT 0,
  `expense_ratio` DECIMAL(8,4) NOT NULL DEFAULT 0,
  `cash_flow` DECIMAL(15,2) NOT NULL DEFAULT 0,
  `debt_ratio` DECIMAL(8,4) NOT NULL DEFAULT 0,
  `consumptive_ratio` DECIMAL(8,4) NOT NULL DEFAULT 0,
  `transaction_frequency_ratio` DECIMAL(8,4) NOT NULL DEFAULT 0,

  -- ordinal score 1-5
  `saving_score` TINYINT NOT NULL DEFAULT 1,
  `expense_score` TINYINT NOT NULL DEFAULT 1,
  `cash_flow_score` TINYINT NOT NULL DEFAULT 1,
  `debt_score` TINYINT NOT NULL DEFAULT 1,
  `consumptive_score` TINYINT NOT NULL DEFAULT 1,
  `frequency_score` TINYINT NOT NULL DEFAULT 1,
  `budget_discipline_score` TINYINT NOT NULL DEFAULT 1,
  `subjective_score` TINYINT NULL,

  -- final score
  `total_indicator_score` DECIMAL(6,2) NOT NULL DEFAULT 0,
  `max_indicator_score` DECIMAL(6,2) NOT NULL DEFAULT 0,
  `financial_health_score` DECIMAL(5,2) NOT NULL DEFAULT 0,
  `health_category` ENUM('Sangat Sehat','Sehat','Cukup','Berisiko','Tidak Sehat') NOT NULL DEFAULT 'Tidak Sehat',

  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_fhr_user_period` (`user_id`, `period_year`, `period_month`),
  KEY `idx_fhr_category` (`health_category`),
  CONSTRAINT `fhr_user_fk`
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `chk_fhr_month` CHECK (`period_month` BETWEEN 1 AND 12),
  CONSTRAINT `chk_fhr_score_range` CHECK (`financial_health_score` BETWEEN 0 AND 100),
  CONSTRAINT `chk_fhr_ordinal_scores` CHECK (
    `saving_score` BETWEEN 1 AND 5 AND
    `expense_score` BETWEEN 1 AND 5 AND
    `cash_flow_score` BETWEEN 1 AND 5 AND
    `debt_score` BETWEEN 1 AND 5 AND
    `consumptive_score` BETWEEN 1 AND 5 AND
    `frequency_score` BETWEEN 1 AND 5 AND
    `budget_discipline_score` BETWEEN 1 AND 5 AND
    (`subjective_score` IS NULL OR `subjective_score` BETWEEN 1 AND 5)
  )
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =====================================================
-- INSIGHTS, WARNINGS, RECOMMENDATIONS
-- Tabel output untuk dashboard analisis.
-- =====================================================

CREATE TABLE `insights` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `financial_health_result_id` INT NULL,
  `insight_type` ENUM('objective','behavioral','subjective','trend','general') NOT NULL DEFAULT 'general',
  `title` VARCHAR(150) NOT NULL,
  `message` TEXT NOT NULL,
  `severity` ENUM('info','success','warning','danger') NOT NULL DEFAULT 'info',
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_insights_user` (`user_id`),
  KEY `idx_insights_result` (`financial_health_result_id`),
  CONSTRAINT `insights_user_fk`
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `insights_result_fk`
    FOREIGN KEY (`financial_health_result_id`) REFERENCES `financial_health_results` (`id`)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `warnings` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `financial_health_result_id` INT NULL,
  `warning_code` VARCHAR(50) NOT NULL,
  `title` VARCHAR(150) NOT NULL,
  `message` TEXT NOT NULL,
  `trigger_value` DECIMAL(12,4) NULL,
  `threshold_value` DECIMAL(12,4) NULL,
  `is_resolved` BOOLEAN NOT NULL DEFAULT FALSE,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_warnings_user` (`user_id`),
  KEY `idx_warnings_result` (`financial_health_result_id`),
  CONSTRAINT `warnings_user_fk`
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `warnings_result_fk`
    FOREIGN KEY (`financial_health_result_id`) REFERENCES `financial_health_results` (`id`)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `recommendations` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `financial_health_result_id` INT NULL,
  `recommendation_type` ENUM('saving','expense_control','consumptive_control','debt_control','budgeting','general') NOT NULL DEFAULT 'general',
  `title` VARCHAR(150) NOT NULL,
  `message` TEXT NOT NULL,
  `priority` ENUM('low','medium','high') NOT NULL DEFAULT 'medium',
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_recommendations_user` (`user_id`),
  KEY `idx_recommendations_result` (`financial_health_result_id`),
  CONSTRAINT `recommendations_user_fk`
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `recommendations_result_fk`
    FOREIGN KEY (`financial_health_result_id`) REFERENCES `financial_health_results` (`id`)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- =====================================================
-- VIEW: MONTHLY FINANCIAL SUMMARY
-- Dipakai backend untuk mengambil data dasar perhitungan bulanan.
-- =====================================================

CREATE OR REPLACE VIEW `vw_monthly_financial_summary` AS
SELECT
  t.user_id,
  YEAR(t.date) AS period_year,
  MONTH(t.date) AS period_month,
  COALESCE(SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE 0 END), 0) AS total_income,
  COALESCE(SUM(CASE WHEN t.type = 'expense' THEN t.amount ELSE 0 END), 0) AS total_expense,
  COALESCE(SUM(CASE WHEN k.kelompok_analisis = 'tabungan_investasi' THEN t.amount ELSE 0 END), 0) AS total_saving_investment,
  COALESCE(SUM(CASE WHEN k.kelompok_analisis = 'kewajiban' THEN t.amount ELSE 0 END), 0) AS total_debt_payment,
  COALESCE(SUM(CASE WHEN k.kelompok_analisis = 'konsumtif' THEN t.amount ELSE 0 END), 0) AS total_consumptive_expense,
  COUNT(*) AS transaction_count,
  COALESCE(SUM(CASE WHEN k.kelompok_analisis = 'konsumtif' THEN 1 ELSE 0 END), 0) AS consumptive_transaction_count
FROM `transactions` t
JOIN `kategori` k ON t.id_kategori = k.id_kategori
GROUP BY t.user_id, YEAR(t.date), MONTH(t.date);

-- =====================================================
-- VIEW: TRANSACTION DETAIL
-- Memudahkan frontend dan reporting.
-- =====================================================

CREATE OR REPLACE VIEW `vw_transaction_detail` AS
SELECT
  t.id,
  t.user_id,
  u.name AS user_name,
  t.type,
  t.amount,
  t.description,
  t.date,
  t.id_kategori,
  k.nama_kategori,
  k.jenis,
  k.kelompok_analisis,
  t.id_subkategori,
  s.nama_subkategori,
  t.created_at,
  t.updated_at
FROM `transactions` t
JOIN `users` u ON t.user_id = u.id
JOIN `kategori` k ON t.id_kategori = k.id_kategori
LEFT JOIN `subkategori` s ON t.id_subkategori = s.id_subkategori;

