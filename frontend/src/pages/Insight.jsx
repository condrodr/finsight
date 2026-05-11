import { useState, useEffect, useMemo } from "react";
import {
  AlertTriangle, CheckCircle2, ShoppingBag,
  Home, TrendingUp, Lightbulb, Activity,
} from "lucide-react";
import { getDashboard } from "../services/financeService.js";
import { useAuth } from "../context/AuthContext.jsx";
import Sidebar from "../components/Sidebar.jsx";
import Footer from "../components/Footer.jsx";
import styles from "../styles/pages/Insight.module.css";

const formatRupiah = (n) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

const HEALTH_META = {
  "Sangat Sehat": { bg: "#f0fdf4", text: "#15803d", border: "#bbf7d0", bar: "#22c55e" },
  "Sehat":        { bg: "#f0f9ff", text: "#0369a1", border: "#bae6fd", bar: "#0ea5e9" },
  "Cukup":        { bg: "#fffbeb", text: "#b45309", border: "#fde68a", bar: "#f59e0b" },
  "Berisiko":     { bg: "#fff7ed", text: "#c2410c", border: "#fed7aa", bar: "#fb923c" },
  "Tidak Sehat":  { bg: "#fef2f2", text: "#dc2626", border: "#fecaca", bar: "#f87171" },
};

function getCategory(score) {
  if (score >= 80) return "Sangat Sehat";
  if (score >= 60) return "Sehat";
  if (score >= 40) return "Cukup";
  if (score >= 20) return "Berisiko";
  return "Tidak Sehat";
}

function ScoreBar({ label, score, max, color, desc }) {
  const pct = max > 0 ? Math.round((score / max) * 100) : 0;
  return (
    <div className={styles.dimBar}>
      <div className={styles.dimBarHeader}>
        <span className={styles.dimLabel}>{label}</span>
        <span className={styles.dimScore}>{score}<span className={styles.dimMax}>/{max}</span></span>
      </div>
      <div className={styles.dimTrack}>
        <div className={styles.dimFill} style={{ width: `${pct}%`, background: color }} />
      </div>
      {desc && <p className={styles.dimDesc}>{desc}</p>}
    </div>
  );
}

function GroupBlock({ title, icon: Icon, iconColor, items, total, emptyMsg }) {
  if (items.length === 0) return (
    <div className={styles.groupCard}>
      <div className={styles.groupHeader}>
        <Icon size={16} style={{ color: iconColor }} />
        <span className={styles.groupTitle}>{title}</span>
        <span className={styles.groupTotal}>{formatRupiah(0)}</span>
      </div>
      <p className={styles.groupEmpty}>{emptyMsg}</p>
    </div>
  );

  return (
    <div className={styles.groupCard}>
      <div className={styles.groupHeader}>
        <Icon size={16} style={{ color: iconColor }} />
        <span className={styles.groupTitle}>{title}</span>
        <span className={styles.groupTotal}>{formatRupiah(total)}</span>
      </div>
      <div className={styles.groupRows}>
        {items.map((item, i) => (
          <div key={i} className={styles.groupRow}>
            <div className={styles.groupRowLeft}>
              <div className={styles.groupBar} style={{ background: `${iconColor}20` }}>
                <div className={styles.groupBarFill}
                  style={{ width: `${item.pct}%`, background: iconColor }} />
              </div>
              <span className={styles.groupCat}>{item.category}</span>
            </div>
            <div className={styles.groupRowRight}>
              <span className={styles.groupAmt}>{formatRupiah(item.total)}</span>
              <span className={styles.groupPct}>{item.pct}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Insight() {
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

  if (loading) return (
    <div className={styles.page}>
      <div className={styles.body}>
        <Sidebar />
        <main className={styles.main}>
          <div className={styles.loadingBox}><div className={styles.spinner} /><p className={styles.loadingText}>Menganalisis data...</p></div>
        </main>
      </div>
      <Footer />
    </div>
  );

  if (error) return (
    <div className={styles.page}>
      <div className={styles.body}>
        <Sidebar />
        <main className={styles.main}>
          <div className={styles.errorBox}>
            <AlertTriangle size={24} className={styles.errorIcon} />
            <p className={styles.errorTitle}>Gagal memuat insight</p>
            <p className={styles.errorMsg}>{error}</p>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );

  const cat      = getCategory(data.skorKesehatan);
  const meta     = HEALTH_META[cat];
  const konsumtifTotal  = data.kategori.konsumtif.reduce((s, k) => s + k.total, 0);
  const kebutuhanTotal  = data.kategori.kebutuhan.reduce((s, k) => s + k.total, 0);
  const produktifTotal  = data.kategori.produktif.reduce((s, k) => s + k.total, 0);

  const dimDescs = {
    tabungan: data.dimensiSkor.tabungan >= 30
      ? "Saving ratio sangat baik, Anda menyisihkan cukup besar dari pendapatan."
      : data.dimensiSkor.tabungan >= 20
      ? "Saving ratio baik, coba tingkatkan lebih lanjut."
      : data.dimensiSkor.tabungan >= 10
      ? "Saving ratio masih rendah, perlu ditingkatkan."
      : "Saving ratio sangat rendah atau negatif.",
    cashFlow: data.dimensiSkor.cashFlow >= 30
      ? "Arus kas positif, pengeluaran terkontrol di bawah pendapatan."
      : data.dimensiSkor.cashFlow >= 10
      ? "Arus kas seimbang (break-even)."
      : "Arus kas negatif, pengeluaran melebihi pendapatan.",
    konsumtif: data.dimensiSkor.konsumtif >= 30
      ? "Pengeluaran konsumtif sangat terkendali."
      : data.dimensiSkor.konsumtif >= 20
      ? "Pengeluaran konsumtif masih terkendali, pertahankan."
      : data.dimensiSkor.konsumtif >= 10
      ? "Pengeluaran konsumtif cukup tinggi, coba dikurangi."
      : "Pengeluaran konsumtif sangat tinggi (≥70% dari total).",
  };

  return (
    <div className={styles.page}>
      <div className={styles.body}>
        <Sidebar />

        <main className={styles.main}>
          {/* Header */}
          <div className={styles.header}>
            <p className={styles.label}>Rekomendasi</p>
            <h1 className={styles.title}>Insight & Saran</h1>
            <p className={styles.subtitle}>Analisis mendalam kondisi keuangan Anda.</p>
          </div>

          {/* Score Overview */}
          <div className={styles.scoreCard}>
            <div className={styles.scoreLeft}>
              <p className={styles.scoreMeta}>Skor Kesehatan Finansial</p>
              <div className={styles.scoreCircle} style={{ borderColor: meta.bar }}>
                <span className={styles.scoreNumber} style={{ color: meta.bar }}>{data.skorKesehatan}</span>
                <span className={styles.scoreMax}>/100</span>
              </div>
              <span className={styles.scoreBadge}
                style={{ background: meta.bg, color: meta.text, borderColor: meta.border }}>
                {cat}
              </span>
            </div>

            <div className={styles.scoreDims}>
              <p className={styles.dimsTitle}>Breakdown Dimensi</p>
              <ScoreBar label="Saving (Tabungan)"   score={data.dimensiSkor.tabungan}  max={40} color="#22c55e" desc={dimDescs.tabungan} />
              <ScoreBar label="Cash Flow (Arus Kas)" score={data.dimensiSkor.cashFlow}  max={30} color="#0ea5e9" desc={dimDescs.cashFlow} />
              <ScoreBar label="Konsumtif"            score={data.dimensiSkor.konsumtif} max={30} color="#f59e0b" desc={dimDescs.konsumtif} />
            </div>
          </div>

          {/* Category Analysis */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <Activity size={18} className={styles.sectionIcon} />
              Analisis Pengeluaran
            </h2>
            <div className={styles.groupsGrid}>
              <GroupBlock
                title="Konsumtif"
                icon={ShoppingBag}
                iconColor="#f87171"
                items={data.kategori.konsumtif}
                total={konsumtifTotal}
                emptyMsg="Tidak ada pengeluaran konsumtif."
              />
              <GroupBlock
                title="Kebutuhan"
                icon={Home}
                iconColor="#0ea5e9"
                items={data.kategori.kebutuhan}
                total={kebutuhanTotal}
                emptyMsg="Tidak ada pengeluaran kebutuhan."
              />
              <GroupBlock
                title="Produktif & Investasi"
                icon={TrendingUp}
                iconColor="#22c55e"
                items={data.kategori.produktif}
                total={produktifTotal}
                emptyMsg="Belum ada pengeluaran produktif."
              />
            </div>
          </div>

          {/* Warnings */}
          {data.warning.length > 0 && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <AlertTriangle size={18} className={styles.sectionIconWarn} />
                Peringatan
              </h2>
              <div className={styles.cardList}>
                {data.warning.map((w, i) => (
                  <div key={i} className={styles.warnCard}>
                    <AlertTriangle size={15} className={styles.warnIcon} />
                    <p className={styles.cardText}>{w}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Insights */}
          {data.insight.length > 0 && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <Lightbulb size={18} className={styles.sectionIconInfo} />
                Insight Otomatis
              </h2>
              <div className={styles.cardList}>
                {data.insight.map((ins, i) => (
                  <div key={i} className={styles.infoCard}>
                    <CheckCircle2 size={15} className={styles.infoIcon} />
                    <p className={styles.cardText}>{ins}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.warning.length === 0 && data.insight.length === 0 && (
            <div className={styles.emptyState}>
              <Lightbulb size={28} className={styles.emptyIcon} />
              <p className={styles.emptyTitle}>Belum ada insight</p>
              <p className={styles.emptyDesc}>Tambahkan transaksi untuk memulai analisis keuangan Anda.</p>
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default Insight;
