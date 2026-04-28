import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import styles from "../styles/pages/Landing.module.css";

function Landing() {
  return (
    <div className={styles.page}>
      <Navbar />

      <section className={styles.hero}>
        <div>
          <p className={styles.heroLabel}>
            Sistem Keuangan Pribadi Berbasis Web
          </p>
          <h1 className={styles.heroTitle}>
            Know Your Habits. Master Your Money.
          </h1>
          <p className={styles.heroDesc}>
            FinSight membantu pengguna mencatat transaksi, mengevaluasi
            kesehatan finansial, dan memahami pola perilaku konsumtif.
          </p>
          <p className={styles.heroSub}>
            Masalah keuangan bukan cuma angka, tapi perilaku — dan platform ini
            membantu memperbaikinya.
          </p>
          <div className={styles.heroCta}>
            <Link to="/dashboard" className={styles.ctaPrimary}>
              Mulai Sekarang
            </Link>
            <a href="#fitur" className={styles.ctaSecondary}>
              Lihat Fitur
            </a>
          </div>
        </div>

        <div className={styles.previewCard}>
          <h2 className={styles.previewTitle}>Understand. Control. Grow.</h2>
          <div className={styles.previewList}>
            <div className={styles.previewItemSky}>
              <p className={styles.previewItemTitle}>Financial Health Score</p>
              <p className={styles.previewItemDesc}>
                Evaluasi kondisi keuangan dengan skor 0–100.
              </p>
            </div>
            <div className={styles.previewItemGreen}>
              <p className={styles.previewItemTitle}>Insight Otomatis</p>
              <p className={styles.previewItemDesc}>
                Pahami pola pengeluaran tanpa membaca angka mentah.
              </p>
            </div>
            <div className={styles.previewItemYellow}>
              <p className={styles.previewItemTitle}>Warning System</p>
              <p className={styles.previewItemDesc}>
                Dapatkan peringatan jika kondisi finansial mulai berisiko.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="fitur" className={styles.featureSection}>
        <h2 className={styles.featureSectionTitle}>Fitur Utama FinSight</h2>
        <div className={styles.featureGrid}>
          <div className={styles.featureCard}>
            <h3 className={styles.featureCardTitle}>Pencatatan Transaksi</h3>
            <p className={styles.featureCardDesc}>
              Catat pemasukan dan pengeluaran harian secara terstruktur.
            </p>
          </div>
          <div className={styles.featureCard}>
            <h3 className={styles.featureCardTitle}>Evaluasi Kesehatan Finansial</h3>
            <p className={styles.featureCardDesc}>
              Analisis saving ratio, expense ratio, cash flow, dan konsumtif.
            </p>
          </div>
          <div className={styles.featureCard}>
            <h3 className={styles.featureCardTitle}>Rekomendasi Penghematan</h3>
            <p className={styles.featureCardDesc}>
              Dapatkan saran sederhana untuk memperbaiki kondisi keuangan.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Landing;
