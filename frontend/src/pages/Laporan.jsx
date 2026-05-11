import { useState, useEffect, useMemo } from "react";
import { CalendarDays, TrendingUp, TrendingDown, Wallet, Percent } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import Sidebar from "../components/Sidebar.jsx";
import Footer from "../components/Footer.jsx";
import API from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import styles from "../styles/pages/Laporan.module.css";

const MONTHS_SHORT = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];
const MONTHS_FULL  = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];

const PIE_COLORS = [
  "#0ea5e9","#22c55e","#f59e0b","#f87171","#8b5cf6",
  "#06b6d4","#ec4899","#84cc16","#fb923c","#14b8a6",
];

const formatRupiah = (n) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

const fmtAxis = (v) =>
  v >= 1_000_000 ? `${(v / 1_000_000).toFixed(1)}jt` : v >= 1_000 ? `${(v / 1_000).toFixed(0)}rb` : String(v);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className={styles.tooltip}>
      <p className={styles.tooltipLabel}>{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }} className={styles.tooltipRow}>
          {p.name}: {formatRupiah(p.value)}
        </p>
      ))}
    </div>
  );
};

const PieTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const p = payload[0];
  return (
    <div className={styles.tooltip}>
      <p className={styles.tooltipLabel}>{p.name}</p>
      <p className={styles.tooltipRow} style={{ color: p.payload.fill }}>{formatRupiah(p.value)}</p>
    </div>
  );
};

function Laporan() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const now = new Date();
  const [selMonth, setSelMonth] = useState(now.getMonth() + 1);
  const [selYear,  setSelYear]  = useState(now.getFullYear());

  useEffect(() => {
    API.get(`/transactions/${user.id}`)
      .then((res) => setTransactions(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // ── Group by month-year ──────────────────────
  const monthlyMap = useMemo(() => {
    const map = {};
    transactions.forEach((t) => {
      const d = new Date(t.date);
      const y = d.getFullYear(), m = d.getMonth() + 1;
      const key = `${y}-${String(m).padStart(2, "0")}`;
      if (!map[key]) map[key] = { key, year: y, month: m, income: 0, expense: 0, txs: [] };
      if (t.type === "income") map[key].income += Number(t.amount);
      else                      map[key].expense += Number(t.amount);
      map[key].txs.push(t);
    });
    return map;
  }, [transactions]);

  // ── Bar chart — last 6 months with data ──────
  const barData = useMemo(() =>
    Object.values(monthlyMap)
      .sort((a, b) => a.key.localeCompare(b.key))
      .slice(-6)
      .map((m) => ({
        name: `${MONTHS_SHORT[m.month - 1]} '${String(m.year).slice(-2)}`,
        Pendapatan: m.income,
        Pengeluaran: m.expense,
        balance: m.income - m.expense,
      })),
  [monthlyMap]);

  // ── Selected month data ───────────────────────
  const selKey  = `${selYear}-${String(selMonth).padStart(2, "0")}`;
  const selData = monthlyMap[selKey] || { income: 0, expense: 0, txs: [] };
  const balance = selData.income - selData.expense;
  const savingPct = selData.income > 0 ? Math.round((balance / selData.income) * 100) : 0;

  // ── Pie chart — expense by category ──────────
  const pieData = useMemo(() => {
    const map = {};
    selData.txs.filter((t) => t.type === "expense").forEach((t) => {
      map[t.category] = (map[t.category] || 0) + Number(t.amount);
    });
    return Object.entries(map)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 9);
  }, [selData]);

  // ── Available years in data ───────────────────
  const availYears = useMemo(() => {
    const ys = new Set(Object.values(monthlyMap).map((m) => m.year));
    ys.add(now.getFullYear());
    return [...ys].sort((a, b) => b - a);
  }, [monthlyMap]);

  if (loading) return (
    <div className={styles.page}>
      <div className={styles.body}>
        <Sidebar />
        <main className={styles.main}>
          <div className={styles.loadingBox}><div className={styles.spinner} /><p className={styles.loadingText}>Memuat laporan...</p></div>
        </main>
      </div>
      <Footer />
    </div>
  );

  return (
    <div className={styles.page}>
      <div className={styles.body}>
        <Sidebar />

        <main className={styles.main}>
          {/* Header */}
          <div className={styles.header}>
            <p className={styles.label}>Analisis</p>
            <h1 className={styles.title}>Laporan Keuangan</h1>
            <p className={styles.subtitle}>Visualisasi tren dan pola keuangan Anda.</p>
          </div>

          {/* Month Selector */}
          <div className={styles.monthBar}>
            <CalendarDays size={15} className={styles.calIcon} />
            <span className={styles.monthBarLabel}>Bulan yang ditampilkan:</span>
            <select value={selMonth} onChange={(e) => setSelMonth(Number(e.target.value))} className={styles.monthSel}>
              {MONTHS_FULL.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
            </select>
            <select value={selYear} onChange={(e) => setSelYear(Number(e.target.value))} className={styles.monthSel}>
              {availYears.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>

          {/* Summary Cards */}
          <div className={styles.statsRow}>
            <div className={`${styles.statCard} ${styles.cardGreen}`}>
              <div className={styles.statIcon}><TrendingUp size={18} /></div>
              <p className={styles.statLabel}>Pendapatan</p>
              <p className={styles.statValue}>{formatRupiah(selData.income)}</p>
            </div>
            <div className={`${styles.statCard} ${styles.cardRed}`}>
              <div className={styles.statIcon}><TrendingDown size={18} /></div>
              <p className={styles.statLabel}>Pengeluaran</p>
              <p className={styles.statValue}>{formatRupiah(selData.expense)}</p>
            </div>
            <div className={`${styles.statCard} ${balance >= 0 ? styles.cardBlue : styles.cardRed}`}>
              <div className={styles.statIcon}><Wallet size={18} /></div>
              <p className={styles.statLabel}>Saldo</p>
              <p className={styles.statValue}>{formatRupiah(balance)}</p>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}><Percent size={18} /></div>
              <p className={styles.statLabel}>Saving Ratio</p>
              <p className={`${styles.statValue} ${
                savingPct >= 20 ? styles.colorGreen : savingPct >= 0 ? styles.colorAmber : styles.colorRed
              }`}>{savingPct}%</p>
            </div>
          </div>

          {/* Charts */}
          {barData.length > 0 ? (
            <div className={styles.chartsRow}>
              {/* Trend Bar Chart */}
              <div className={styles.chartCard}>
                <h2 className={styles.chartTitle}>Tren 6 Bulan Terakhir</h2>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={barData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} tickFormatter={fmtAxis} axisLine={false} tickLine={false} width={48} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgb(14 165 233 / 0.05)" }} />
                    <Legend wrapperStyle={{ fontSize: "0.8rem", paddingTop: "0.5rem" }} />
                    <Bar dataKey="Pendapatan" fill="#22c55e" radius={[4, 4, 0, 0]} maxBarSize={36} />
                    <Bar dataKey="Pengeluaran" fill="#f87171" radius={[4, 4, 0, 0]} maxBarSize={36} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Pie Chart */}
              {pieData.length > 0 ? (
                <div className={styles.chartCard}>
                  <h2 className={styles.chartTitle}>
                    Pengeluaran — {MONTHS_FULL[selMonth - 1]} {selYear}
                  </h2>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={95}
                        dataKey="value" nameKey="name" paddingAngle={2}>
                        {pieData.map((_, i) => (
                          <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<PieTooltip />} />
                      <Legend
                        wrapperStyle={{ fontSize: "0.75rem" }}
                        formatter={(value) => <span style={{ color: "#475569" }}>{value}</span>}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className={`${styles.chartCard} ${styles.chartEmpty}`}>
                  <p className={styles.emptyText}>Tidak ada pengeluaran di {MONTHS_FULL[selMonth - 1]} {selYear}</p>
                </div>
              )}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <p className={styles.emptyTitle}>Belum ada data transaksi</p>
              <p className={styles.emptyDesc}>Tambahkan transaksi untuk melihat laporan keuangan Anda.</p>
            </div>
          )}

          {/* Category Breakdown Table */}
          {pieData.length > 0 && (
            <div className={styles.tableCard}>
              <h2 className={styles.tableTitle}>
                Rincian Pengeluaran — {MONTHS_FULL[selMonth - 1]} {selYear}
              </h2>
              <table className={styles.breakdownTable}>
                <thead>
                  <tr>
                    <th>Kategori</th>
                    <th className={styles.tdRight}>Jumlah</th>
                    <th className={styles.tdRight}>% Pengeluaran</th>
                  </tr>
                </thead>
                <tbody>
                  {pieData.map((c, i) => (
                    <tr key={i}>
                      <td>
                        <span className={styles.catDot} style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                        {c.name}
                      </td>
                      <td className={styles.tdRight}>{formatRupiah(c.value)}</td>
                      <td className={styles.tdRight}>
                        {selData.expense > 0 ? Math.round((c.value / selData.expense) * 100) : 0}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default Laporan;
