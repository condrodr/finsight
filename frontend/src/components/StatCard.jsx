import styles from "../styles/components/StatCard.module.css";

const accentClass = {
  sky: styles.accentSky,
  green: styles.accentGreen,
  red: styles.accentRed,
  yellow: styles.accentYellow,
  slate: styles.accentSlate,
};

function StatCard({ title, value, description, icon, accent = "sky" }) {
  const iconAccent = accentClass[accent] ?? accentClass.sky;

  return (
    <div className={styles.card}>
      {icon && (
        <div className={`${styles.iconWrap} ${iconAccent}`}>
          {icon}
        </div>
      )}
      <p className={styles.cardTitle}>{title}</p>
      <h2 className={styles.value}>{value}</h2>
      <p className={styles.desc}>{description}</p>
    </div>
  );
}

export default StatCard;
