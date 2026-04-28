import styles from "../styles/components/HealthScoreCard.module.css";

function getConfig(score) {
  if (score >= 80)
    return { status: "Sehat", badge: styles.badgeSehat, bar: styles.barSehat };
  if (score >= 60)
    return { status: "Cukup Sehat", badge: styles.badgeCukup, bar: styles.barCukup };
  if (score >= 40)
    return { status: "Kurang Sehat", badge: styles.badgeKurang, bar: styles.barKurang };
  return { status: "Tidak Sehat", badge: styles.badgeTidak, bar: styles.barTidak };
}

function HealthScoreCard({ score }) {
  const { status, badge, bar } = getConfig(score);

  return (
    <div className={styles.card}>
      <p className={styles.cardLabel}>Financial Health Score</p>

      <div className={styles.scoreRow}>
        <h2 className={styles.score}>{score}</h2>
        <span className={styles.scoreDenom}>/100</span>
      </div>

      <div className={`${styles.badge} ${badge}`}>{status}</div>

      <div className={styles.progressTrack}>
        <div
          className={`${styles.progressBar} ${bar}`}
          style={{ width: `${score}%` }}
        />
      </div>

      <div className={styles.progressLabels}>
        <span>0</span>
        <span>50</span>
        <span>100</span>
      </div>
    </div>
  );
}

export default HealthScoreCard;
