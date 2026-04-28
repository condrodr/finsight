import { BarChart3 } from "lucide-react";
import Sidebar from "../components/Sidebar.jsx";
import styles from "../styles/pages/Laporan.module.css";

function Laporan() {
  return (
    <div className={styles.page}>
      <Sidebar />
      <main className={styles.main}>
        <div className={styles.header}>
          <p className={styles.label}>Analisis</p>
          <h1 className={styles.title}>Laporan Keuangan</h1>
          <p className={styles.subtitle}>Visualisasi tren dan pola keuangan Anda.</p>
        </div>

        <div className={styles.placeholder}>
          <div className={styles.iconWrap}>
            <BarChart3 size={28} className="text-sky-400" />
          </div>
          <p className={styles.placeholderTitle}>Laporan sedang dalam pengembangan</p>
          <p className={styles.placeholderDesc}>
            Grafik tren pendapatan, pengeluaran, dan analisis mendalam akan segera hadir.
          </p>
        </div>
      </main>
    </div>
  );
}

export default Laporan;
