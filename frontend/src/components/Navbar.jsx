import { Link } from "react-router-dom";
import logoIcon from "../assets/finsight_icon_only.png";
import { useAuth } from "../context/AuthContext.jsx";
import styles from "../styles/components/Navbar.module.css";

function Navbar() {
  const { user } = useAuth();

  return (
    <nav className={styles.nav}>
      <Link to="/" className={styles.brand}>
        <img src={logoIcon} alt="FinSight" className={styles.logo} />
        <div>
          <p className={styles.brandName}>FinSight</p>
          <p className={styles.brandTagline}>Understand. Control. Grow.</p>
        </div>
      </Link>

      <div className={styles.actions}>
        {user ? (
          <Link to="/dashboard" className={styles.cta}>
            Buka Dashboard
          </Link>
        ) : (
          <>
            <Link to="/login" className={styles.ctaOutline}>
              Masuk
            </Link>
            <Link to="/register" className={styles.cta}>
              Daftar
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
