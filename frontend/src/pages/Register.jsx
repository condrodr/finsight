import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { register } from "../services/authService.js";
import logoIcon from "../assets/finsight_icon_only.png";
import styles from "../styles/pages/Auth.module.css";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (form.password !== form.confirm) {
      setError("Password dan konfirmasi password tidak cocok.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password minimal 6 karakter.");
      return;
    }

    setLoading(true);
    try {
      await register({ name: form.name, email: form.email, password: form.password });
      setSuccess("Akun berhasil dibuat! Mengalihkan ke halaman login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      if (!err.response) {
        setError("Tidak dapat terhubung ke server. Pastikan backend berjalan.");
      } else if (err.response.status === 500) {
        const msg = err.response.data?.error || "";
        setError(`Kesalahan server: ${msg || "Pastikan database sudah dibuat dan koneksi MySQL aktif."}`);
      } else {
        setError(err.response.data?.error || "Gagal membuat akun. Coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logoRow}>
          <img src={logoIcon} alt="FinSight" className={styles.logo} />
          <p className={styles.appName}>FinSight</p>
        </div>

        <h1 className={styles.heading}>Buat Akun</h1>
        <p className={styles.subheading}>Mulai kelola keuangan Anda hari ini</p>

        <form className={styles.form} onSubmit={handleSubmit}>
          {error && <div className={styles.errorBox}>{error}</div>}
          {success && <div className={styles.successBox}>{success}</div>}

          <div className={styles.field}>
            <label className={styles.label}>Nama Lengkap</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Nama Anda"
              required
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="email@contoh.com"
              required
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Password</label>
            <div className={styles.passwordWrap}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Minimal 6 karakter"
                required
                className={styles.input}
              />
              <button
                type="button"
                className={styles.eyeBtn}
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={-1}
                aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Konfirmasi Password</label>
            <div className={styles.passwordWrap}>
              <input
                type={showConfirm ? "text" : "password"}
                name="confirm"
                value={form.confirm}
                onChange={handleChange}
                placeholder="Ulangi password"
                required
                className={styles.input}
              />
              <button
                type="button"
                className={styles.eyeBtn}
                onClick={() => setShowConfirm((v) => !v)}
                tabIndex={-1}
                aria-label={showConfirm ? "Sembunyikan password" : "Tampilkan password"}
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className={styles.submitBtn}>
            {loading ? "Mendaftar..." : "Daftar"}
          </button>
        </form>

        <p className={styles.footer}>
          Sudah punya akun?{" "}
          <Link to="/login" className={styles.link}>
            Masuk di sini
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
