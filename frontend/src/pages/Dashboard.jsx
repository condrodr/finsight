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
import { checkSurvey, getSurvey, submitSurvey } from "../services/surveyService.js";
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
  const [currentSurveyMonth, setCurrentSurveyMonth] = useState("");
  const [satisfaction, setSatisfaction] = useState(3);
  const [security, setSecurity] = useState(3);
  const [confidence, setConfidence] = useState(3);
  const [surveyNote, setSurveyNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [prevSurvey, setPrevSurvey] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [surveyExists, setSurveyExists] = useState(false);

  useEffect(() => {
    const today = new Date();
    const params = `?year=${today.getFullYear()}&month=${today.getMonth() + 1}`;
    getDashboard(user.id, params)
      .then((res) => setData(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const today = new Date();
    const todayDate = today.getDate();
    let targetMonth, targetYear;

    // Tampilkan survey dari tgl 25-31 bulan ini atau tgl 1-7 bulan depan
    // Keduanya untuk survey bulan ini (bulan 25-akhir atau bulan depan awal)
    if (todayDate >= 25) {
      // Hari 25-31: survey untuk bulan ini
      targetMonth = today.getMonth() + 1;
      targetYear = today.getFullYear();
    } else if (todayDate <= 7) {
      // Hari 1-7: survey untuk bulan lalu
      const lastMonth = today.getMonth() === 0
        ? { year: today.getFullYear() - 1, month: 12 }
        : { year: today.getFullYear(), month: today.getMonth() };
      targetMonth = lastMonth.month;
      targetYear = lastMonth.year;
    } else {
      // Hari 8-24: jangan tampilkan banner
      return;
    }

    setCurrentSurveyMonth(`${MONTHS_FULL[targetMonth - 1]} ${targetYear}`);

    // Get previous month untuk default value
    const prevMonth = targetMonth === 1 ? 12 : targetMonth - 1;
    const prevYear = targetMonth === 1 ? targetYear - 1 : targetYear;
    const lastMonth = { year: prevYear, month: prevMonth };

    setLastMonthPeriod(lastMonth);
    setLastMonthLabel(`${MONTHS_FULL[lastMonth.month - 1]} ${lastMonth.year}`);

    // Cek apakah survey bulan target sudah ada
    checkSurvey(user.id, targetYear, targetMonth)
      .then((res) => {
        setSurveyExists(res.data.exists);

        if (res.data.exists) {
          // Survey sudah ada, fetch untuk edit
          return getSurvey(user.id, targetYear, targetMonth)
            .then((surveyRes) => {
              if (surveyRes && surveyRes.data) {
                setPrevSurvey(surveyRes.data);
                setSatisfaction(surveyRes.data.financial_satisfaction || 3);
                setSecurity(surveyRes.data.financial_security || 3);
                setConfidence(surveyRes.data.financial_confidence || 3);
                setSurveyNote(surveyRes.data.note || "");
                setIsEditing(true);
              }
              // Tetap tampilkan banner agar user bisa edit
              setShowBanner(true);
            });
        }

        // Survey belum ada, fetch survey bulan lalu sebagai default
        return getSurvey(user.id, lastMonth.year, lastMonth.month)
          .then((surveyRes) => {
            if (surveyRes && surveyRes.data) {
              // Set default dari survey bulan lalu
              setPrevSurvey(surveyRes.data);
              setSatisfaction(surveyRes.data.financial_satisfaction || 3);
              setSecurity(surveyRes.data.financial_security || 3);
              setConfidence(surveyRes.data.financial_confidence || 3);
              setSurveyNote(surveyRes.data.note || "");
            }
            // Tampilkan banner
            setShowBanner(true);
          });
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const today = new Date();
      await submitSurvey({
        user_id: user.id,
        period_year: today.getFullYear(),
        period_month: today.getMonth() + 1,
        financial_satisfaction: satisfaction,
        financial_security: security,
        financial_confidence: confidence,
        note: surveyNote,
      });
      setShowModal(false);
      setShowBanner(false);
      setIsEditing(false);

      Swal.fire({
        icon: "success",
        title: "Evaluasi Tersimpan",
        text: `Penilaian keuangan bulan ini berhasil dicatat.`,
        timer: 2500,
        showConfirmButton: false,
        toast: true,
        position: "top-end",
      });

      // Refetch dashboard data setelah survey disimpan
      setTimeout(() => {
        getDashboard(user.id)
          .then((res) => setData(res.data))
          .catch((err) => console.error(err));
      }, 1500);
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
            <p className={styles.subtitle}>
              {MONTHS_FULL[new Date().getMonth()]} {new Date().getFullYear()} — Bulan Ini
            </p>
          </div>

          {showBanner && (
            <div className={styles.surveyBanner}>
              <ClipboardList size={22} className={styles.surveyBannerIcon} />
              <div className={styles.surveyBannerContent}>
                <p className={styles.surveyBannerTitle}>
                  Evaluasi Keuangan {currentSurveyMonth}
                </p>
                <p className={styles.surveyBannerDesc}>
                  {surveyExists && prevSurvey
                    ? `Survey ${currentSurveyMonth} sudah diisi. Apakah Anda ingin mengubahnya?`
                    : prevSurvey
                    ? `Apakah jawaban Anda sama seperti ${lastMonthLabel}? Jika berbeda, silakan update penilaian Anda.`
                    : `Lengkapi penilaian Subjektif untuk mendapatkan skor kesehatan finansial yang lebih akurat. Hanya 3 pertanyaan singkat.`
                  }
                </p>
              </div>
              <button className={styles.surveyBannerBtn} onClick={() => setShowModal(true)}>
                {surveyExists ? "Ubah" : "Isi Sekarang"}
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
          </div>

          <div className={styles.statsGrid}>
            <StatCard
              title="Saldo Akhir"
              value={formatRupiah(data.saldoAkhir)}
              description="Pendapatan dikurangi pengeluaran"
              icon={<Wallet size={20} />}
              accent={data.saldoAkhir >= 0 ? "sky" : "red"}
            />
            <HealthScoreCard score={data.skorKesehatan} hasSurvey={data.surveyTersedia} />
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
        </main>
      </div>
      <Footer />

      {showModal && (
        <div className={styles.modalOverlay} onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div className={styles.modalCard}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitleRow}>
                <ClipboardList size={18} className={styles.modalTitleIcon} />
                <h2 className={styles.modalTitle}>Evaluasi Keuangan {currentSurveyMonth}</h2>
              </div>
              <button className={styles.modalCloseBtn} onClick={() => setShowModal(false)}>
                <X size={18} />
              </button>
            </div>

            {!isEditing && !surveyExists && prevSurvey ? (
              <>
                <p className={styles.modalSubtitle}>
                  Anda memiliki evaluasi dari bulan lalu ({lastMonthLabel}). Apakah jawaban Anda tetap sama?
                </p>

                <div style={{ background: "#f0fdf4", padding: "12px", borderRadius: "6px", marginBottom: "16px", fontSize: "0.9rem" }}>
                  <p><strong>Kepuasan:</strong> {prevSurvey.financial_satisfaction}/5</p>
                  <p><strong>Keamanan:</strong> {prevSurvey.financial_security}/5</p>
                  <p><strong>Kepercayaan diri:</strong> {prevSurvey.financial_confidence}/5</p>
                  {prevSurvey.note && <p><strong>Catatan:</strong> {prevSurvey.note}</p>}
                </div>

                <div className={styles.modalFooter}>
                  <button className={styles.modalCancelBtn} onClick={() => setShowModal(false)}>
                    Nanti Saja
                  </button>
                  <button
                    style={{ background: "#22c55e" }}
                    className={styles.modalSubmitBtn}
                    onClick={handleSubmit}
                    disabled={submitting}
                  >
                    {submitting ? "Menyimpan..." : "Gunakan Jawaban Sama"}
                  </button>
                  <button
                    style={{ background: "#0ea5e9", marginLeft: "8px" }}
                    className={styles.modalSubmitBtn}
                    onClick={() => setIsEditing(true)}
                  >
                    Ubah Jawaban
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className={styles.modalSubtitle}>
                  Penilaian ini merupakan komponen Subjektif (S) dalam analisis OBS — mencerminkan
                  perasaan Anda terhadap kondisi keuangan bulan ini. Skala 1 (sangat buruk) hingga 5 (sangat baik).
                </p>

                <div className={styles.questionBlock}>
                  <p className={styles.questionLabel}>1. Seberapa puas Anda dengan kondisi keuangan bulan ini?</p>
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
                  <button className={styles.modalCancelBtn} onClick={() => {
                    setShowModal(false);
                    setIsEditing(false);
                  }}>
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
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
