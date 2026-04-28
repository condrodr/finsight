import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { login } from "../services/authService.js";
import { useAuth } from "../context/AuthContext.jsx";
import logoIcon from "../assets/finsight_icon_only.png";
import styles from "../styles/pages/Auth.module.css";

function Login() {
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await login(form);
      loginUser(data.user);
      navigate("/dashboard");
    } catch (err) {
      if (!err.response) {
        setError("Tidak dapat terhubung ke server. Pastikan backend berjalan.");
      } else {
        setError(err.response.data?.error || "Gagal login. Coba lagi.");
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

        <h1 className={styles.heading}>Selamat Datang</h1>
        <p className={styles.subheading}>Masuk ke akun FinSight Anda</p>

        <form className={styles.form} onSubmit={handleSubmit}>
          {error && <div className={styles.errorBox}>{error}</div>}

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
                placeholder="••••••••"
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

          <button type="submit" disabled={loading} className={styles.submitBtn}>
            {loading ? "Masuk..." : "Masuk"}
          </button>
        </form>

        <p className={styles.footer}>
          Belum punya akun?{" "}
          <Link to="/register" className={styles.link}>
            Daftar sekarang
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
