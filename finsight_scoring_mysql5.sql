CREATE DATABASE IF NOT EXISTS `finsight`
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

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
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Data users:
--   User 1 (ID 1) : testbaru@test.com   — Skenario QA "Sangat Sehat"
--   User 2 (ID 2) : dewi@gmail.com      — Skenario QA "Cukup" (tren dari "Berisiko")
--   User 3 (ID 3) : budi@test.com       — Skenario QA "Tidak Sehat"
--                   password sama dengan testbaru@test.com
-- -----------------------------------------------------

INSERT INTO `users` (`id`, `name`, `email`, `password`, `created_at`) VALUES
(1, 'Ahmad Reza',  'testbaru@test.com', '$2b$10$6i4bBQYRETqR5cF47qPYsuFJJhedoe9hTCp8XLM6WZuxgBtfdAU8K', '2026-04-01 08:00:00'),
(2, 'Dewi C',      'dewi@gmail.com',    '$2b$10$SPOnj09XXrBg7jPxuXurauOrKNANYbwaP8c4mbAt0n0oT59OqCoIO', '2026-04-01 08:05:00'),
(3, 'Budi Santoso','budi@test.com',     '$2b$10$6i4bBQYRETqR5cF47qPYsuFJJhedoe9hTCp8XLM6WZuxgBtfdAU8K', '2026-04-01 08:10:00');

-- =====================================================
-- KATEGORI
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
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `kategori` (`id_kategori`, `nama_kategori`, `jenis`, `kelompok_analisis`, `tanggal_dibuat`) VALUES
(1,  'Pendapatan',                 'pendapatan', 'pendapatan',        '2026-04-24 07:15:07'),
(2,  'Belanja',                    'pengeluaran','konsumtif',         '2026-04-24 07:15:07'),
(3,  'Belanja Bulanan',            'pengeluaran','kebutuhan',         '2026-04-24 07:15:07'),
(4,  'Hadiah & Amal',              'pengeluaran','lainnya',           '2026-04-24 07:15:07'),
(5,  'Hobi & Hiburan',             'pengeluaran','konsumtif',         '2026-04-24 07:15:07'),
(6,  'Kebutuhan Keluarga',         'pengeluaran','kebutuhan',         '2026-04-24 07:15:07'),
(7,  'Kesehatan & Perawatan Diri', 'pengeluaran','kebutuhan',         '2026-04-24 07:15:07'),
(8,  'Makan & Minuman',            'pengeluaran','kebutuhan',         '2026-04-24 07:15:07'),
(9,  'Olahraga',                   'pengeluaran','konsumtif',         '2026-04-24 07:15:07'),
(10, 'Pendidikan',                 'pengeluaran','kebutuhan',         '2026-04-24 07:15:07'),
(11, 'Pinjaman',                   'pengeluaran','kewajiban',         '2026-04-24 07:15:07'),
(12, 'Tabungan & Investasi',       'pengeluaran','tabungan_investasi','2026-04-24 07:15:07'),
(13, 'Tagihan',                    'pengeluaran','kewajiban',         '2026-04-24 07:15:07'),
(14, 'Transportasi',               'pengeluaran','kebutuhan',         '2026-04-24 07:15:07'),
(15, 'Travelling',                 'pengeluaran','konsumtif',         '2026-04-24 07:15:07'),
(16, 'Lainnya',                    'pengeluaran','lainnya',           '2026-04-24 07:15:07');

-- =====================================================
-- SUBKATEGORI
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
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `subkategori` (`id_subkategori`, `id_kategori`, `nama_subkategori`, `tanggal_dibuat`) VALUES
(1,  1,  'Gaji',                   '2026-04-24 07:15:13'),
(2,  1,  'Bonus',                  '2026-04-24 07:15:13'),
(3,  1,  'Freelance',              '2026-04-24 07:15:13'),
(4,  1,  'Bisnis',                 '2026-04-24 07:15:13'),
(5,  1,  'Pendapatan Lainnya',     '2026-04-24 07:15:13'),
(6,  2,  'Fashion',                '2026-04-24 07:15:13'),
(7,  2,  'Gadget & Elektronik',    '2026-04-24 07:15:13'),
(8,  2,  'Peralatan Rumah Tangga', '2026-04-24 07:15:13'),
(9,  4,  'Hadiah',                 '2026-04-24 07:15:13'),
(10, 4,  'Amal / Sedekah',         '2026-04-24 07:15:13'),
(11, 5,  'Buku',                   '2026-04-24 07:15:13'),
(12, 5,  'Film & Musik',           '2026-04-24 07:15:13'),
(13, 5,  'Games',                  '2026-04-24 07:15:13'),
(14, 5,  'Hobi',                   '2026-04-24 07:15:13'),
(15, 5,  'Peliharaan',             '2026-04-24 07:15:13'),
(16, 6,  'Anak',                   '2026-04-24 07:15:13'),
(17, 6,  'Orang Tua',              '2026-04-24 07:15:13'),
(18, 7,  'Dokter & Rumah Sakit',   '2026-04-24 07:15:13'),
(19, 7,  'Obat',                   '2026-04-24 07:15:13'),
(20, 7,  'Perawatan Diri',         '2026-04-24 07:15:13'),
(21, 8,  'Camilan & Minuman',      '2026-04-24 07:15:13'),
(22, 8,  'Makan Harian',           '2026-04-24 07:15:13'),
(23, 9,  'Aktivitas Olahraga',     '2026-04-24 07:15:13'),
(24, 9,  'Perlengkapan Olahraga',  '2026-04-24 07:15:13'),
(25, 10, 'Biaya Sekolah',          '2026-04-24 07:15:13'),
(26, 10, 'Kursus & Workshop',      '2026-04-24 07:15:13'),
(27, 10, 'Perlengkapan Sekolah',   '2026-04-24 07:15:13'),
(28, 11, 'Cicilan Mobil',          '2026-04-24 07:15:13'),
(29, 11, 'Cicilan Rumah',          '2026-04-24 07:15:13'),
(30, 11, 'Cicilan Motor',          '2026-04-24 07:15:13'),
(31, 11, 'Kartu Kredit',           '2026-04-24 07:15:13'),
(32, 12, 'Investasi',              '2026-04-24 07:15:13'),
(33, 12, 'Tabungan',               '2026-04-24 07:15:13'),
(34, 13, 'Asuransi',               '2026-04-24 07:15:13'),
(35, 13, 'Listrik',                '2026-04-24 07:15:13'),
(36, 13, 'Air',                    '2026-04-24 07:15:13'),
(37, 13, 'Gas',                    '2026-04-24 07:15:13'),
(38, 13, 'Pulsa & Data',           '2026-04-24 07:15:13'),
(39, 13, 'TV & Internet',          '2026-04-24 07:15:13'),
(40, 14, 'Bensin',                 '2026-04-24 07:15:13'),
(41, 14, 'Biaya Parkir & Tol',     '2026-04-24 07:15:13'),
(42, 14, 'Servis Kendaraan',       '2026-04-24 07:15:13'),
(43, 14, 'Transportasi Harian',    '2026-04-24 07:15:13'),
(44, 15, 'Atraksi & Tur',          '2026-04-24 07:15:13'),
(45, 15, 'Hotel & Villa',          '2026-04-24 07:15:13'),
(46, 15, 'Transportasi Travelling','2026-04-24 07:15:13'),
(47, 16, 'Top Up E-Wallet',        '2026-04-24 07:15:13'),
(48, 16, 'Bayar Pajak',            '2026-04-24 07:15:13');

-- =====================================================
-- TRANSACTIONS
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
    ON DELETE SET NULL ON UPDATE CASCADE ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- DATA TRANSAKSI — SKENARIO QA
--
-- PENTING: kolom `category` digunakan oleh keyword classifier di backend
-- (categoryClassifier.js) untuk menentukan kelompok konsumtif/kebutuhan/produktif.
-- Pastikan nama kategori cocok dengan tabel berikut:
--
--   Keyword Classifier Result (berbeda dari kelompok_analisis di tabel kategori):
--   "Belanja"           → KONSUMTIF  (keyword: belanja)
--   "Hobi & Hiburan"    → KONSUMTIF  (keyword: hiburan)
--   "Travelling"        → KONSUMTIF  (keyword: travel, liburan, hotel)
--   "Makan & Minuman"   → KONSUMTIF  (keyword: makan)  ← BERBEDA dari DB (DB=kebutuhan)
--   "Tagihan"           → KEBUTUHAN  (default, tidak ada keyword match)
--   "Transportasi"      → KEBUTUHAN  (keyword: transportasi)
--   "Kebutuhan Keluarga"→ KEBUTUHAN  (default)
--   "Tabungan & Investasi" → PRODUKTIF (keyword: tabungan, investasi)
-- =====================================================

-- -------------------------------------------------------
-- USER 1 (Ahmad Reza) — APRIL 2026
-- TARGET SKOR : 70  → Kategori "SEHAT"
--
-- Income   : Rp 6.000.000
-- Expense  : Rp 5.100.000
-- Balance  : Rp   900.000
--
-- Saving Ratio  = 900.000 / 6.000.000 = 15%  → Saving Score = 20
-- Cash Flow     = 900.000 > 0                 → CF Score     = 30
-- Konsumtif     = Belanja + Hobi + Makan = 1.200.000 + 800.000 + 500.000 = 2.500.000
-- Cons. Ratio   = 2.500.000 / 5.100.000 = 49% → Cons. Score  = 20
-- TOTAL SKOR    = 20 + 30 + 20 = 70  →  "SEHAT"
-- -------------------------------------------------------

INSERT INTO `transactions`
  (`user_id`,`type`,`id_kategori`,`id_subkategori`,`category`,`subcategory`,`amount`,`description`,`date`)
VALUES
(1,'income', 1,  1,  'Pendapatan',          'Gaji',         6000000.00, 'Gaji bulan April',       '2026-04-01'),
(1,'expense',13, 35, 'Tagihan',             'Listrik',       600000.00, 'Tagihan listrik April',  '2026-04-03'),
(1,'expense',14, 40, 'Transportasi',        'Bensin',        500000.00, 'Bensin motor sebulan',   '2026-04-05'),
(1,'expense', 6, 17, 'Kebutuhan Keluarga',  'Orang Tua',    1000000.00, 'Kiriman orang tua',      '2026-04-07'),
(1,'expense', 2,  6, 'Belanja',             'Fashion',      1200000.00, 'Beli baju baru',         '2026-04-10'),
(1,'expense', 5, 12, 'Hobi & Hiburan',      'Film & Musik',  800000.00, 'Nonton dan streaming',   '2026-04-15'),
(1,'expense', 8, 22, 'Makan & Minuman',     'Makan Harian',  500000.00, 'Makan siang luar kantor','2026-04-20'),
(1,'expense',12, 32, 'Tabungan & Investasi','Investasi',     500000.00, 'Investasi reksa dana',   '2026-04-25');

-- -------------------------------------------------------
-- USER 1 (Ahmad Reza) — MEI 2026
-- TARGET SKOR : 100  → Kategori "SANGAT SEHAT"
--
-- Income   : Rp 10.000.000
-- Expense  : Rp  3.250.000
-- Balance  : Rp  6.750.000
--
-- Saving Ratio  = 6.750.000 / 10.000.000 = 67,5% → Saving Score = 40
-- Cash Flow     = 6.750.000 > 0                   → CF Score     = 30
-- Konsumtif     = Hobi & Hiburan = 300.000
-- Cons. Ratio   = 300.000 / 3.250.000 = 9,2%      → Cons. Score  = 30
-- TOTAL SKOR    = 40 + 30 + 30 = 100  →  "SANGAT SEHAT"
-- -------------------------------------------------------

INSERT INTO `transactions`
  (`user_id`,`type`,`id_kategori`,`id_subkategori`,`category`,`subcategory`,`amount`,`description`,`date`)
VALUES
(1,'income', 1,  1,  'Pendapatan',          'Gaji',            10000000.00, 'Gaji + bonus Mei',         '2026-05-01'),
(1,'expense',13, 35, 'Tagihan',             'Listrik',           500000.00, 'Tagihan listrik Mei',       '2026-05-03'),
(1,'expense',13, 38, 'Tagihan',             'Pulsa & Data',      300000.00, 'Paket data bulanan',        '2026-05-04'),
(1,'expense',14, 40, 'Transportasi',        'Bensin',            400000.00, 'Bensin motor',              '2026-05-05'),
(1,'expense',14, 43, 'Transportasi',        'Transportasi Harian',250000.00,'Ojek & commuter line',     '2026-05-07'),
(1,'expense',12, 32, 'Tabungan & Investasi','Investasi',        1500000.00, 'Top up reksa dana saham',   '2026-05-08'),
(1,'expense', 5, 12, 'Hobi & Hiburan',      'Film & Musik',      300000.00, 'Streaming + nonton bioskop','2026-05-10');

-- -------------------------------------------------------
-- USER 2 (Dewi C) — APRIL 2026
-- TARGET SKOR : 30  → Kategori "BERISIKO"
--
-- Income   : Rp 4.000.000
-- Expense  : Rp 4.400.000   ← Pengeluaran MELEBIHI pendapatan
-- Balance  : Rp  -400.000
--
-- Saving Ratio  = -400.000 / 4.000.000 = -10%  → Saving Score = 0
-- Cash Flow     = -400.000 < 0                  → CF Score     = 0
-- Konsumtif     = Belanja + Hobi = 500.000 + 200.000 = 700.000
-- Cons. Ratio   = 700.000 / 4.400.000 = 15,9%  → Cons. Score  = 30
-- TOTAL SKOR    = 0 + 0 + 30 = 30  →  "BERISIKO"
-- -------------------------------------------------------

INSERT INTO `transactions`
  (`user_id`,`type`,`id_kategori`,`id_subkategori`,`category`,`subcategory`,`amount`,`description`,`date`)
VALUES
(2,'income', 1,  1,  'Pendapatan',         'Gaji',          4000000.00, 'Gaji bulan April',         '2026-04-01'),
(2,'expense',13, 35, 'Tagihan',            'Listrik',       1500000.00, 'Tagihan listrik + air',     '2026-04-04'),
(2,'expense',14, 42, 'Transportasi',       'Servis Kendaraan',1200000.00,'Servis motor + bensin',    '2026-04-08'),
(2,'expense', 6, 16, 'Kebutuhan Keluarga', 'Anak',          1000000.00, 'Biaya keperluan anak',      '2026-04-12'),
(2,'expense', 2,  6, 'Belanja',            'Fashion',        500000.00, 'Beli pakaian',              '2026-04-18'),
(2,'expense', 5, 13, 'Hobi & Hiburan',     'Games',          200000.00, 'Beli game mobile',          '2026-04-25');

-- -------------------------------------------------------
-- USER 2 (Dewi C) — MEI 2026
-- TARGET SKOR : 50  → Kategori "CUKUP"
--
-- Income   : Rp 5.000.000
-- Expense  : Rp 4.750.000
-- Balance  : Rp   250.000
--
-- Saving Ratio  = 250.000 / 5.000.000 = 5%    → Saving Score = 10
-- Cash Flow     = 250.000 > 0                  → CF Score     = 30
-- Konsumtif     = Belanja + Hobi + Makan = 1.200.000 + 900.000 + 750.000 = 2.850.000
-- Cons. Ratio   = 2.850.000 / 4.750.000 = 60% → Cons. Score  = 10
-- TOTAL SKOR    = 10 + 30 + 10 = 50  →  "CUKUP"
-- -------------------------------------------------------

INSERT INTO `transactions`
  (`user_id`,`type`,`id_kategori`,`id_subkategori`,`category`,`subcategory`,`amount`,`description`,`date`)
VALUES
(2,'income', 1,  1,  'Pendapatan',         'Gaji',          5000000.00, 'Gaji bulan Mei',            '2026-05-01'),
(2,'expense',13, 35, 'Tagihan',            'Listrik',        500000.00, 'Tagihan listrik Mei',        '2026-05-03'),
(2,'expense',14, 40, 'Transportasi',       'Bensin',         400000.00, 'Bensin motor',               '2026-05-05'),
(2,'expense', 2,  6, 'Belanja',            'Fashion',       1200000.00, 'Belanja bulanan fashion',    '2026-05-07'),
(2,'expense', 5, 13, 'Hobi & Hiburan',     'Games',          900000.00, 'Beli game + hiburan',        '2026-05-08'),
(2,'expense', 8, 22, 'Makan & Minuman',    'Makan Harian',   750000.00, 'Makan siang & dinner luar',  '2026-05-09'),
(2,'expense', 6, 17, 'Kebutuhan Keluarga', 'Orang Tua',      500000.00, 'Kiriman orang tua',          '2026-05-10'),
(2,'expense',16, 47, 'Lainnya',            'Top Up E-Wallet', 500000.00,'Top up GoPay & OVO',         '2026-05-10');

-- -------------------------------------------------------
-- USER 3 (Budi Santoso) — MEI 2026
-- TARGET SKOR : 0  → Kategori "TIDAK SEHAT"
--
-- Income   : Rp 3.000.000
-- Expense  : Rp 4.400.000   ← Pengeluaran JAUH melebihi pendapatan
-- Balance  : Rp -1.400.000
--
-- Saving Ratio  = -1.400.000 / 3.000.000 = -46,7% → Saving Score = 0
-- Cash Flow     = -1.400.000 < 0                   → CF Score     = 0
-- Konsumtif     = SEMUA pengeluaran (Belanja+Hobi+Travelling+Makan)
--               = 1.500.000 + 1.200.000 + 800.000 + 900.000 = 4.400.000
-- Cons. Ratio   = 4.400.000 / 4.400.000 = 100%     → Cons. Score  = 0
-- TOTAL SKOR    = 0 + 0 + 0 = 0  →  "TIDAK SEHAT"
-- -------------------------------------------------------

INSERT INTO `transactions`
  (`user_id`,`type`,`id_kategori`,`id_subkategori`,`category`,`subcategory`,`amount`,`description`,`date`)
VALUES
(3,'income', 1,  1,  'Pendapatan',     'Gaji',         3000000.00, 'Gaji bulan Mei',            '2026-05-01'),
(3,'expense', 2,  6, 'Belanja',        'Fashion',      1500000.00, 'Belanja baju & aksesoris',   '2026-05-02'),
(3,'expense', 5, 13, 'Hobi & Hiburan', 'Games',        1200000.00, 'Beli game & konsol',         '2026-05-04'),
(3,'expense',15, 45, 'Travelling',     'Hotel & Villa',  800000.00, 'Menginap akhir pekan',       '2026-05-06'),
(3,'expense', 8, 22, 'Makan & Minuman','Makan Harian',   900000.00, 'Makan di resto setiap hari', '2026-05-08');

-- =====================================================
-- SUBJECTIVE SURVEY
-- Data contoh untuk referensi — belum dipakai scoring engine saat ini
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
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Contoh data survey: skala 1 (sangat buruk) - 5 (sangat baik)
INSERT INTO `subjective_surveys`
  (`user_id`,`period_year`,`period_month`,`financial_satisfaction`,`financial_security`,`financial_confidence`,`note`)
VALUES
(1, 2026, 4, 4, 4, 4, 'Merasa stabil meski pengeluaran cukup tinggi'),
(1, 2026, 5, 5, 5, 5, 'Bonus masuk, tabungan bertambah, merasa sangat aman'),
(2, 2026, 4, 1, 1, 2, 'Pengeluaran melebihi gaji, sangat khawatir'),
(2, 2026, 5, 3, 2, 3, 'Lebih terkontrol tapi masih perlu perbaikan'),
(3, 2026, 5, 1, 1, 1, 'Kondisi sangat buruk, tidak bisa menabung sama sekali');

-- =====================================================
-- FINANCIAL HEALTH RESULTS
-- =====================================================

CREATE TABLE `financial_health_results` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `period_year` YEAR NOT NULL,
  `period_month` TINYINT NOT NULL,
  `total_income` DECIMAL(15,2) NOT NULL DEFAULT 0,
  `total_expense` DECIMAL(15,2) NOT NULL DEFAULT 0,
  `total_saving_investment` DECIMAL(15,2) NOT NULL DEFAULT 0,
  `total_debt_payment` DECIMAL(15,2) NOT NULL DEFAULT 0,
  `total_consumptive_expense` DECIMAL(15,2) NOT NULL DEFAULT 0,
  `transaction_count` INT NOT NULL DEFAULT 0,
  `consumptive_transaction_count` INT NOT NULL DEFAULT 0,
  `saving_ratio` DECIMAL(8,4) NOT NULL DEFAULT 0,
  `expense_ratio` DECIMAL(8,4) NOT NULL DEFAULT 0,
  `cash_flow` DECIMAL(15,2) NOT NULL DEFAULT 0,
  `debt_ratio` DECIMAL(8,4) NOT NULL DEFAULT 0,
  `consumptive_ratio` DECIMAL(8,4) NOT NULL DEFAULT 0,
  `transaction_frequency_ratio` DECIMAL(8,4) NOT NULL DEFAULT 0,
  `saving_score` TINYINT NOT NULL DEFAULT 1,
  `expense_score` TINYINT NOT NULL DEFAULT 1,
  `cash_flow_score` TINYINT NOT NULL DEFAULT 1,
  `debt_score` TINYINT NOT NULL DEFAULT 1,
  `consumptive_score` TINYINT NOT NULL DEFAULT 1,
  `frequency_score` TINYINT NOT NULL DEFAULT 1,
  `budget_discipline_score` TINYINT NOT NULL DEFAULT 1,
  `subjective_score` TINYINT NULL,
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
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- INSIGHTS, WARNINGS, RECOMMENDATIONS
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- VIEW: MONTHLY FINANCIAL SUMMARY
-- =====================================================

CREATE OR REPLACE VIEW `vw_monthly_financial_summary` AS
SELECT
  t.user_id,
  YEAR(t.date)  AS period_year,
  MONTH(t.date) AS period_month,
  COALESCE(SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE 0 END), 0)                        AS total_income,
  COALESCE(SUM(CASE WHEN t.type = 'expense' THEN t.amount ELSE 0 END), 0)                       AS total_expense,
  COALESCE(SUM(CASE WHEN k.kelompok_analisis = 'tabungan_investasi' THEN t.amount ELSE 0 END),0) AS total_saving_investment,
  COALESCE(SUM(CASE WHEN k.kelompok_analisis = 'kewajiban' THEN t.amount ELSE 0 END), 0)        AS total_debt_payment,
  COALESCE(SUM(CASE WHEN k.kelompok_analisis = 'konsumtif'  THEN t.amount ELSE 0 END), 0)       AS total_consumptive_expense,
  COUNT(*) AS transaction_count,
  COALESCE(SUM(CASE WHEN k.kelompok_analisis = 'konsumtif' THEN 1 ELSE 0 END), 0)               AS consumptive_transaction_count
FROM `transactions` t
JOIN `kategori` k ON t.id_kategori = k.id_kategori
GROUP BY t.user_id, YEAR(t.date), MONTH(t.date);

-- =====================================================
-- VIEW: TRANSACTION DETAIL
-- =====================================================

CREATE OR REPLACE VIEW `vw_transaction_detail` AS
SELECT
  t.id,
  t.user_id,
  u.name          AS user_name,
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
JOIN `users` u       ON t.user_id        = u.id
JOIN `kategori` k    ON t.id_kategori    = k.id_kategori
LEFT JOIN `subkategori` s ON t.id_subkategori = s.id_subkategori;

-- =====================================================
-- QUERY VERIFIKASI — Salin ke MySQL client untuk cek data
-- =====================================================

-- Ringkasan per user per bulan (dari view):
-- SELECT * FROM vw_monthly_financial_summary ORDER BY user_id, period_year, period_month;

-- Detail transaksi lengkap:
-- SELECT user_id, user_name, date, type, amount, nama_kategori, kelompok_analisis, nama_subkategori
-- FROM vw_transaction_detail ORDER BY user_id, date;

-- Hitung manual skor per bulan (untuk verifikasi dashboard):
-- SELECT
--   user_id,
--   period_year,
--   period_month,
--   total_income,
--   total_expense,
--   (total_income - total_expense) AS balance,
--   ROUND((total_income - total_expense) / total_income * 100, 1) AS saving_pct,
--   ROUND(total_consumptive_expense / total_expense * 100, 1) AS consumptive_pct
-- FROM vw_monthly_financial_summary;
