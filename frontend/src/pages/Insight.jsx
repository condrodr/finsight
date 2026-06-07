// import { useState, useEffect } from "react";
// import {
//   AlertTriangle, CheckCircle2, ShoppingBag, Home, TrendingUp,
//   Lightbulb, Activity, BarChart3, Brain, Heart, ClipboardList, X,
// } from "lucide-react";
// import Swal from "sweetalert2";
// import { getDashboard } from "../services/financeService.js";
// import { submitSurvey, getSurvey } from "../services/surveyService.js";
// import { useAuth } from "../context/AuthContext.jsx";
// import API from "../services/api.js";
// import Sidebar from "../components/Sidebar.jsx";
// import Footer from "../components/Footer.jsx";
// import styles from "../styles/pages/Insight.module.css";

// const formatRupiah = (n) =>
//   new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

// const SCORE_COLOR = { 5: "#22c55e", 4: "#0ea5e9", 3: "#f59e0b", 2: "#f97316", 1: "#ef4444" };
// const scoreColor = (s) => SCORE_COLOR[s] || "#e2e8f0";

// const HEALTH_META = {
//   "Sangat Sehat": { bg: "#f0fdf4", text: "#15803d", border: "#bbf7d0", bar: "#22c55e" },
//   "Sehat":        { bg: "#f0f9ff", text: "#0369a1", border: "#bae6fd", bar: "#0ea5e9" },
//   "Cukup":        { bg: "#fffbeb", text: "#b45309", border: "#fde68a", bar: "#f59e0b" },
//   "Berisiko":     { bg: "#fff7ed", text: "#c2410c", border: "#fed7aa", bar: "#f97316" },
//   "Tidak Sehat":  { bg: "#fef2f2", text: "#dc2626", border: "#fecaca", bar: "#ef4444" },
// };

// function getCategory(score) {
//   if (score >= 80) return "Sangat Sehat";
//   if (score >= 60) return "Sehat";
//   if (score >= 40) return "Cukup";
//   if (score >= 20) return "Berisiko";
//   return "Tidak Sehat";
// }

// const DESC = {
//   savingRatio: ["","Saving ratio negatif — pengeluaran melebihi pendapatan.","Saving ratio <10%. Sisihkan minimal 10% dari pendapatan.","Saving ratio 10–19%. Masih ada ruang untuk ditingkatkan.","Saving ratio 20–29%. Pertahankan, target ideal ≥30%.","Saving ratio ≥30%. Sangat disiplin menyisihkan pendapatan."],
//   expenseRatio: ["","Pengeluaran melebihi atau sama dengan pendapatan.","Rasio pengeluaran 90–99%. Hampir tidak ada ruang saving.","Rasio pengeluaran 70–89%. Pengeluaran cukup tinggi.","Rasio pengeluaran 50–69%. Pengeluaran terkontrol.","Rasio pengeluaran <50%. Sangat efisien."],
//   cashFlow: ["","Defisit >10% dari pendapatan. Perlu tindakan segera.","Defisit ringan. Perhatikan pengeluaran.","Arus kas sedikit positif atau break-even.","Surplus 10–29% dari pendapatan. Arus kas sehat.","Surplus ≥30% dari pendapatan. Arus kas sangat sehat."],
//   debtRatio: ["","Kesehatan sangat buruk — cicilan/hutang ≥40% pendapatan, tekanan sangat tinggi.","Kesehatan buruk — cicilan 30–39% pendapatan, beban cukup berat.","Kesehatan cukup — cicilan 20–29% pendapatan, cukup signifikan.","Kesehatan baik — cicilan 10–19% pendapatan, masih terkendali.","Kesehatan sangat baik — tidak ada atau hampir tidak ada hutang/cicilan."],
//   consumptiveRatio: ["","Pengeluaran konsumtif ≥70% dari total belanja — sangat dominan.","Pengeluaran konsumtif 50–69%. Perlu dikurangi.","Pengeluaran konsumtif 35–49%. Cukup tinggi.","Pengeluaran konsumtif 20–34%. Terkendali.","Pengeluaran konsumtif <20%. Sangat terkendali."],
//   transactionFrequency: ["","Transaksi >50 pengeluaran — sangat sering, indikasi impulsif.","Transaksi 36–50 pengeluaran. Frekuensi cukup tinggi.","Transaksi 21–35 pengeluaran. Frekuensi sedang.","Transaksi 11–20 pengeluaran. Terkontrol.","Transaksi ≤10 pengeluaran. Sangat terkontrol."],
//   impulsiveSpending: ["","Kontrol sangat lemah — dominasi transaksi kecil berulang, indikasi impulsive buying kuat.","Kontrol kurang baik — banyak transaksi kecil, potensi impulsive buying.","Kontrol sedang — cukup banyak transaksi kecil berulang.","Kontrol baik — sedikit transaksi kecil, pola belanja terjaga.","Kontrol sangat baik — hampir tidak ada transaksi kecil, pola belanja sangat disiplin."],
//   budgetDiscipline: ["","Anggaran terlampaui — pengeluaran melebihi pendapatan.","Hampir melebihi batas anggaran (90–100% pendapatan).","Pengeluaran 75–90% pendapatan. Anggaran cukup terjaga.","Pengeluaran 60–75% pendapatan. Disiplin anggaran baik.","Pengeluaran ≤60% pendapatan. Sangat disiplin."],
//   satisfaction: ["","Sangat tidak puas dengan kondisi keuangan.","Kurang puas dengan kondisi keuangan.","Cukup puas dengan kondisi keuangan.","Puas dengan kondisi keuangan.","Sangat puas dengan kondisi keuangan."],
//   security: ["","Sangat tidak merasa aman secara finansial.","Merasa kurang aman secara finansial.","Cukup merasa aman secara finansial.","Merasa aman secara finansial.","Sangat merasa aman secara finansial."],
//   confidence: ["","Sangat tidak percaya diri mengelola keuangan.","Kurang percaya diri mengelola keuangan.","Cukup percaya diri mengelola keuangan.","Percaya diri mengelola keuangan.","Sangat percaya diri mengelola keuangan."],
// };

// const getDesc = (key, score) =>
//   score > 0 && DESC[key] ? (DESC[key][score] || "") : "Tidak ada data";

// function LikertRow({ value, onChange }) {
//   return (
//     <div className={styles.likertRow}>
//       <span className={styles.likertEnd}>Sangat Buruk</span>
//       {[1, 2, 3, 4, 5].map((n) => (
//         <button
//           key={n}
//           type="button"
//           className={`${styles.likertBtn} ${value === n ? styles.likertBtnActive : ""}`}
//           onClick={() => onChange(n)}
//         >
//           {n}
//         </button>
//       ))}
//       <span className={styles.likertEnd}>Sangat Baik</span>
//     </div>
//   );
// }

// function ScoreBarDesc({ label, scoreKey, score }) {
//   const pct = score > 0 ? (score / 5) * 100 : 0;
//   const color = scoreColor(score);
//   return (
//     <div className={styles.dimBar}>
//       <div className={styles.dimBarHeader}>
//         <span className={styles.dimLabel}>{label}</span>
//         <span className={styles.dimScore} style={{ color }}>
//           {score || "–"}<span className={styles.dimMax}>/5</span>
//         </span>
//       </div>
//       <div className={styles.dimTrack}>
//         <div className={styles.dimFill} style={{ width: `${pct}%`, background: color }} />
//       </div>
//       <p className={styles.dimDesc}>{getDesc(scoreKey, score)}</p>
//     </div>
//   );
// }

// function GroupBlock({ title, icon: Icon, iconColor, items, total, emptyMsg, onItemClick }) {
//   return (
//     <div className={styles.groupCard}>
//       <div className={styles.groupHeader}>
//         <Icon size={16} style={{ color: iconColor }} />
//         <span className={styles.groupTitle}>{title}</span>
//         <span className={styles.groupTotal}>{formatRupiah(total)}</span>
//       </div>
//       {items.length === 0 ? (
//         <p className={styles.groupEmpty}>{emptyMsg}</p>
//       ) : (
//         <div className={styles.groupRows}>
//           {items.map((item, i) => (
//             <div
//               key={i}
//               className={styles.groupRow}
//               onClick={() => onItemClick && onItemClick(item.category)}
//               style={{
//                 cursor: "pointer",
//                 transition: "background 0.2s",
//               }}
//               onMouseEnter={(e) => e.currentTarget.style.background = "#f8fafc"}
//               onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
//             >
//               <div className={styles.groupRowLeft}>
//                 <div className={styles.groupBar} style={{ background: `${iconColor}20` }}>
//                   <div className={styles.groupBarFill} style={{ width: `${item.pct}%`, background: iconColor }} />
//                 </div>
//                 <span className={styles.groupCat}>{item.category}</span>
//               </div>
//               <div className={styles.groupRowRight}>
//                 <span className={styles.groupAmt}>{formatRupiah(item.total)}</span>
//                 <span className={styles.groupPct}>{item.pct}%</span>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// function Insight() {
//   const { user } = useAuth();
//   const now = new Date();
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [transactions, setTransactions] = useState([]);
//   const [showDetailModal, setShowDetailModal] = useState(false);
//   const [selectedCategory, setSelectedCategory] = useState(null);

//   // ── Filter states ──────────────────────────
//   const [filterMonth, setFilterMonth] = useState(now.getMonth() + 1);
//   const [filterYear, setFilterYear] = useState(now.getFullYear());
//   const [filterType, setFilterType] = useState("month"); // "month" atau "year"

//   // ── Survey modal states ──────────────────────────
//   const [showSurveyModal, setShowSurveyModal] = useState(false);
//   const [satisfaction, setSatisfaction] = useState(3);
//   const [security, setSecurity] = useState(3);
//   const [confidence, setConfidence] = useState(3);
//   const [surveyNote, setSurveyNote] = useState("");
//   const [submittingSurvey, setSubmittingSurvey] = useState(false);
//   const [surveyExistsForMonth, setSurveyExistsForMonth] = useState(false);

//   const handleOpenSurveyModal = async () => {
//     // Fetch existing survey jika ada
//     if (surveyExistsForMonth) {
//       try {
//         const surveyRes = await getSurvey(user.id, filterYear, filterMonth);
//         if (surveyRes && surveyRes.data) {
//           setSatisfaction(surveyRes.data.financial_satisfaction || 3);
//           setSecurity(surveyRes.data.financial_security || 3);
//           setConfidence(surveyRes.data.financial_confidence || 3);
//           setSurveyNote(surveyRes.data.note || "");
//         }
//       } catch (e) {
//         console.error("Error fetching survey:", e);
//       }
//     }
//     setShowSurveyModal(true);
//   };

//   const handleSurveySave = async () => {
//     setSubmittingSurvey(true);
//     try {
//       await submitSurvey({
//         user_id: user.id,
//         period_year: filterYear,
//         period_month: filterMonth,
//         financial_satisfaction: satisfaction,
//         financial_security: security,
//         financial_confidence: confidence,
//         note: surveyNote,
//       });

//       setShowSurveyModal(false);
//       Swal.fire({
//         icon: "success",
//         title: "Evaluasi Tersimpan",
//         text: `Penilaian keuangan berhasil dicatat.`,
//         timer: 2500,
//         showConfirmButton: false,
//         toast: true,
//         position: "top-end",
//       });

//       // Refetch data setelah survey disimpan
//       setTimeout(() => {
//         const params = filterType === "month"
//           ? `?year=${filterYear}&month=${filterMonth}`
//           : `?year=${filterYear}`;
//         getDashboard(user.id, params)
//           .then((res) => {
//             setData(res.data);
//             setSurveyExistsForMonth(res.data.surveyTersedia);
//           })
//           .catch((err) => console.error(err));
//       }, 1500);
//     } catch (e) {
//       Swal.fire({ icon: "error", title: "Gagal menyimpan", text: e.message });
//     } finally {
//       setSubmittingSurvey(false);
//     }
//   };

//   useEffect(() => {
//     setLoading(true);
//     const params = filterType === "month"
//       ? `?year=${filterYear}&month=${filterMonth}`
//       : `?year=${filterYear}`;

//     Promise.all([
//       getDashboard(user.id, params),
//       API.get(`/transactions/${user.id}`)
//     ])
//       .then(([dashRes, txRes]) => {
//         setData(dashRes.data);
//         setTransactions(txRes.data);
//         setSurveyExistsForMonth(dashRes.data.surveyTersedia);
//         // Reset survey form values for new month
//         setSatisfaction(3);
//         setSecurity(3);
//         setConfidence(3);
//         setSurveyNote("");
//       })
//       .catch((err) => setError(err.message))
//       .finally(() => setLoading(false));
//   }, [filterMonth, filterYear, filterType]);

//   // Helper untuk filter transaksi
//   const getFilteredTransactions = (category) => {
//     return transactions.filter((t) => {
//       if (t.category !== category) return false;
//       const txDate = new Date(t.date);
//       const txMonth = txDate.getMonth() + 1;
//       const txYear = txDate.getFullYear();

//       if (filterType === "month") {
//         return txMonth === filterMonth && txYear === filterYear;
//       } else {
//         return txYear === filterYear;
//       }
//     });
//   };

//   if (loading) return (
//     <div className={styles.page}>
//       <div className={styles.body}><Sidebar />
//         <main className={styles.main}>
//           <div className={styles.loadingBox}><div className={styles.spinner} /><p className={styles.loadingText}>Menganalisis data...</p></div>
//         </main>
//       </div><Footer />
//     </div>
//   );

//   if (error) return (
//     <div className={styles.page}>
//       <div className={styles.body}><Sidebar />
//         <main className={styles.main}>
//           <div className={styles.errorBox}>
//             <AlertTriangle size={24} className={styles.errorIcon} />
//             <p className={styles.errorTitle}>Gagal memuat insight</p>
//             <p className={styles.errorMsg}>{error}</p>
//           </div>
//         </main>
//       </div><Footer />
//     </div>
//   );

//   const cat  = getCategory(data.skorKesehatan);
//   const meta = HEALTH_META[cat];
//   const { objective: O, behavioral: B, subjective: S } = data.dimensiSkor;
//   const konsumtifTotal = data.kategori.konsumtif.reduce((s, k) => s + k.total, 0);
//   const kebutuhanTotal = data.kategori.kebutuhan.reduce((s, k) => s + k.total, 0);
//   const produktifTotal = data.kategori.produktif.reduce((s, k) => s + k.total, 0);
//   const hasData = data.totalPendapatan > 0 || data.totalPengeluaran > 0;

//   return (
//     <div className={styles.page}>
//       <div className={styles.body}>
//         <Sidebar />
//         <main className={styles.main}>

//           <div className={styles.header}>
//             <p className={styles.label}>Rekomendasi</p>
//             <h1 className={styles.title}>Insight & Saran</h1>
//             <p className={styles.subtitle}>Analisis OBS: Objektif · Perilaku · Subjektif</p>
//           </div>

//           {/* Filter Controls */}
//           <div style={{
//             background: "#f8fafc",
//             border: "1px solid #e2e8f0",
//             borderRadius: "8px",
//             padding: "16px",
//             marginBottom: "20px",
//             display: "flex",
//             gap: "12px",
//             alignItems: "center",
//             flexWrap: "wrap"
//           }}>
//             <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
//               <label style={{ fontSize: "0.9rem", fontWeight: "600" }}>Tampilkan:</label>
//               <select
//                 value={filterType}
//                 onChange={(e) => setFilterType(e.target.value)}
//                 style={{
//                   padding: "6px 12px",
//                   border: "1px solid #cbd5e1",
//                   borderRadius: "6px",
//                   fontSize: "0.9rem"
//                 }}
//               >
//                 <option value="month">Per Bulan</option>
//                 <option value="year">Per Tahun</option>
//               </select>
//             </div>

//             {filterType === "month" && (
//               <>
//                 <select
//                   value={filterMonth}
//                   onChange={(e) => setFilterMonth(parseInt(e.target.value))}
//                   style={{
//                     padding: "6px 12px",
//                     border: "1px solid #cbd5e1",
//                     borderRadius: "6px",
//                     fontSize: "0.9rem"
//                   }}
//                 >
//                   {["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"].map((m, i) => (
//                     <option key={i} value={i + 1}>{m}</option>
//                   ))}
//                 </select>
//               </>
//             )}

//             <select
//               value={filterYear}
//               onChange={(e) => setFilterYear(parseInt(e.target.value))}
//               style={{
//                 padding: "6px 12px",
//                 border: "1px solid #cbd5e1",
//                 borderRadius: "6px",
//                 fontSize: "0.9rem"
//               }}
//             >
//               {[2026, 2025, 2024, 2023, 2022].map((y) => (
//                 <option key={y} value={y}>{y}</option>
//               ))}
//             </select>
//           </div>

//           {/* Score Card */}
//           <div className={styles.scoreCard}>
//             <div className={styles.scoreLeft}>
//               <p className={styles.scoreMeta}>Financial Health Score</p>
//               {data.surveyTersedia ? (
//                 <>
//                   <div className={styles.scoreCircle} style={{ borderColor: meta.bar }}>
//                     <span className={styles.scoreNumber} style={{ color: meta.bar }}>{data.skorKesehatan}</span>
//                     <span className={styles.scoreMax}>/100</span>
//                   </div>
//                   <span className={styles.scoreBadge}
//                     style={{ background: meta.bg, color: meta.text, borderColor: meta.border }}>
//                     {cat}
//                   </span>
//                 </>
//               ) : (
//                 <>
//                   <div className={styles.scoreCircle} style={{ borderColor: "#cbd5e1" }}>
//                     <span className={styles.scoreNumber} style={{ color: "#cbd5e1" }}>—</span>
//                     <span className={styles.scoreMax}>/100</span>
//                   </div>
//                   <span className={styles.scoreBadge}
//                     style={{ background: "#f8fafc", color: "#64748b", borderColor: "#cbd5e1" }}>
//                     Belum Ada Data
//                   </span>
//                   <span className={styles.noSurveyTag}>Isi Survey Terlebih Dahulu</span>
//                 </>
//               )}
//             </div>

//             <div className={styles.scoreDims}>
//               {hasData ? (
//                 <div className={styles.obsGrid}>
//                   <div>
//                     <p className={styles.dimsTitle}><BarChart3 size={13} style={{ display:"inline", marginRight:4 }} />Objektif (O)</p>
//                     <ScoreBarDesc label="Saving Ratio"   scoreKey="savingRatio"   score={O.savingRatio} />
//                     <ScoreBarDesc label="Expense Ratio"  scoreKey="expenseRatio"  score={O.expenseRatio} />
//                     <ScoreBarDesc label="Cash Flow"      scoreKey="cashFlow"      score={O.cashFlow} />
//                     <ScoreBarDesc label="Kesehatan Hutang (Debt Ratio)"     scoreKey="debtRatio"     score={O.debtRatio} />
//                   </div>
//                   <div>
//                     <p className={styles.dimsTitle}><Brain size={13} style={{ display:"inline", marginRight:4 }} />Perilaku (B)</p>
//                     <ScoreBarDesc label="Rasio Konsumtif"     scoreKey="consumptiveRatio"    score={B.consumptiveRatio} />
//                     <ScoreBarDesc label="Frekuensi Transaksi" scoreKey="transactionFrequency" score={B.transactionFrequency} />
//                     <ScoreBarDesc label="Kontrol Impulsif"   scoreKey="impulsiveSpending"   score={B.impulsiveSpending} />
//                     <ScoreBarDesc label="Disiplin Anggaran"   scoreKey="budgetDiscipline"    score={B.budgetDiscipline} />
//                   </div>
//                   <div>
//                     <p className={styles.dimsTitle}><Heart size={13} style={{ display:"inline", marginRight:4 }} />Subjektif (S)</p>
//                     {data.surveyTersedia ? (
//                       <>
//                         <ScoreBarDesc label="Kepuasan Finansial" scoreKey="satisfaction" score={S.satisfaction} />
//                         <ScoreBarDesc label="Rasa Aman"          scoreKey="security"     score={S.security} />
//                         <ScoreBarDesc label="Kepercayaan Diri"   scoreKey="confidence"   score={S.confidence} />
//                         <button
//                           onClick={handleOpenSurveyModal}
//                           style={{
//                             marginTop: "12px",
//                             padding: "8px 12px",
//                             background: "#0ea5e9",
//                             color: "white",
//                             border: "none",
//                             borderRadius: "6px",
//                             fontSize: "0.85rem",
//                             fontWeight: "600",
//                             cursor: "pointer"
//                           }}
//                         >
//                           Ubah Survey
//                         </button>
//                       </>
//                     ) : (
//                       <div className={styles.surveyMissing}>
//                         <ClipboardList size={20} className={styles.surveyMissingIcon} />
//                         <p className={styles.surveyMissingText}>Survey belum diisi</p>
//                         <p className={styles.surveyMissingHint}>
//                           Isi evaluasi subjektif untuk mendapatkan skor kesehatan finansial yang lengkap.
//                         </p>
//                         <button
//                           onClick={handleOpenSurveyModal}
//                           style={{
//                             marginTop: "12px",
//                             padding: "10px 16px",
//                             background: "#0ea5e9",
//                             color: "white",
//                             border: "none",
//                             borderRadius: "6px",
//                             fontSize: "0.9rem",
//                             fontWeight: "600",
//                             cursor: "pointer"
//                           }}
//                         >
//                           Isi Survey Sekarang
//                         </button>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               ) : (
//                 <p className={styles.noDataText}>Tambahkan transaksi untuk melihat analisis OBS.</p>
//               )}
//             </div>
//           </div>

//           {/* Category Analysis */}
//           <div className={styles.section}>
//             <h2 className={styles.sectionTitle}>
//               <Activity size={18} className={styles.sectionIcon} />Analisis Pengeluaran
//             </h2>
//             <div className={styles.groupsGrid}>
//               <GroupBlock title="Konsumtif" icon={ShoppingBag} iconColor="#f87171"
//                 items={data.kategori.konsumtif} total={konsumtifTotal} emptyMsg="Tidak ada pengeluaran konsumtif."
//                 onItemClick={(cat) => { setSelectedCategory(cat); setShowDetailModal(true); }} />
//               <GroupBlock title="Kebutuhan" icon={Home} iconColor="#0ea5e9"
//                 items={data.kategori.kebutuhan} total={kebutuhanTotal} emptyMsg="Tidak ada pengeluaran kebutuhan."
//                 onItemClick={(cat) => { setSelectedCategory(cat); setShowDetailModal(true); }} />
//               <GroupBlock title="Produktif & Investasi" icon={TrendingUp} iconColor="#22c55e"
//                 items={data.kategori.produktif} total={produktifTotal} emptyMsg="Belum ada pengeluaran produktif."
//                 onItemClick={(cat) => { setSelectedCategory(cat); setShowDetailModal(true); }} />
//             </div>
//           </div>

//           {/* Warnings */}
//           {data.warning.length > 0 && (
//             <div className={styles.section}>
//               <h2 className={styles.sectionTitle}>
//                 <AlertTriangle size={18} className={styles.sectionIconWarn} />Peringatan
//               </h2>
//               <div className={styles.cardList}>
//                 {data.warning.map((w, i) => (
//                   <div key={i} className={styles.warnCard}>
//                     <AlertTriangle size={15} className={styles.warnIcon} />
//                     <p className={styles.cardText}>{w}</p>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Insights */}
//           {data.insight.length > 0 && (
//             <div className={styles.section}>
//               <h2 className={styles.sectionTitle}>
//                 <Lightbulb size={18} className={styles.sectionIconInfo} />Insight Otomatis
//               </h2>
//               <div className={styles.cardList}>
//                 {data.insight.map((ins, i) => (
//                   <div key={i} className={styles.infoCard}>
//                     <CheckCircle2 size={15} className={styles.infoIcon} />
//                     <p className={styles.cardText}>{ins}</p>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {data.warning.length === 0 && data.insight.length === 0 && (
//             <div className={styles.emptyState}>
//               <Lightbulb size={28} className={styles.emptyIcon} />
//               <p className={styles.emptyTitle}>Belum ada insight</p>
//               <p className={styles.emptyDesc}>Tambahkan transaksi untuk memulai analisis keuangan Anda.</p>
//             </div>
//           )}
//         </main>
//       </div>
//       <Footer />

//       {/* Detail Transaksi Modal */}
//       {showDetailModal && selectedCategory && (
//         <div style={{
//           position: "fixed",
//           top: 0,
//           left: 0,
//           right: 0,
//           bottom: 0,
//           background: "rgba(0,0,0,0.5)",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           zIndex: 1000
//         }} onClick={() => setShowDetailModal(false)}>
//           <div style={{
//             background: "white",
//             borderRadius: "12px",
//             padding: "24px",
//             maxWidth: "600px",
//             width: "90%",
//             maxHeight: "80vh",
//             overflowY: "auto",
//             boxShadow: "0 20px 25px rgba(0,0,0,0.15)"
//           }} onClick={(e) => e.stopPropagation()}>
//             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
//               <h2 style={{ margin: 0, fontSize: "1.3rem" }}>{selectedCategory}</h2>
//               <button onClick={() => setShowDetailModal(false)} style={{
//                 background: "none",
//                 border: "none",
//                 fontSize: "1.5rem",
//                 cursor: "pointer"
//               }}>
//                 <X size={24} />
//               </button>
//             </div>

//             {/* Detail Transaksi List */}
//             {getFilteredTransactions(selectedCategory).length > 0 ? (
//               <div>
//                 <table style={{ width: "100%", borderCollapse: "collapse" }}>
//                   <thead>
//                     <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
//                       <th style={{ textAlign: "left", padding: "8px 0", fontWeight: "600", fontSize: "0.9rem" }}>Tanggal</th>
//                       <th style={{ textAlign: "left", padding: "8px 0", fontWeight: "600", fontSize: "0.9rem" }}>Tipe</th>
//                       <th style={{ textAlign: "left", padding: "8px 0", fontWeight: "600", fontSize: "0.9rem" }}>Keterangan</th>
//                       <th style={{ textAlign: "right", padding: "8px 0", fontWeight: "600", fontSize: "0.9rem" }}>Jumlah</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {getFilteredTransactions(selectedCategory)
//                       .sort((a, b) => new Date(b.date) - new Date(a.date))
//                       .map((tx) => (
//                         <tr key={tx.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
//                           <td style={{ padding: "12px 0", fontSize: "0.9rem" }}>
//                             {new Date(tx.date).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "2-digit" })}
//                           </td>
//                           <td style={{ padding: "12px 0", fontSize: "0.9rem" }}>
//                             <span style={{
//                               display: "inline-block",
//                               padding: "2px 8px",
//                               borderRadius: "4px",
//                               fontSize: "0.8rem",
//                               fontWeight: "600",
//                               background: tx.type === "income" ? "#dcfce7" : "#fee2e2",
//                               color: tx.type === "income" ? "#166534" : "#991b1b"
//                             }}>
//                               {tx.type === "income" ? "Masuk" : "Keluar"}
//                             </span>
//                           </td>
//                           <td style={{ padding: "12px 0", fontSize: "0.9rem" }}>
//                             {tx.description || "-"}
//                           </td>
//                           <td style={{ textAlign: "right", padding: "12px 0", fontSize: "0.9rem", fontWeight: "600" }}>
//                             {formatRupiah(tx.amount)}
//                           </td>
//                         </tr>
//                       ))}
//                   </tbody>
//                 </table>

//                 {/* Total Summary */}
//                 <div style={{
//                   background: "#f0f9ff",
//                   border: "1px solid #bae6fd",
//                   borderRadius: "8px",
//                   padding: "12px 16px",
//                   marginTop: "16px",
//                   display: "flex",
//                   justifyContent: "space-between",
//                   alignItems: "center"
//                 }}>
//                   <span style={{ fontWeight: "600", color: "#0369a1" }}>Total</span>
//                   <span style={{ fontSize: "1.1rem", fontWeight: "700", color: "#0369a1" }}>
//                     {formatRupiah(
//                       getFilteredTransactions(selectedCategory)
//                         .reduce((sum, tx) => sum + Number(tx.amount), 0)
//                     )}
//                   </span>
//                 </div>
//               </div>
//             ) : (
//               <p style={{ textAlign: "center", color: "#666", padding: "20px" }}>
//                 Tidak ada transaksi untuk kategori ini
//               </p>
//             )}
//           </div>
//         </div>
//       )}

//       {/* Survey Modal */}
//       {showSurveyModal && (
//         <div className={styles.modalOverlay} onClick={(e) => { if (e.target === e.currentTarget) setShowSurveyModal(false); }}>
//           <div className={styles.modalCard}>
//             <div className={styles.modalHeader}>
//               <div className={styles.modalTitleRow}>
//                 <ClipboardList size={18} className={styles.modalTitleIcon} />
//                 <h2 className={styles.modalTitle}>Evaluasi Keuangan</h2>
//               </div>
//               <button className={styles.modalCloseBtn} onClick={() => setShowSurveyModal(false)}>
//                 <X size={18} />
//               </button>
//             </div>

//             <p className={styles.modalSubtitle}>
//               Penilaian ini merupakan komponen Subjektif (S) dalam analisis OBS — mencerminkan
//               perasaan Anda terhadap kondisi keuangan. Skala 1 (sangat buruk) hingga 5 (sangat baik).
//             </p>

//             <div className={styles.questionBlock}>
//               <p className={styles.questionLabel}>1. Seberapa puas Anda dengan kondisi keuangan?</p>
//               <LikertRow value={satisfaction} onChange={setSatisfaction} />
//             </div>

//             <div className={styles.questionBlock}>
//               <p className={styles.questionLabel}>2. Seberapa aman Anda merasa secara finansial?</p>
//               <LikertRow value={security} onChange={setSecurity} />
//             </div>

//             <div className={styles.questionBlock}>
//               <p className={styles.questionLabel}>3. Seberapa percaya diri Anda dalam mengelola keuangan?</p>
//               <LikertRow value={confidence} onChange={setConfidence} />
//             </div>

//             <div className={styles.questionBlock}>
//               <p className={styles.questionLabel}>Catatan <span className={styles.optionalTag}>(opsional)</span></p>
//               <textarea
//                 className={styles.noteField}
//                 rows={3}
//                 placeholder="Tuliskan catatan atau konteks tambahan..."
//                 value={surveyNote}
//                 onChange={(e) => setSurveyNote(e.target.value)}
//               />
//             </div>

//             <div className={styles.modalFooter}>
//               <button className={styles.modalCancelBtn} onClick={() => setShowSurveyModal(false)}>
//                 Nanti Saja
//               </button>
//               <button
//                 className={styles.modalSubmitBtn}
//                 onClick={handleSurveySave}
//                 disabled={submittingSurvey}
//               >
//                 {submittingSurvey ? "Menyimpan..." : "Simpan Evaluasi"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Insight;
import { useState, useEffect } from "react";
import {
 AlertTriangle, CheckCircle2, ShoppingBag, Home, TrendingUp,
 Lightbulb, Activity, BarChart3, Brain, Heart, ClipboardList, X,
} from "lucide-react";
import Swal from "sweetalert2";
import { getDashboard } from "../services/financeService.js";
import { submitSurvey, getSurvey } from "../services/surveyService.js";
import { useAuth } from "../context/AuthContext.jsx";
import API from "../services/api.js";
import Sidebar from "../components/Sidebar.jsx";
import Footer from "../components/Footer.jsx";
import styles from "../styles/pages/Insight.module.css";


const formatRupiah = (n) =>
 new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);


const SCORE_COLOR = { 5: "#22c55e", 4: "#0ea5e9", 3: "#f59e0b", 2: "#f97316", 1: "#ef4444" };
const scoreColor = (s) => SCORE_COLOR[s] || "#e2e8f0";


const HEALTH_META = {
 "Sangat Sehat": { bg: "#f0fdf4", text: "#15803d", border: "#bbf7d0", bar: "#22c55e" },
 "Sehat":        { bg: "#f0f9ff", text: "#0369a1", border: "#bae6fd", bar: "#0ea5e9" },
 "Cukup":        { bg: "#fffbeb", text: "#b45309", border: "#fde68a", bar: "#f59e0b" },
 "Berisiko":     { bg: "#fff7ed", text: "#c2410c", border: "#fed7aa", bar: "#f97316" },
 "Tidak Sehat":  { bg: "#fef2f2", text: "#dc2626", border: "#fecaca", bar: "#ef4444" },
};


function getCategory(score) {
 if (score >= 80) return "Sangat Sehat";
 if (score >= 60) return "Sehat";
 if (score >= 40) return "Cukup";
 if (score >= 20) return "Berisiko";
 return "Tidak Sehat";
}


const DESC = {
 savingRatio: ["","Saving ratio negatif — pengeluaran melebihi pendapatan.","Saving ratio <10%. Sisihkan minimal 10% dari pendapatan.","Saving ratio 10–19%. Masih ada ruang untuk ditingkatkan.","Saving ratio 20–29%. Pertahankan, target ideal ≥30%.","Saving ratio ≥30%. Sangat disiplin menyisihkan pendapatan."],
 expenseRatio: ["","Pengeluaran melebihi atau sama dengan pendapatan.","Rasio pengeluaran 90–99%. Hampir tidak ada ruang saving.","Rasio pengeluaran 70–89%. Pengeluaran cukup tinggi.","Rasio pengeluaran 50–69%. Pengeluaran terkontrol.","Rasio pengeluaran <50%. Sangat efisien."],
 cashFlow: ["","Defisit >10% dari pendapatan. Perlu tindakan segera.","Defisit ringan. Perhatikan pengeluaran.","Arus kas sedikit positif atau break-even.","Surplus 10–29% dari pendapatan. Arus kas sehat.","Surplus ≥30% dari pendapatan. Arus kas sangat sehat."],
 debtRatio: ["","Kesehatan sangat buruk — cicilan/hutang ≥40% pendapatan, tekanan sangat tinggi.","Kesehatan buruk — cicilan 30–39% pendapatan, beban cukup berat.","Kesehatan cukup — cicilan 20–29% pendapatan, cukup signifikan.","Kesehatan baik — cicilan 10–19% pendapatan, masih terkendali.","Kesehatan sangat baik — tidak ada atau hampir tidak ada hutang/cicilan."],
 consumptiveRatio: ["","Pengeluaran konsumtif ≥70% dari total belanja — sangat dominan.","Pengeluaran konsumtif 50–69%. Perlu dikurangi.","Pengeluaran konsumtif 35–49%. Cukup tinggi.","Pengeluaran konsumtif 20–34%. Terkendali.","Pengeluaran konsumtif <20%. Sangat terkendali."],
 transactionFrequency: ["","Transaksi >50 pengeluaran — sangat sering, indikasi impulsif.","Transaksi 36–50 pengeluaran. Frekuensi cukup tinggi.","Transaksi 21–35 pengeluaran. Frekuensi sedang.","Transaksi 11–20 pengeluaran. Terkontrol.","Transaksi ≤10 pengeluaran. Sangat terkontrol."],
 impulsiveSpending: ["","Kontrol sangat lemah — dominasi transaksi kecil berulang, indikasi impulsive buying kuat.","Kontrol kurang baik — banyak transaksi kecil, potensi impulsive buying.","Kontrol sedang — cukup banyak transaksi kecil berulang.","Kontrol baik — sedikit transaksi kecil, pola belanja terjaga.","Kontrol sangat baik — hampir tidak ada transaksi kecil, pola belanja sangat disiplin."],
 budgetDiscipline: ["","Anggaran terlampaui — pengeluaran melebihi pendapatan.","Hampir melebihi batas anggaran (90–100% pendapatan).","Pengeluaran 75–90% pendapatan. Anggaran cukup terjaga.","Pengeluaran 60–75% pendapatan. Disiplin anggaran baik.","Pengeluaran ≤60% pendapatan. Sangat disiplin."],
 satisfaction: ["","Sangat tidak puas dengan kondisi keuangan.","Kurang puas dengan kondisi keuangan.","Cukup puas dengan kondisi keuangan.","Puas dengan kondisi keuangan.","Sangat puas dengan kondisi keuangan."],
 security: ["","Sangat tidak merasa aman secara finansial.","Merasa kurang aman secara finansial.","Cukup merasa aman secara finansial.","Merasa aman secara finansial.","Sangat merasa aman secara finansial."],
 confidence: ["","Sangat tidak percaya diri mengelola keuangan.","Kurang percaya diri mengelola keuangan.","Cukup percaya diri mengelola keuangan.","Percaya diri mengelola keuangan.","Sangat percaya diri mengelola keuangan."],
};


const getDesc = (key, score) =>
 score > 0 && DESC[key] ? (DESC[key][score] || "") : "Tidak ada data";


function LikertRow({ value, onChange }) {
 return (
   <div className={styles.likertRow}>
     <span className={styles.likertEnd}>Sangat Buruk</span>
     {[1, 2, 3, 4, 5].map((n) => (
       <button
         key={n}
         type="button"
         className={`${styles.likertBtn} ${value === n ? styles.likertBtnActive : ""}`}
         onClick={() => onChange(n)}
       >
         {n}
       </button>
     ))}
     <span className={styles.likertEnd}>Sangat Baik</span>
   </div>
 );
}


function ScoreBarDesc({ label, scoreKey, score }) {
 const pct = score > 0 ? (score / 5) * 100 : 0;
 const color = scoreColor(score);
 return (
   <div className={styles.dimBar}>
     <div className={styles.dimBarHeader}>
       <span className={styles.dimLabel}>{label}</span>
       <span className={styles.dimScore} style={{ color }}>
         {score || "–"}<span className={styles.dimMax}>/5</span>
       </span>
     </div>
     <div className={styles.dimTrack}>
       <div className={styles.dimFill} style={{ width: `${pct}%`, background: color }} />
     </div>
     <p className={styles.dimDesc}>{getDesc(scoreKey, score)}</p>
   </div>
 );
}


function GroupBlock({ title, icon: Icon, iconColor, items, total, emptyMsg, onItemClick }) {
 return (
   <div className={styles.groupCard}>
     <div className={styles.groupHeader}>
       <Icon size={16} style={{ color: iconColor }} />
       <span className={styles.groupTitle}>{title}</span>
       <span className={styles.groupTotal}>{formatRupiah(total)}</span>
     </div>
     {items.length === 0 ? (
       <p className={styles.groupEmpty}>{emptyMsg}</p>
     ) : (
       <div className={styles.groupRows}>
         {items.map((item, i) => (
           <div
             key={i}
             className={styles.groupRow}
             onClick={() => onItemClick && onItemClick(item.category)}
             style={{
               cursor: "pointer",
               transition: "background 0.2s",
             }}
             onMouseEnter={(e) => e.currentTarget.style.background = "#f8fafc"}
             onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
           >
             <div className={styles.groupRowLeft}>
               <div className={styles.groupBar} style={{ background: `${iconColor}20` }}>
                 <div className={styles.groupBarFill} style={{ width: `${item.pct}%`, background: iconColor }} />
               </div>
               <span className={styles.groupCat}>{item.category}</span>
             </div>
             <div className={styles.groupRowRight}>
               <span className={styles.groupAmt}>{formatRupiah(item.total)}</span>
               <span className={styles.groupPct}>{item.pct}%</span>
             </div>
           </div>
         ))}
       </div>
     )}
   </div>
 );
}


function Insight() {
 const { user } = useAuth();
 const now = new Date();
 const [data, setData] = useState(null);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState(null);
 const [transactions, setTransactions] = useState([]);
 const [showDetailModal, setShowDetailModal] = useState(false);
 const [selectedCategory, setSelectedCategory] = useState(null);


 // ── Filter states ──────────────────────────
 const [filterMonth, setFilterMonth] = useState(now.getMonth() + 1);
 const [filterYear, setFilterYear] = useState(now.getFullYear());
 const [filterType, setFilterType] = useState("month"); // "month" atau "year"


 // ── Survey modal states ──────────────────────────
 const [showSurveyModal, setShowSurveyModal] = useState(false);
 const [satisfaction, setSatisfaction] = useState(3);
 const [security, setSecurity] = useState(3);
 const [confidence, setConfidence] = useState(3);
 const [surveyNote, setSurveyNote] = useState("");
 const [submittingSurvey, setSubmittingSurvey] = useState(false);
 const [surveyExistsForMonth, setSurveyExistsForMonth] = useState(false);


 const handleOpenSurveyModal = async () => {
   // Fetch existing survey jika ada
   if (surveyExistsForMonth) {
     try {
       const surveyRes = await getSurvey(user.id, filterYear, filterMonth);
       if (surveyRes && surveyRes.data) {
         setSatisfaction(surveyRes.data.financial_satisfaction || 3);
         setSecurity(surveyRes.data.financial_security || 3);
         setConfidence(surveyRes.data.financial_confidence || 3);
         setSurveyNote(surveyRes.data.note || "");
       }
     } catch (e) {
       console.error("Error fetching survey:", e);
     }
   }
   setShowSurveyModal(true);
 };


 const handleSurveySave = async () => {
   setSubmittingSurvey(true);
   try {
     await submitSurvey({
       user_id: user.id,
       period_year: filterYear,
       period_month: filterMonth,
       financial_satisfaction: satisfaction,
       financial_security: security,
       financial_confidence: confidence,
       note: surveyNote,
     });


     setShowSurveyModal(false);
     Swal.fire({
       icon: "success",
       title: "Evaluasi Tersimpan",
       text: `Penilaian keuangan berhasil dicatat.`,
       timer: 2500,
       showConfirmButton: false,
       toast: true,
       position: "top-end",
     });


     // Refetch data setelah survey disimpan
     setTimeout(() => {
       const params = filterType === "month"
         ? `?year=${filterYear}&month=${filterMonth}`
         : `?year=${filterYear}`;
       getDashboard(user.id, params)
         .then((res) => {
           setData(res.data);
           setSurveyExistsForMonth(res.data.surveyTersedia);
         })
         .catch((err) => console.error(err));
     }, 1500);
   } catch (e) {
     Swal.fire({ icon: "error", title: "Gagal menyimpan", text: e.message });
   } finally {
     setSubmittingSurvey(false);
   }
 };


 useEffect(() => {
   setLoading(true);
   const params = filterType === "month"
     ? `?year=${filterYear}&month=${filterMonth}`
     : `?year=${filterYear}`;


   Promise.all([
     getDashboard(user.id, params),
     API.get(`/transactions/${user.id}`)
   ])
     .then(([dashRes, txRes]) => {
       setData(dashRes.data);
       setTransactions(txRes.data);
       setSurveyExistsForMonth(dashRes.data.surveyTersedia);
       // Reset survey form values for new month
       setSatisfaction(3);
       setSecurity(3);
       setConfidence(3);
       setSurveyNote("");
     })
     .catch((err) => setError(err.message))
     .finally(() => setLoading(false));
 }, [filterMonth, filterYear, filterType]);


 // Helper untuk filter transaksi
 const getFilteredTransactions = (category) => {
   return transactions.filter((t) => {
     if (t.category !== category) return false;
     const txDate = new Date(t.date);
     const txMonth = txDate.getMonth() + 1;
     const txYear = txDate.getFullYear();


     if (filterType === "month") {
       return txMonth === filterMonth && txYear === filterYear;
     } else {
       return txYear === filterYear;
     }
   });
 };


 if (loading) return (
   <div className={styles.page}>
     <div className={styles.body}><Sidebar />
       <main className={styles.main}>
         <div className={styles.loadingBox}><div className={styles.spinner} /><p className={styles.loadingText}>Menganalisis data...</p></div>
       </main>
     </div><Footer />
   </div>
 );


 if (error) return (
   <div className={styles.page}>
     <div className={styles.body}><Sidebar />
       <main className={styles.main}>
         <div className={styles.errorBox}>
           <AlertTriangle size={24} className={styles.errorIcon} />
           <p className={styles.errorTitle}>Gagal memuat insight</p>
           <p className={styles.errorMsg}>{error}</p>
         </div>
       </main>
     </div><Footer />
   </div>
 );


 const cat  = getCategory(data.skorKesehatan);
 const meta = HEALTH_META[cat];
 const { objective: O, behavioral: B, subjective: S } = data.dimensiSkor;
 const konsumtifTotal = data.kategori.konsumtif.reduce((s, k) => s + k.total, 0);
 const kebutuhanTotal = data.kategori.kebutuhan.reduce((s, k) => s + k.total, 0);
 const produktifTotal = data.kategori.produktif.reduce((s, k) => s + k.total, 0);
 const hasData = data.totalPendapatan > 0 || data.totalPengeluaran > 0;


 return (
   <div className={styles.page}>
     <div className={styles.body}>
       <Sidebar />
       <main className={styles.main}>


         <div className={styles.header}>
           <p className={styles.label}>Rekomendasi</p>
           <h1 className={styles.title}>Insight & Saran</h1>
           <p className={styles.subtitle}>Analisis OBS: Objektif · Perilaku · Subjektif</p>
         </div>


         {/* Filter Controls */}
         <div style={{
           background: "#f8fafc",
           border: "1px solid #e2e8f0",
           borderRadius: "8px",
           padding: "16px",
           marginBottom: "20px",
           display: "flex",
           gap: "12px",
           alignItems: "center",
           flexWrap: "wrap"
         }}>
           <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
             <label style={{ fontSize: "0.9rem", fontWeight: "600" }}>Tampilkan:</label>
             <select
               value={filterType}
               onChange={(e) => setFilterType(e.target.value)}
               style={{
                 padding: "6px 12px",
                 border: "1px solid #cbd5e1",
                 borderRadius: "6px",
                 fontSize: "0.9rem"
               }}
             >
               <option value="month">Per Bulan</option>
               <option value="year">Per Tahun</option>
             </select>
           </div>


           {filterType === "month" && (
             <>
               <select
                 value={filterMonth}
                 onChange={(e) => setFilterMonth(parseInt(e.target.value))}
                 style={{
                   padding: "6px 12px",
                   border: "1px solid #cbd5e1",
                   borderRadius: "6px",
                   fontSize: "0.9rem"
                 }}
               >
                 {["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"].map((m, i) => (
                   <option key={i} value={i + 1}>{m}</option>
                 ))}
               </select>
             </>
           )}


           <select
             value={filterYear}
             onChange={(e) => setFilterYear(parseInt(e.target.value))}
             style={{
               padding: "6px 12px",
               border: "1px solid #cbd5e1",
               borderRadius: "6px",
               fontSize: "0.9rem"
             }}
           >
             {[2026, 2025, 2024, 2023, 2022].map((y) => (
               <option key={y} value={y}>{y}</option>
             ))}
           </select>
         </div>


         {/* Score Card */}
         <div className={styles.scoreCard}>
           <div className={styles.scoreLeft}>
             <p className={styles.scoreMeta}>Financial Health Score</p>
             {data.surveyTersedia ? (
               <>
                 <div className={styles.scoreCircle} style={{ borderColor: meta.bar }}>
                   <span className={styles.scoreNumber} style={{ color: meta.bar }}>{data.skorKesehatan}</span>
                   <span className={styles.scoreMax}>/100</span>
                 </div>
                 <span className={styles.scoreBadge}
                   style={{ background: meta.bg, color: meta.text, borderColor: meta.border }}>
                   {cat}
                 </span>
               </>
             ) : (
               <>
                 <div className={styles.scoreCircle} style={{ borderColor: "#cbd5e1" }}>
                   <span className={styles.scoreNumber} style={{ color: "#cbd5e1" }}>—</span>
                   <span className={styles.scoreMax}>/100</span>
                 </div>
                 <span className={styles.scoreBadge}
                   style={{ background: "#f8fafc", color: "#64748b", borderColor: "#cbd5e1" }}>
                   Belum Ada Data
                 </span>
                 <span className={styles.noSurveyTag}>Isi Survey Terlebih Dahulu</span>
               </>
             )}
           </div>


           <div className={styles.scoreDims}>
             {hasData ? (
               <div className={styles.obsGrid}>
                 <div>
                   <p className={styles.dimsTitle}><BarChart3 size={13} style={{ display:"inline", marginRight:4 }} />Objektif (O)</p>
                   <ScoreBarDesc label="Saving Ratio"   scoreKey="savingRatio"   score={O.savingRatio} />
                   <ScoreBarDesc label="Expense Ratio"  scoreKey="expenseRatio"  score={O.expenseRatio} />
                   <ScoreBarDesc label="Cash Flow"      scoreKey="cashFlow"      score={O.cashFlow} />
                   <ScoreBarDesc label="Kesehatan Hutang (Debt Ratio)"     scoreKey="debtRatio"     score={O.debtRatio} />
                 </div>
                 <div>
                   <p className={styles.dimsTitle}><Brain size={13} style={{ display:"inline", marginRight:4 }} />Perilaku (B)</p>
                   <ScoreBarDesc label="Rasio Konsumtif"     scoreKey="consumptiveRatio"    score={B.consumptiveRatio} />
                   <ScoreBarDesc label="Frekuensi Transaksi" scoreKey="transactionFrequency" score={B.transactionFrequency} />
                   <ScoreBarDesc label="Kontrol Impulsif"   scoreKey="impulsiveSpending"   score={B.impulsiveSpending} />
                   <ScoreBarDesc label="Disiplin Anggaran"   scoreKey="budgetDiscipline"    score={B.budgetDiscipline} />
                 </div>
                 <div>
                   <p className={styles.dimsTitle}><Heart size={13} style={{ display:"inline", marginRight:4 }} />Subjektif (S)</p>
                   {data.surveyTersedia ? (
                     <>
                       <ScoreBarDesc label="Kepuasan Finansial" scoreKey="satisfaction" score={S.satisfaction} />
                       <ScoreBarDesc label="Rasa Aman"          scoreKey="security"     score={S.security} />
                       <ScoreBarDesc label="Kepercayaan Diri"   scoreKey="confidence"   score={S.confidence} />
                       <button
                         onClick={handleOpenSurveyModal}
                         style={{
                           marginTop: "12px",
                           padding: "8px 12px",
                           background: "#0ea5e9",
                           color: "white",
                           border: "none",
                           borderRadius: "6px",
                           fontSize: "0.85rem",
                           fontWeight: "600",
                           cursor: "pointer"
                         }}
                       >
                         Ubah Survey
                       </button>
                     </>
                   ) : (
                     <div className={styles.surveyMissing}>
                       <ClipboardList size={20} className={styles.surveyMissingIcon} />
                       <p className={styles.surveyMissingText}>Survey belum diisi</p>
                       <p className={styles.surveyMissingHint}>
                         Isi evaluasi subjektif untuk mendapatkan skor kesehatan finansial yang lengkap.
                       </p>
                       <button
                         onClick={handleOpenSurveyModal}
                         style={{
                           marginTop: "12px",
                           padding: "10px 16px",
                           background: "#0ea5e9",
                           color: "white",
                           border: "none",
                           borderRadius: "6px",
                           fontSize: "0.9rem",
                           fontWeight: "600",
                           cursor: "pointer"
                         }}
                       >
                         Isi Survey Sekarang
                       </button>
                     </div>
                   )}
                 </div>
               </div>
             ) : (
               <p className={styles.noDataText}>Tambahkan transaksi untuk melihat analisis OBS.</p>
             )}
           </div>
         </div>


         {/* Category Analysis */}
         <div className={styles.section}>
           <h2 className={styles.sectionTitle}>
             <Activity size={18} className={styles.sectionIcon} />Analisis Pengeluaran
           </h2>
           <div className={styles.groupsGrid}>
             <GroupBlock title="Konsumtif" icon={ShoppingBag} iconColor="#f87171"
               items={data.kategori.konsumtif} total={konsumtifTotal} emptyMsg="Tidak ada pengeluaran konsumtif."
               onItemClick={(cat) => { setSelectedCategory(cat); setShowDetailModal(true); }} />
             <GroupBlock title="Kebutuhan" icon={Home} iconColor="#0ea5e9"
               items={data.kategori.kebutuhan} total={kebutuhanTotal} emptyMsg="Tidak ada pengeluaran kebutuhan."
               onItemClick={(cat) => { setSelectedCategory(cat); setShowDetailModal(true); }} />
             <GroupBlock title="Produktif & Investasi" icon={TrendingUp} iconColor="#22c55e"
               items={data.kategori.produktif} total={produktifTotal} emptyMsg="Belum ada pengeluaran produktif."
               onItemClick={(cat) => { setSelectedCategory(cat); setShowDetailModal(true); }} />
           </div>
         </div>


         {/* Warnings */}
         {data.warning.length > 0 && (
           <div className={styles.section}>
             <h2 className={styles.sectionTitle}>
               <AlertTriangle size={18} className={styles.sectionIconWarn} />Peringatan
             </h2>
             <div className={styles.cardList}>
               {data.warning.map((w, i) => (
                 <div key={i} className={styles.warnCard}>
                   <AlertTriangle size={15} className={styles.warnIcon} />
                   <p className={styles.cardText}>{w}</p>
                 </div>
               ))}
             </div>
           </div>
         )}


         {/* Insights */}
         {data.insight.length > 0 && (
           <div className={styles.section}>
             <h2 className={styles.sectionTitle}>
               <Lightbulb size={18} className={styles.sectionIconInfo} />Insight Otomatis
             </h2>
             <div className={styles.cardList}>
               {data.insight.map((ins, i) => (
                 <div key={i} className={styles.infoCard}>
                   <CheckCircle2 size={15} className={styles.infoIcon} />
                   <p className={styles.cardText}>{ins}</p>
                 </div>
               ))}
             </div>
           </div>
         )}


         {data.recommendation?.length > 0 && (
           <div className={styles.section}>
             <h2 className={styles.sectionTitle}>
               <ClipboardList size={18} className={styles.sectionIconInfo} />Rekomendasi
             </h2>
             <div className={styles.cardList}>
               {data.recommendation.map((rec, i) => (
                 <div key={i} className={styles.infoCard}>
                   <CheckCircle2 size={15} className={styles.infoIcon} />
                   <p className={styles.cardText}>{rec}</p>
                 </div>
               ))}
             </div>
           </div>
         )}


         {data.warning.length === 0 && data.insight.length === 0 && (!data.recommendation || data.recommendation.length === 0) && (
           <div className={styles.emptyState}>
             <Lightbulb size={28} className={styles.emptyIcon} />
             <p className={styles.emptyTitle}>Belum ada insight</p>
             <p className={styles.emptyDesc}>Tambahkan transaksi untuk memulai analisis keuangan Anda.</p>
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
             <h2 style={{ margin: 0, fontSize: "1.3rem" }}>{selectedCategory}</h2>
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
           {getFilteredTransactions(selectedCategory).length > 0 ? (
             <div>
               <table style={{ width: "100%", borderCollapse: "collapse" }}>
                 <thead>
                   <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
                     <th style={{ textAlign: "left", padding: "8px 0", fontWeight: "600", fontSize: "0.9rem" }}>Tanggal</th>
                     <th style={{ textAlign: "left", padding: "8px 0", fontWeight: "600", fontSize: "0.9rem" }}>Tipe</th>
                     <th style={{ textAlign: "left", padding: "8px 0", fontWeight: "600", fontSize: "0.9rem" }}>Keterangan</th>
                     <th style={{ textAlign: "right", padding: "8px 0", fontWeight: "600", fontSize: "0.9rem" }}>Jumlah</th>
                   </tr>
                 </thead>
                 <tbody>
                   {getFilteredTransactions(selectedCategory)
                     .sort((a, b) => new Date(b.date) - new Date(a.date))
                     .map((tx) => (
                       <tr key={tx.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                         <td style={{ padding: "12px 0", fontSize: "0.9rem" }}>
                           {new Date(tx.date).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "2-digit" })}
                         </td>
                         <td style={{ padding: "12px 0", fontSize: "0.9rem" }}>
                           <span style={{
                             display: "inline-block",
                             padding: "2px 8px",
                             borderRadius: "4px",
                             fontSize: "0.8rem",
                             fontWeight: "600",
                             background: tx.type === "income" ? "#dcfce7" : "#fee2e2",
                             color: tx.type === "income" ? "#166534" : "#991b1b"
                           }}>
                             {tx.type === "income" ? "Masuk" : "Keluar"}
                           </span>
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
                     getFilteredTransactions(selectedCategory)
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


     {/* Survey Modal */}
     {showSurveyModal && (
       <div className={styles.modalOverlay} onClick={(e) => { if (e.target === e.currentTarget) setShowSurveyModal(false); }}>
         <div className={styles.modalCard}>
           <div className={styles.modalHeader}>
             <div className={styles.modalTitleRow}>
               <ClipboardList size={18} className={styles.modalTitleIcon} />
               <h2 className={styles.modalTitle}>Evaluasi Keuangan</h2>
             </div>
             <button className={styles.modalCloseBtn} onClick={() => setShowSurveyModal(false)}>
               <X size={18} />
             </button>
           </div>


           <p className={styles.modalSubtitle}>
             Penilaian ini merupakan komponen Subjektif (S) dalam analisis OBS — mencerminkan
             perasaan Anda terhadap kondisi keuangan. Skala 1 (sangat buruk) hingga 5 (sangat baik).
           </p>


           <div className={styles.questionBlock}>
             <p className={styles.questionLabel}>1. Seberapa puas Anda dengan kondisi keuangan?</p>
             <LikertRow value={satisfaction} onChange={setSatisfaction} />
           </div>


           <div className={styles.questionBlock}>
             <p className={styles.questionLabel}>2. Seberapa aman Anda merasa secara finansial?</p>
             <LikertRow value={security} onChange={setSecurity} />
           </div>


           <div className={styles.questionBlock}>
             <p className={styles.questionLabel}>3. Seberapa percaya diri Anda dalam mengelola keuangan?</p>
             <LikertRow value={confidence} onChange={setConfidence} />
           </div>


           <div className={styles.questionBlock}>
             <p className={styles.questionLabel}>Catatan <span className={styles.optionalTag}>(opsional)</span></p>
             <textarea
               className={styles.noteField}
               rows={3}
               placeholder="Tuliskan catatan atau konteks tambahan..."
               value={surveyNote}
               onChange={(e) => setSurveyNote(e.target.value)}
             />
           </div>


           <div className={styles.modalFooter}>
             <button className={styles.modalCancelBtn} onClick={() => setShowSurveyModal(false)}>
               Nanti Saja
             </button>
             <button
               className={styles.modalSubmitBtn}
               onClick={handleSurveySave}
               disabled={submittingSurvey}
             >
               {submittingSurvey ? "Menyimpan..." : "Simpan Evaluasi"}
             </button>
           </div>
         </div>
       </div>
     )}
   </div>
 );
}


export default Insight;