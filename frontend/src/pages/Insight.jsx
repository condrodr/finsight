import { Lightbulb } from "lucide-react";
import Sidebar from "../components/Sidebar.jsx";
import styles from "../styles/pages/Insight.module.css";

function Insight() {
  return (
    <div className={styles.page}>
      <Sidebar />
      <main className={styles.main}>
        <div className={styles.header}>
          <p className={styles.label}>Rekomendasi</p>
          <h1 className={styles.title}>Insight & Saran</h1>
          <p className={styles.subtitle}>
            Rekomendasi personal untuk memperbaiki kondisi keuangan Anda.
          </p>
        </div>

        <div className={styles.placeholder}>
          <div className={styles.iconWrap}>
            <Lightbulb size={28} className="text-yellow-400" />
          </div>
          <p className={styles.placeholderTitle}>Insight sedang dalam pengembangan</p>
          <p className={styles.placeholderDesc}>
            Saran personal berdasarkan pola perilaku keuangan Anda akan segera hadir.
          </p>
        </div>
      </main>
    </div>
  );
}

export default Insight;
