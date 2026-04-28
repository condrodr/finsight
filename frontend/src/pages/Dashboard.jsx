import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, Wallet, CheckCircle2, AlertTriangle } from "lucide-react";
import Sidebar from "../components/Sidebar.jsx";
import StatCard from "../components/StatCard.jsx";
import HealthScoreCard from "../components/HealthScoreCard.jsx";
import { getDashboard } from "../services/financeService.js";
import { useAuth } from "../context/AuthContext.jsx";
import styles from "../styles/pages/Dashboard.module.css";

const formatRupiah = (angka) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(angka);

function LoadingScreen() {
  return (
    <div className={styles.page}>
      <Sidebar />
      <main className={styles.centeredMain}>
        <div className={styles.loadingBox}>
          <div className={styles.spinner} />
          <p className={styles.loadingText}>Memuat data keuangan...</p>
        </div>
      </main>
    </div>
  );
}

function ErrorScreen({ message }) {
  return (
    <div className={styles.page}>
      <Sidebar />
      <main className={styles.centeredMain}>
        <div className={styles.errorBox}>
          <div className={styles.errorIcon}>
            <AlertTriangle size={24} className="text-red-500" />
          </div>
          <p className={styles.errorTitle}>Gagal memuat data</p>
          <p className={styles.errorMsg}>{message}</p>
          <p className={styles.errorHint}>Pastikan backend berjalan di localhost:5000</p>
        </div>
      </main>
    </div>
  );
}

function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getDashboard(user.id)
      .then((res) => setData(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen message={error} />;

  return (
    <div className={styles.page}>
      <Sidebar />

      <main className={styles.main}>
        <div className={styles.header}>
          <p className={styles.label}>Dashboard</p>
          <h1 className={styles.title}>Ringkasan Keuangan</h1>
          <p className={styles.subtitle}>Understand. Control. Grow.</p>
        </div>

        <div className={styles.statsGrid}>
          <StatCard
            title="Total Pendapatan"
            value={formatRupiah(data.totalPendapatan)}
            description="Total pemasukan periode ini"
            icon={<TrendingUp size={20} />}
            accent="green"
          />
          <StatCard
            title="Total Pengeluaran"
            value={formatRupiah(data.totalPengeluaran)}
            description="Total pengeluaran periode ini"
            icon={<TrendingDown size={20} />}
            accent="red"
          />
          <StatCard
            title="Saldo Akhir"
            value={formatRupiah(data.saldoAkhir)}
            description="Pendapatan dikurangi pengeluaran"
            icon={<Wallet size={20} />}
            accent={data.saldoAkhir >= 0 ? "sky" : "red"}
          />
        </div>

        <div className={styles.bottomGrid}>
          <HealthScoreCard score={data.skorKesehatan} />

          <div className={styles.insightPanel}>
            {data.insight.length > 0 && (
              <div className={styles.insightBlock}>
                <h2 className={styles.sectionTitle}>
                  <CheckCircle2 size={18} className="text-sky-500" />
                  Insight Otomatis
                </h2>
                <div className={styles.itemList}>
                  {data.insight.map((item, i) => (
                    <div key={i} className={styles.insightItem}>{item}</div>
                  ))}
                </div>
              </div>
            )}

            {data.warning.length > 0 && (
              <div>
                <h2 className={styles.sectionTitle}>
                  <AlertTriangle size={18} className="text-yellow-500" />
                  Peringatan
                </h2>
                <div className={styles.itemList}>
                  {data.warning.map((item, i) => (
                    <div key={i} className={styles.warningItem}>{item}</div>
                  ))}
                </div>
              </div>
            )}

            {data.insight.length === 0 && data.warning.length === 0 && (
              <p className={styles.emptyText}>
                Belum ada insight. Tambahkan transaksi untuk memulai analisis.
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
