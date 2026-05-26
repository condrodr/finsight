import { useState, useEffect, useMemo } from "react";
import { CalendarDays, TrendingUp, TrendingDown, Wallet, Percent, X } from "lucide-react";
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

  // ── Detail modal states ────────────────────────
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

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
                    <tr
                      key={i}
                      onClick={() => {
                        setSelectedCategory(c.name);
                        setShowDetailModal(true);
                      }}
                      style={{
                        cursor: "pointer",
                        transition: "background 0.2s",
                      }}
                      onMouseEnter={(e) => e.target.parentNode.style.background = "#f8fafc"}
                      onMouseLeave={(e) => e.target.parentNode.style.background = "transparent"}
                    >
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

      {/* Detail Transaksi Modal */}
      {showDetailModal && selectedCategory && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000
        }} onClick={() => setShowDetailModal(false)}>
          <div style={{
            background: "white",
            borderRadius: "12px",
            padding: "24px",
            maxWidth: "600px",
            width: "90%",
            maxHeight: "80vh",
            overflowY: "auto",
            boxShadow: "0 20px 25px rgba(0,0,0,0.15)"
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <div>
                <h2 style={{ margin: "0 0 4px 0", fontSize: "1.3rem" }}>{selectedCategory}</h2>
                <p style={{ margin: 0, fontSize: "0.9rem", color: "#666" }}>
                  {MONTHS_FULL[selMonth - 1]} {selYear}
                </p>
              </div>
              <button onClick={() => setShowDetailModal(false)} style={{
                background: "none",
                border: "none",
                fontSize: "1.5rem",
                cursor: "pointer"
              }}>
                <X size={24} />
              </button>
            </div>

            {/* Detail Transaksi List */}
            {selData.txs.filter((t) => t.type === "expense" && t.category === selectedCategory).length > 0 ? (
              <div>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
                      <th style={{ textAlign: "left", padding: "8px 0", fontWeight: "600", fontSize: "0.9rem" }}>Tanggal</th>
                      <th style={{ textAlign: "left", padding: "8px 0", fontWeight: "600", fontSize: "0.9rem" }}>Keterangan</th>
                      <th style={{ textAlign: "right", padding: "8px 0", fontWeight: "600", fontSize: "0.9rem" }}>Jumlah</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selData.txs
                      .filter((t) => t.type === "expense" && t.category === selectedCategory)
                      .map((tx) => (
                        <tr key={tx.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                          <td style={{ padding: "12px 0", fontSize: "0.9rem" }}>
                            {new Date(tx.date).toLocaleDateString("id-ID", { day: "2-digit", month: "short" })}
                          </td>
                          <td style={{ padding: "12px 0", fontSize: "0.9rem" }}>
                            {tx.description || "-"}
                          </td>
                          <td style={{ textAlign: "right", padding: "12px 0", fontSize: "0.9rem", fontWeight: "600" }}>
                            {formatRupiah(tx.amount)}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>

                {/* Total Summary */}
                <div style={{
                  background: "#f0f9ff",
                  border: "1px solid #bae6fd",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  marginTop: "16px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}>
                  <span style={{ fontWeight: "600", color: "#0369a1" }}>Total</span>
                  <span style={{ fontSize: "1.1rem", fontWeight: "700", color: "#0369a1" }}>
                    {formatRupiah(
                      selData.txs
                        .filter((t) => t.type === "expense" && t.category === selectedCategory)
                        .reduce((sum, tx) => sum + Number(tx.amount), 0)
                    )}
                  </span>
                </div>
              </div>
            ) : (
              <p style={{ textAlign: "center", color: "#666", padding: "20px" }}>
                Tidak ada transaksi untuk kategori ini
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Laporan;
