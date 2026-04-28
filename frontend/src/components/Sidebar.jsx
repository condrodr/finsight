import { LayoutDashboard, ReceiptText, BarChart3, Lightbulb, LogOut, User } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logoIcon from "../assets/finsight_icon_only.png";
import { useAuth } from "../context/AuthContext.jsx";
import styles from "../styles/components/Sidebar.module.css";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/transaksi", icon: ReceiptText, label: "Transaksi" },
  { to: "/laporan", icon: BarChart3, label: "Laporan" },
  { to: "/insight", icon: Lightbulb, label: "Insight" },
];

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logoutUser } = useAuth();

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <aside className={styles.aside}>
      <div className={styles.brand}>
        <div className={styles.brandRow}>
          <img src={logoIcon} alt="FinSight" className={styles.logo} />
          <h1 className={styles.brandName}>FinSight</h1>
        </div>
        <p className={styles.tagline}>Know Your Habits. Master Your Money.</p>
      </div>

      <nav className={styles.nav}>
        {navItems.map(({ to, icon: Icon, label }) => {
          const isActive = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`${styles.navLink} ${isActive ? styles.active : styles.inactive}`}
            >
              <Icon size={20} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className={styles.footer}>
        {user && (
          <div className={styles.userInfo}>
            <div className={styles.userAvatar}>
              <User size={16} />
            </div>
            <div className={styles.userDetails}>
              <p className={styles.userName}>{user.name}</p>
              <p className={styles.userEmail}>{user.email}</p>
            </div>
          </div>
        )}
        <button onClick={handleLogout} className={styles.logoutBtn}>
          <LogOut size={16} />
          Keluar
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
