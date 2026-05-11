import { useState } from "react";
import { LayoutDashboard, ReceiptText, BarChart3, Lightbulb, LogOut, User, ChevronLeft, ChevronRight } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logoIcon from "../assets/finsight_icon_only.png";
import { useAuth } from "../context/AuthContext.jsx";
import styles from "../styles/components/Sidebar.module.css";
import Swal from "sweetalert2";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/transaksi", icon: ReceiptText,    label: "Transaksi" },
  { to: "/laporan",   icon: BarChart3,      label: "Laporan" },
  { to: "/insight",   icon: Lightbulb,      label: "Insight" },
];

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logoutUser } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    Swal.fire({
      title: "Konfirmasi Keluar",
      text: "Sesi Anda akan diakhiri. Pastikan semua perubahan telah tersimpan.",
      icon: "warning",
      iconColor: "#F59E0B",
      showCancelButton: true,
      confirmButtonText: "Keluar Sekarang",
      cancelButtonText: "Batal",
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#94A3B8",
      background: "#FFFFFF",
      color: "#0F172A",
      customClass: {
        popup: "swal-logout-popup",
        title: "swal-logout-title",
        htmlContainer: "swal-logout-text",
        confirmButton: "swal-logout-confirm",
        cancelButton: "swal-logout-cancel",
      },
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        logoutUser();
        navigate("/login");
      }
    });
  };

  return (
    <aside className={`${styles.aside} ${collapsed ? styles.collapsed : ""}`}>

      {/* Brand */}
      <div className={styles.brand}>
        <div className={`${styles.brandTop} ${collapsed ? styles.brandTopCollapsed : ""}`}>
          <Link to="/" className={styles.brandRow}>
            <img src={logoIcon} alt="FinSight" className={styles.logo} />
            {!collapsed && <h1 className={styles.brandName}>FinSight</h1>}
          </Link>
          {!collapsed && (
            <button className={styles.toggleBtn} onClick={() => setCollapsed(true)} title="Minimize">
              <ChevronLeft size={16} />
            </button>
          )}
        </div>
        {!collapsed && <p className={styles.tagline}>Keuangan Sehat Dimulai dari Kebiasaan</p>}
        {collapsed && (
          <button className={styles.toggleBtnCollapsed} onClick={() => setCollapsed(false)} title="Expand">
            <ChevronRight size={16} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className={styles.nav}>
        {navItems.map(({ to, icon: Icon, label }) => {
          const isActive = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              title={collapsed ? label : undefined}
              className={`${styles.navLink} ${isActive ? styles.active : styles.inactive} ${collapsed ? styles.navLinkCollapsed : ""}`}
            >
              <Icon size={20} />
              {!collapsed && label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className={styles.footer}>
        {user && (
          <div className={`${styles.userInfo} ${collapsed ? styles.userInfoCollapsed : ""}`}>
            <div className={styles.userAvatar} title={collapsed ? user.name : undefined}>
              <User size={16} />
            </div>
            {!collapsed && (
              <div className={styles.userDetails}>
                <p className={styles.userName}>{user.name}</p>
                <p className={styles.userEmail}>{user.email}</p>
              </div>
            )}
          </div>
        )}
        <button
          onClick={handleLogout}
          className={`${styles.logoutBtn} ${collapsed ? styles.logoutBtnCollapsed : ""}`}
          title={collapsed ? "Keluar" : undefined}
        >
          <LogOut size={16} />
          {!collapsed && "Keluar"}
        </button>
      </div>

    </aside>
  );
}

export default Sidebar;
