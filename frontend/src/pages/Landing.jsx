import { useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer.jsx";
import {
  BookOpen, X, PiggyBank, CreditCard, BarChart2, ShieldCheck,
  Lightbulb, Target, Clock, Users, TrendingUp
} from "lucide-react";
import Navbar from "../components/Navbar.jsx";
import styles from "../styles/pages/Landing.module.css";

// Education Data 
const edukasiList = [
  {
    id: 1,
    icon: <PiggyBank size={28} />,
    judul: "Mengelola Anggaran Bulanan",
    ringkasan: "Strategi praktis membagi penghasilan agar kebutuhan, tabungan, dan hiburan tetap terpenuhi.",
    konten: `## Apa itu Anggaran Bulanan?
Anggaran bulanan adalah rencana pengeluaran yang disusun setiap bulan agar keuangan tetap terkontrol. Tanpa anggaran, uang mudah habis tanpa tujuan yang jelas.

## Metode 50/30/20
Salah satu metode populer adalah **50/30/20**:
- 50% untuk kebutuhan pokok (makan, transportasi, tagihan)
- 30% untuk keinginan (hiburan, makan di luar, hobi)
- 20% untuk tabungan dan investasi

## Tips Praktis
1. Catat semua pemasukan — termasuk pemasukan sampingan.
2. Prioritaskan kebutuhan sebelum keinginan.
3. Gunakan amplop digital — pisahkan uang ke pos-pos berbeda.
4. Evaluasi setiap akhir bulan — lihat mana yang over budget.
5. Beri kelonggaran — sisihkan 5% untuk kejadian tak terduga.

## Kesalahan Umum
- Lupa mencatat pengeluaran kecil (jajan, parkir).
- Tidak menyesuaikan anggaran saat pendapatan berubah.
- Mengabaikan tagihan tahunan (asuransi, pajak kendaraan).`,
  },
  {
    id: 2,
    icon: <ShieldCheck size={28} />,
    judul: "Dana Darurat",
    ringkasan: "Pelajari mengapa dana darurat itu wajib dan bagaimana cara membangunnya dari nol.",
    konten: `## Apa itu Dana Darurat?
Dana darurat adalah uang yang disisihkan khusus untuk menghadapi situasi tak terduga — kehilangan pekerjaan, sakit mendadak, kendaraan rusak, atau kerusakan rumah.

## Berapa Besarnya?
- Lajang / tanpa tanggungan: 3–4 bulan pengeluaran
- Menikah / punya tanggungan: 6–12 bulan pengeluaran

Contoh: jika pengeluaran bulanan Rp 3.000.000, target dana darurat Rp 9.000.000 – Rp 36.000.000.

## Di Mana Menyimpannya?
Dana darurat harus **mudah diakses** tapi **tidak terlalu mudah digunakan**:
- Tabungan terpisah dari tabungan utama
- Rekening pasar uang (return lebih tinggi dari tabungan biasa)
- Hindari deposito berjangka karena ada penalti penarikan awal

## Cara Membangunnya
1. Mulai dari Rp 500.000 – Rp 1.000.000 sebagai langkah pertama.
2. Sisihkan 10–20% gaji setiap bulan khusus untuk pos ini.
3. Gunakan HANYA untuk kedaruratan sejati.
4. Isi kembali setelah digunakan.`,
  },
  {
    id: 3,
    icon: <TrendingUp size={28} />,
    judul: "Investasi untuk Pemula",
    ringkasan: "Mulai berinvestasi dengan modal kecil — kenali jenis investasi dan risiko masing-masing.",
    konten: `## Mengapa Harus Investasi?
Inflasi menggerus nilai uang Anda setiap tahun. Investasi adalah cara melawan inflasi dan membuat uang bekerja untuk Anda.

## Jenis Investasi untuk Pemula

### 1. Reksa Dana
- Cocok untuk pemula, modal awal sangat kecil (mulai Rp 10.000)
- Dikelola oleh manajer investasi profesional
- Tersedia: pasar uang, obligasi, saham, campuran

### 2. Emas
- Relatif aman dan stabil
- Bisa mulai dari 0,01 gram (digital)
- Cocok untuk tujuan jangka menengah-panjang

### 3. Obligasi Negara (SBN)
- Diterbitkan pemerintah — sangat aman
- Return lebih tinggi dari deposito
- Contoh: ORI, SBR, Sukuk Ritel

### 4. Saham
- Potensi return tinggi, tapi risiko juga tinggi
- Mulai dengan blue chip (saham perusahaan besar)

## Prinsip Dasar
- Jangan investasikan uang darurat
- Diversifikasi — jangan taruh semua telur di satu keranjang
- Mulai lebih awal — waktu adalah aset terbesar dalam investasi`,
  },
  {
    id: 4,
    icon: <CreditCard size={28} />,
    judul: "Mengelola Utang dengan Bijak",
    ringkasan: "Bedakan utang produktif dan konsumtif, serta cara melunasinya secara strategis.",
    konten: `## Utang Baik vs Utang Buruk

### Utang Produktif (Baik)
Utang yang digunakan untuk menghasilkan nilai atau aset:
- KPR untuk beli rumah
- Pinjaman modal usaha
- Kredit kendaraan untuk kerja

### Utang Konsumtif (Buruk)
Utang untuk memenuhi keinginan, bukan kebutuhan:
- Cicilan gadget terbaru
- Kartu kredit untuk belanja fashion
- Pinjaman online untuk liburan

## Aturan Utang Sehat
- Total cicilan **tidak boleh melebihi 30% penghasilan**
- Lunasi utang bunga tinggi (pinjol, kartu kredit) terlebih dulu
- Hindari menambah utang saat masih punya tunggakan

## Strategi Melunasi Utang

### Metode Avalanche
Lunasi utang dengan **bunga tertinggi** dulu — lebih hemat secara matematis.

### Metode Snowball
Lunasi utang dengan **jumlah terkecil** dulu — lebih memotivasi secara psikologis.`,
  },
  {
    id: 5,
    icon: <Target size={28} />,
    judul: "Menabung Lebih Efektif",
    ringkasan: "Teknik dan kebiasaan menabung agar target finansial tercapai lebih cepat dan konsisten.",
    konten: `## Prinsip "Bayar Diri Sendiri Dulu"
Jangan menabung dari sisa. sisihkan tabungan di awal saat gaji masuk, sebelum digunakan untuk hal lain.

## Teknik Menabung

### 1. Autodebet
Set auto-transfer ke rekening tabungan setiap tanggal gajian.

### 2. Tantangan 52 Minggu
- Minggu 1: Rp 10.000 — Minggu 2: Rp 20.000 — dst.
- Total akhir tahun: ± Rp 13.780.000

### 3. Round-Up Saving
Setiap transaksi, bulatkan ke atas dan selisihnya masuk tabungan.

### 4. Jar Method (Metode Toples)
Bagi uang ke 6 pos: kebutuhan, keinginan, tabungan, pendidikan, investasi, amal.

## Tetapkan Tujuan yang Spesifik
- Apa yang ingin dicapai (DP rumah, liburan, menikah)
- Berapa dana yang dibutuhkan
- Kapan targetnya
- Berapa yang harus ditabung per bulan`,
  },
  {
    id: 6,
    icon: <BarChart2 size={28} />,
    judul: "Skor Kesehatan Keuangan",
    ringkasan: "Apa arti skor kesehatan keuangan dan langkah konkret untuk meningkatkannya.",
    konten: `## Apa itu Skor Kesehatan Keuangan?
Skor kesehatan keuangan adalah angka yang menggambarkan seberapa baik kondisi finansial Anda secara keseluruhan.

## Komponen Penilaian
- Rasio tabungan — % penghasilan yang ditabung
- Rasio utang — cicilan vs penghasilan
- Dana darurat — sudah ada atau belum
- Cash flow — surplus atau defisit bulanan
- Konsistensi mencatat — frekuensi pencatatan transaksi

## Kategori Skor
- 80–100 — Excellent: keuangan sangat sehat
- 60–79 — Good: beberapa area perlu perhatian
- 40–59 — Fair: butuh perbaikan signifikan
- 0–39 — Poor: perlu evaluasi menyeluruh

## Cara Meningkatkan Skor
1. Catat SEMUA transaksi secara rutin
2. Kurangi rasio pengeluaran vs pendapatan
3. Bangun dana darurat minimal 3 bulan
4. Lunasi utang konsumtif
5. Tingkatkan porsi tabungan/investasi`,
  },
  {
    id: 7,
    icon: <Lightbulb size={28} />,
    judul: "Hemat Tanpa Menderita",
    ringkasan: "Tips cerdas mengurangi pengeluaran tanpa harus mengorbankan kualitas hidup.",
    konten: `## Mindset yang Benar
Berhemat bukan berarti pelit atau sengsara. Berhemat adalah tentang **mengalokasikan uang ke hal yang benar-benar penting** bagi Anda.

## Area Penghematan Terbesar

### Makanan & Minuman
- Masak di rumah 4–5x seminggu
- Bawa bekal ke kantor/kampus
- Manfaatkan promo dan diskon

### Transportasi
- Pertimbangkan transportasi umum untuk rute rutin
- Servis kendaraan rutin agar tidak ada kerusakan mendadak

### Langganan Digital
- Audit semua subscription — hapus yang jarang dipakai
- Gunakan paket keluarga untuk streaming bersama

### Belanja
- Tunggu 24–48 jam sebelum membeli barang non-urgen
- Buat daftar belanja dan patuhi

## Prinsip Minimalis
Lebih sedikit barang = lebih sedikit pengeluaran maintenance. Fokus pada pengalaman, bukan benda.`,
  },
  {
    id: 8,
    icon: <Clock size={28} />,
    judul: "Perencanaan Keuangan Jangka Panjang",
    ringkasan: "Rencanakan masa depan finansial Anda dari sekarang — pensiun, pendidikan anak, dan aset.",
    konten: `## Mengapa Perencanaan Jangka Panjang?
Tujuan besar butuh waktu panjang dan persiapan matang. Menunda satu tahun perencanaan pensiun bisa berarti kehilangan jutaan rupiah potensi return karena efek compounding.

## Tujuan Keuangan Jangka Panjang Umum

### 1. Dana Pensiun
- Idealnya mulai dari usia 25–30 tahun
- Target: 25x pengeluaran tahunan
- Manfaatkan BPJS Ketenagakerjaan (Jaminan Hari Tua)

### 2. Dana Pendidikan Anak
- Biaya pendidikan naik 10–15% per tahun
- Mulai sejak anak lahir atau bahkan sebelum menikah

### 3. Kepemilikan Properti
- Siapkan DP minimal 20–30% harga properti
- Hitung kemampuan cicilan (maks 30% penghasilan)

### 4. Asuransi Jiwa & Kesehatan
- Asuransi jiwa: minimal 10x penghasilan tahunan
- Asuransi kesehatan: pastikan cover rawat inap

## Kekuatan Compound Interest
Investasi Rp 500.000/bulan dengan return 12%/tahun:
- 10 tahun → ± Rp 115 juta
- 20 tahun → ± Rp 494 juta
- 30 tahun → ± Rp 1,76 miliar`,
  },
];

// About Tim 
const timList = [
  {
    nama: "Dewi Condro Resmi",
    nim: "052127231",
    peran: "Ketua Projek",
    avatar: "DCR",
    warna: "#0ea5e9",
  },
  {
    nama: "Rizal Putra Ilham",
    nim: "049813907",
    peran: "Anggota Projek",
    avatar: "RPI",
    warna: "#10b981",
  },
  {
    nama: "Sabina Insyirah Ifen",
    nim: "048406899",
    peran: "Anggota Projek",
    avatar: "SII",
    warna: "#8b5cf6",
  },
  {
      nama: "Muhamad Anggoro Muryansyah",
    nim: "048647641",
    peran: "Anggota Projek",
    avatar: "MAM",
    warna: "#f59e0b",
  },
  {
    nama: "Angga Saputra",
    nim: "049690599",
    peran: "Anggota Projek",
    avatar: "AS",
    warna: "#ef4444",
  },
];

// Modal 
function EdukasiModal({ item, onClose }) {
  if (!item) return null;
  const lines = item.konten.split("\n");
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div className={styles.modalIconWrap}>{item.icon}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2 className={styles.modalTitle}>{item.judul}</h2>
            <p className={styles.modalSubtitle}>{item.ringkasan}</p>
          </div>
          <button className={styles.modalClose} onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className={styles.modalBody}>
          {lines.map((line, i) => {
            if (line.startsWith("## "))  return <h3 key={i} className={styles.mdH2}>{line.slice(3)}</h3>;
            if (line.startsWith("### ")) return <h4 key={i} className={styles.mdH3}>{line.slice(4)}</h4>;
            if (line.startsWith("- "))  return <li key={i} className={styles.mdLi}>{line.slice(2)}</li>;
            if (/^\d+\. /.test(line))   return <li key={i} className={styles.mdLi}>{line.replace(/^\d+\. /, "")}</li>;
            if (line === "")            return <div key={i} className={styles.mdSpacer} />;
            const bold = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
            return <p key={i} className={styles.mdP} dangerouslySetInnerHTML={{ __html: bold }} />;
          })}
        </div>
      </div>
    </div>
  );
}

// ── Landing Page ──────────────────────────────────────────────────────────────
function Landing() {
  const [aktif, setAktif] = useState(null);

  return (
    <div className={styles.page}>
      <Navbar />

      {/* Hero */}
      <section className={styles.hero}>
        <div>
          <p className={styles.heroLabel}>Sistem Keuangan Pribadi Berbasis Web</p>
          <h1 className={styles.heroTitle}>Keuangan Sehat Dimulai dari Kebiasaan</h1>
          <p className={styles.heroDesc}>
            FinSight membantu pengguna mencatat transaksi, mengevaluasi kesehatan finansial,
            dan memahami pola perilaku konsumtif.
          </p>
          <p className={styles.heroSub}>
            Masalah keuangan bukan cuma angka, tapi perilaku dan platform ini membantu memperbaikinya.
          </p>
          <div className={styles.heroCta}>
            <a href="#edukasi" className={styles.ctaPrimary}>Edukasi</a>
            <a href="#fitur" className={styles.ctaSecondary}>Lihat Fitur</a>
            <a href="https://bit.ly/4dS69t7" target="_blank" rel="noopener noreferrer" className={styles.ctaKuesioner}>
              Isi Kuesioner
            </a>
          </div>
        </div>

        <div className={styles.previewCard}>
          <h2 className={styles.previewTitle}>Understand. Control. Grow.</h2>
          <div className={styles.previewList}>
            <div className={styles.previewItemSky}>
              <p className={styles.previewItemTitle}>Financial Health Score</p>
              <p className={styles.previewItemDesc}>Evaluasi kondisi keuangan dengan skor 0–100.</p>
            </div>
            <div className={styles.previewItemGreen}>
              <p className={styles.previewItemTitle}>Insight Otomatis</p>
              <p className={styles.previewItemDesc}>Temukan pola konsumsi dan kondisi finansial Anda secara otomatis.</p>
            </div>
            <div className={styles.previewItemYellow}>
              <p className={styles.previewItemTitle}>Warning System</p>
              <p className={styles.previewItemDesc}>Dapatkan peringatan jika kondisi finansial mulai berisiko.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Fitur */}
      <section id="fitur" className={styles.featureSection}>
        <h2 className={styles.featureSectionTitle}>Fitur Utama FinSight</h2>
        <div className={styles.featureGrid}>
          <div className={styles.featureCard}>
            <h3 className={styles.featureCardTitle}>Pencatatan Transaksi</h3>
            <p className={styles.featureCardDesc}>Catat pemasukan dan pengeluaran harian secara terstruktur.</p>
          </div>
          <div className={styles.featureCard}>
            <h3 className={styles.featureCardTitle}>Evaluasi Kesehatan Finansial</h3>
            <p className={styles.featureCardDesc}>Analisis saving ratio, expense ratio, cash flow, dan konsumtif.</p>
          </div>
          <div className={styles.featureCard}>
            <h3 className={styles.featureCardTitle}>Rekomendasi Penghematan</h3>
            <p className={styles.featureCardDesc}>Dapatkan saran sederhana untuk memperbaiki kondisi keuangan.</p>
          </div>
        </div>
      </section>

      {/* Edukasi */}
      <section id="edukasi" className={styles.eduSection}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionHead}>
            <BookOpen size={22} className={styles.sectionIcon} />
            <div>
              <h2 className={styles.sectionHeading}>Edukasi Keuangan</h2>
              <p className={styles.sectionDesc}>Tingkatkan literasi keuangan Anda dengan materi pilihan</p>
            </div>
          </div>
          <div className={styles.eduGrid}>
            {edukasiList.map((item) => (
              <button key={item.id} className={styles.eduCard} onClick={() => setAktif(item)}>
                <div className={styles.eduCardIcon}>{item.icon}</div>
                <h3 className={styles.eduCardTitle}>{item.judul}</h3>
                <p className={styles.eduCardDesc}>{item.ringkasan}</p>
                <span className={styles.eduCardLink}>Baca selengkapnya →</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="tentang" className={styles.aboutSection}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionHead}>
            <Users size={22} className={styles.sectionIcon} />
            <div>
              <h2 className={styles.sectionHeading}>Tentang Tim</h2>
              <p className={styles.sectionDesc}>Mahasiswa di balik pengembangan aplikasi FinSight</p>
            </div>
          </div>
          <div className={styles.teamGrid}>
            {timList.map((anggota, i) => (
              <div key={i} className={styles.teamCard}>
                <div className={styles.teamAvatar} style={{ backgroundColor: anggota.warna }}>
                  {anggota.avatar}
                </div>
                <p className={styles.teamNama}>{anggota.nama}</p>
                <p className={styles.teamNim}>NIM {anggota.nim}</p>
                <span className={styles.teamPeran} style={{ borderColor: anggota.warna, color: anggota.warna }}>
                  {anggota.peran}
                </span>
                <p className={styles.teamDesc}>{anggota.deskripsi}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <EdukasiModal item={aktif} onClose={() => setAktif(null)} />
      <Footer />
    </div>
  );
}

export default Landing;
