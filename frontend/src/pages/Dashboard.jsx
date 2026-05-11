import { useState, useEffect } from "react";
import {
  TrendingUp, TrendingDown, Wallet,
  CheckCircle2, AlertTriangle, ClipboardList, X,
} from "lucide-react";
import Swal from "sweetalert2";
import Sidebar from "../components/Sidebar.jsx";
import Footer from "../components/Footer.jsx";
import StatCard from "../components/StatCard.jsx";
import HealthScoreCard from "../components/HealthScoreCard.jsx";
import { getDashboard } from "../services/financeService.js";
import { checkSurvey, submitSurvey } from "../services/surveyService.js";
import { useAuth } from "../context/AuthContext.jsx";
import styles from "../styles/pages/Dashboard.module.css";

const formatRupiah = (angka) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(angka);

const MONTHS_FULL = [
  "Januari","Februari","Maret","April","Mei","Juni",
  "Juli","Agustus","September","Oktober","November","Desember",
];

function LoadingScreen() {
  return (
    <div className={styles.page}>
      <div className={styles.body}>
        <Sidebar />
        <main className={styles.centeredMain}>
          <div className={styles.loadingBox}>
            <div className={styles.spinner} />
            <p className={styles.loadingText}>Memuat data keuangan...</p>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}

function ErrorScreen({ message }) {
  return (
    <div className={styles.page}>
      <div className={styles.body}>
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
      <Footer />
    </div>
  );
}

function LikertRow({ value, onChange }) {
  return (
    <div className={styles.likertRow}>
      <span className={styles.likertEnd}>Sangat Buruk</span>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          className={`${styles.likertBtn} ${value === n ? styles.likertBtnActive : ""}`}
          onClick={() => onChange(n)}
        >
          {n}
        </button>
      ))}
      <span className={styles.likertEnd}>Sangat Baik</span>
    </div>
  );
}

function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showBanner, setShowBanner] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [lastMonthLabel, setLastMonthLabel] = useState("");
  const [lastMonthPeriod, setLastMonthPeriod] = useState(null);
  const [satisfaction, setSatisfaction] = useState(3);
  const [security, setSecurity] = useState(3);
  const [confidence, setConfidence] = useState(3);
  const [surveyNote, setSurveyNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getDashboard(user.id)
      .then((res) => setData(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const today = new Date();
    if (today.getDate() > 7) return;

    const lastMonth = today.getMonth() === 0
      ? { year: today.getFullYear() - 1, month: 12 }
      : { year: today.getFullYear(), month: today.getMonth() };

    setLastMonthPeriod(lastMonth);
    setLastMonthLabel(`${MONTHS_FULL[lastMonth.month - 1]} ${lastMonth.year}`);

    checkSurvey(user.id, lastMonth.year, lastMonth.month)
      .then((res) => { if (!res.data.exists) setShowBanner(true); })
      .catch(() => {});
  }, []);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await submitSurvey({
        user_id: user.id,
        period_year: lastMonthPeriod.year,
        period_month: lastMonthPeriod.month,
        financial_satisfaction: satisfaction,
        financial_security: security,
        financial_confidence: confidence,
        note: surveyNote,
      });
      setShowModal(false);
      setShowBanner(false);
      Swal.fire({
        icon: "success",
        title: "Evaluasi Tersimpan",
        text: `Penilaian keuangan ${lastMonthLabel} berhasil dicatat.`,
        timer: 2500,
        showConfirmButton: false,
        toast: true,
        position: "top-end",
      });
    } catch (e) {
      Swal.fire({ icon: "error", title: "Gagal menyimpan", text: e.message });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen message={error} />;

  return (
    <div className={styles.page}>
      <div className={styles.body}>
        <Sidebar />

        <main className={styles.main}>
          <div className={styles.header}>
            <p className={styles.label}>Dashboard</p>
            <h1 className={styles.title}>Ringkasan Keuangan</h1>
          </div>

          {showBanner && (
            <div className={styles.surveyBanner}>
              <ClipboardList size={22} className={styles.surveyBannerIcon} />
              <div className={styles.surveyBannerContent}>
                <p className={styles.surveyBannerTitle}>
                  Evaluasi Keuangan Bulan {lastMonthLabel}
                </p>
                <p className={styles.surveyBannerDesc}>
                  Lengkapi penilaian Subjektif (S) dalam framework OBS untuk mendapatkan skor
                  kesehatan finansial yang lebih akurat. Hanya 3 pertanyaan singkat.
                </p>
              </div>
              <button className={styles.surveyBannerBtn} onClick={() => setShowModal(true)}>
                Isi Sekarang
              </button>
              <button className={styles.surveyBannerClose} onClick={() => setShowBanner(false)} aria-label="Tutup">
                <X size={16} />
              </button>
            </div>
          )}

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

          <div className={styles.insightPanel}>
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

            {data.insight.length === 0 && data.warning.length === 0 && (
              <p className={styles.emptyText}>
                Belum ada insight. Tambahkan transaksi untuk memulai analisis.
              </p>
            )}
          </div>

          <HealthScoreCard score={data.skorKesehatan} />
        </main>
      </div>
      <Footer />

      {showModal && (
        <div className={styles.modalOverlay} onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div className={styles.modalCard}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitleRow}>
                <ClipboardList size={18} className={styles.modalTitleIcon} />
                <h2 className={styles.modalTitle}>Evaluasi Keuangan {lastMonthLabel}</h2>
              </div>
              <button className={styles.modalCloseBtn} onClick={() => setShowModal(false)}>
                <X size={18} />
              </button>
            </div>

            <p className={styles.modalSubtitle}>
              Penilaian ini merupakan komponen Subjektif (S) dalam analisis OBS — mencerminkan
              perasaan Anda terhadap kondisi keuangan bulan lalu. Skala 1 (sangat buruk) hingga 5 (sangat baik).
            </p>

            <div className={styles.questionBlock}>
              <p className={styles.questionLabel}>1. Seberapa puas Anda dengan kondisi keuangan bulan lalu?</p>
              <LikertRow value={satisfaction} onChange={setSatisfaction} />
            </div>

            <div className={styles.questionBlock}>
              <p className={styles.questionLabel}>2. Seberapa aman Anda merasa secara finansial?</p>
              <LikertRow value={security} onChange={setSecurity} />
            </div>

            <div className={styles.questionBlock}>
              <p className={styles.questionLabel}>3. Seberapa percaya diri Anda dalam mengelola keuangan?</p>
              <LikertRow value={confidence} onChange={setConfidence} />
            </div>

            <div className={styles.questionBlock}>
              <p className={styles.questionLabel}>Catatan <span className={styles.optionalTag}>(opsional)</span></p>
              <textarea
                className={styles.noteField}
                rows={3}
                placeholder="Tuliskan catatan atau konteks tambahan..."
                value={surveyNote}
                onChange={(e) => setSurveyNote(e.target.value)}
              />
            </div>

            <div className={styles.modalFooter}>
              <button className={styles.modalCancelBtn} onClick={() => setShowModal(false)}>
                Nanti Saja
              </button>
              <button
                className={styles.modalSubmitBtn}
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? "Menyimpan..." : "Simpan Evaluasi"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
