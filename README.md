# 💰 FinSight

**Know Your Habits. Master Your Money.**

FinSight adalah aplikasi web manajemen keuangan pribadi berbasis React JS, Node.js, Express, dan MySQL yang membantu pengguna tidak hanya mencatat transaksi, tetapi juga menganalisis kondisi finansial melalui financial health score, insight otomatis, dan evaluasi perilaku konsumtif.

---

## 🎯 Tujuan

Sebagian besar aplikasi keuangan hanya fokus pada pencatatan.

FinSight hadir dengan pendekatan berbeda:

> Masalah keuangan bukan hanya angka, tetapi perilaku.

Aplikasi ini membantu pengguna:
- Memahami kondisi keuangan
- Melihat pola pengeluaran
- Mendapatkan insight otomatis
- Mengambil keputusan finansial yang lebih baik

---

## 🚀 Fitur Utama

### 1. Manajemen Transaksi
- Tambah transaksi
- Edit transaksi
- Hapus transaksi

### 2. Dashboard
- Total pemasukan
- Total pengeluaran
- Saldo
- Financial health score

### 3. Laporan
- Riwayat transaksi
- Filter data
- Analisis kategori

### 4. Financial Health Score
Menggunakan:
- Saving Ratio
- Expense Ratio
- Consumptive Ratio
- Cash Flow

### 5. Insight & Warning
- Insight otomatis
- Peringatan keuangan
- Rekomendasi penghematan

---

## 🛠️ Tech Stack

Frontend:
- React JS (Vite)
- Tailwind CSS

Backend:
- Node.js
- Express.js

Database:
- MySQL

---

## ⚙️ Cara Menjalankan

### 1. Clone Repo

```bash
git clone https://github.com/condrodr/finsight.git
cd finsight
```

### 2. Setup Backend

```bash
cd backend
npm install
```

Buat file `.env`

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=finsight_db
```

Jalankan backend:

```bash
npm run dev
```

---

### 3. Setup Database

Masuk MySQL:

```sql
CREATE DATABASE finsight_db;
USE finsight_db;
```

---

### 4. Setup Frontend

```bash
cd ../frontend
npm install
npm run dev
```

---

## 🔌 API Contoh

### Tambah Transaksi

POST /api/transactions/add

### Ambil Transaksi

GET /api/transactions/:user_id

---

## 📌 Catatan

Project ini masih dalam pengembangan dan bisa dikembangkan lebih lanjut menjadi sistem yang lebih kompleks.

---

## 📄 License

MIT
