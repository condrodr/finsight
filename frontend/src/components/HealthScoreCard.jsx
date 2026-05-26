import styles from "../styles/components/HealthScoreCard.module.css";

const RANGES = [
  { min: 0,  max: 19,  label: "Tidak Sehat", color: "#ef4444", bg: "#fef2f2" },
  { min: 20, max: 39,  label: "Berisiko",    color: "#f97316", bg: "#fff7ed" },
  { min: 40, max: 59,  label: "Cukup",       color: "#f59e0b", bg: "#fffbeb" },
  { min: 60, max: 79,  label: "Sehat",       color: "#0ea5e9", bg: "#f0f9ff" },
  { min: 80, max: 100, label: "Sangat Sehat",color: "#22c55e", bg: "#f0fdf4" },
];

function getConfig(score) {
  return RANGES.find((r) => score >= r.min && score <= r.max) || RANGES[0];
}

function HealthScoreCard({ score, hasSurvey = true }) {
  const config = getConfig(score);

  // Jika belum ada survey, tampilkan score 0 dengan pesan
  if (!hasSurvey) {
    return (
      <div className={styles.card} style={{ background: "#f8fafc", borderColor: "#cbd5e1" }}>
        <p className={styles.cardLabel}>Financial Health Score</p>

        <div className={styles.scoreRow}>
          <h2 className={styles.score} style={{ color: "#94a3b8" }}>0</h2>
          <span className={styles.scoreDenom}>/100</span>
          <span className={styles.badge} style={{ background: "#f1f5f9", color: "#64748b" }}>
            Belum Ada Data
          </span>
        </div>

        <div style={{
          background: "#e8eef6",
          border: "1px solid #cbd5e1",
          borderRadius: "8px",
          padding: "12px",
          marginTop: "12px",
          textAlign: "center"
        }}>
          <p style={{ margin: "0 0 8px 0", fontSize: "0.9rem", fontWeight: "600", color: "#334155" }}>
            Isi Survey untuk Mendapatkan Skor
          </p>
          <p style={{ margin: "0", fontSize: "0.85rem", color: "#64748b", lineHeight: "1.4" }}>
            Survey hanya muncul pada <strong>tanggal 25</strong> setiap bulan.<br />
            Jawaban survey akan meningkatkan akurasi penilaian keuangan Anda.
          </p>
        </div>

        {/* Segmented progress bar */}
        <div className={styles.segTrack} style={{ marginTop: "12px", opacity: 0.3 }}>
          {RANGES.map((r) => (
            <div
              key={r.min}
              className={styles.segment}
              style={{ background: r.color }}
            />
          ))}
        </div>

        {/* Range labels */}
        <div className={styles.rangeLabels} style={{ opacity: 0.5 }}>
          {RANGES.map((r) => (
            <div
              key={r.min}
              className={styles.rangeItem}
              style={{ color: "#94a3b8" }}
            >
              <span className={styles.rangeBar} style={{ background: r.color }} />
              <span className={styles.rangeName}>{r.min}–{r.max}</span>
              <span className={styles.rangeLabel}>{r.label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Normal score display jika sudah ada survey
  return (
    <div className={styles.card}>
      <p className={styles.cardLabel}>Financial Health Score</p>

      <div className={styles.scoreRow}>
        <h2 className={styles.score} style={{ color: config.color }}>{score}</h2>
        <span className={styles.scoreDenom}>/100</span>
        <span className={styles.badge} style={{ background: config.bg, color: config.color }}>
          {config.label}
        </span>
      </div>

      {/* Segmented progress bar */}
      <div className={styles.segTrack}>
        {RANGES.map((r) => (
          <div
            key={r.min}
            className={styles.segment}
            style={{ background: r.color, opacity: config.min === r.min ? 1 : 0.18 }}
          />
        ))}
        {/* Score marker */}
        <div
          className={styles.marker}
          style={{ left: `${Math.min(score, 100)}%` }}
        />
      </div>

      {/* Range labels */}
      <div className={styles.rangeLabels}>
        {RANGES.map((r) => (
          <div
            key={r.min}
            className={styles.rangeItem}
            style={{ color: config.min === r.min ? config.color : "#94a3b8" }}
          >
            <span className={styles.rangeBar} style={{ background: r.color }} />
            <span className={styles.rangeName}>{r.min}–{r.max}</span>
            <span className={styles.rangeLabel}>{r.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HealthScoreCard;
