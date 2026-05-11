import { groupByCategory } from "./categoryClassifier.js";

const fmt = (n) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

// ── DEBT DETECTION ───────────────────────────────────────────────
const DEBT_KEYWORDS = ["cicilan", "kpr", "angsuran", "pinjaman", "hutang", "kredit", "leasing", "mortgage"];
const isDebtCategory = (cat) => DEBT_KEYWORDS.some((kw) => (cat || "").toLowerCase().includes(kw));

// ── ORDINAL SCORING FUNCTIONS (returns 1–5) ──────────────────────

// O1: Saving Ratio = balance / income  (higher is better)
const scoreO1 = (r) => {
  if (r >= 0.30) return 5;
  if (r >= 0.20) return 4;
  if (r >= 0.10) return 3;
  if (r >= 0.00) return 2;
  return 1;
};

// O2: Expense Ratio = expense / income  (lower is better)
const scoreO2 = (r) => {
  if (r < 0.50) return 5;
  if (r < 0.70) return 4;
  if (r < 0.90) return 3;
  if (r < 1.00) return 2;
  return 1;
};

// O3: Cash Flow direction + magnitude relative to income
const scoreO3 = (balance, income) => {
  if (income === 0) return balance >= 0 ? 2 : 1;
  const r = balance / income;
  if (r >= 0.30) return 5;
  if (r >= 0.10) return 4;
  if (r > 0)    return 3;
  if (r > -0.10) return 2;
  return 1;
};

// O4: Debt Ratio = debt_payments / income  (lower is better)
const scoreO4 = (r) => {
  if (r < 0.10) return 5;
  if (r < 0.20) return 4;
  if (r < 0.30) return 3;
  if (r < 0.40) return 2;
  return 1;
};

// B1: Consumptive Ratio = consumptive / total_expense  (lower is better)
const scoreB1 = (r) => {
  if (r < 0.20) return 5;
  if (r < 0.35) return 4;
  if (r < 0.50) return 3;
  if (r < 0.70) return 2;
  return 1;
};

// B2: Transaction Frequency — expense transaction count  (fewer is better)
const scoreB2 = (count) => {
  if (count <= 10) return 5;
  if (count <= 20) return 4;
  if (count <= 35) return 3;
  if (count <= 50) return 2;
  return 1;
};

// B3: Impulsive Spending — % of small transactions  (lower % is better)
// "Small" = amount < 2% of income (or < 50.000 if no income)
const scoreB3 = (transactions, income) => {
  const expenses = transactions.filter((t) => t.type === "expense");
  if (expenses.length === 0) return 5;
  const threshold = income > 0 ? income * 0.02 : 50_000;
  const small = expenses.filter((t) => Number(t.amount) < threshold).length;
  const pct = small / expenses.length;
  if (pct < 0.20) return 5;
  if (pct < 0.40) return 4;
  if (pct < 0.55) return 3;
  if (pct < 0.70) return 2;
  return 1;
};

// B4: Budget Discipline — expense / income  (lower is more disciplined)
const scoreB4 = (r) => {
  if (r <= 0.60) return 5;
  if (r <= 0.75) return 4;
  if (r <= 0.90) return 3;
  if (r <= 1.00) return 2;
  return 1;
};

// ── COMPUTE FHS (EQUAL WEIGHTING) ───────────────────────────────
const hitungSkorOBS = ({
  savingRatio, expenseRatio, balance, income,
  debtRatio, consumptiveRatio, expenseCount,
  transactions, survey,
}) => {
  const o1 = scoreO1(savingRatio);
  const o2 = scoreO2(expenseRatio);
  const o3 = scoreO3(balance, income);
  const o4 = scoreO4(debtRatio);

  const b1 = scoreB1(consumptiveRatio);
  const b2 = scoreB2(expenseCount);
  const b3 = scoreB3(transactions, income);
  const b4 = scoreB4(expenseRatio);

  const s1 = survey?.financial_satisfaction ?? null;
  const s2 = survey?.financial_security ?? null;
  const s3 = survey?.financial_confidence ?? null;

  // Equal weighting: FHS = (sum_of_scores / max_possible) × 100
  const scores = [o1, o2, o3, o4, b1, b2, b3, b4];
  if (s1 !== null) scores.push(s1, s2, s3);

  const total = scores.reduce((a, v) => a + v, 0);
  const fhs = Math.round((total / (scores.length * 5)) * 100);

  return {
    total: fhs,
    surveyTersedia: s1 !== null,
    dimensi: {
      objective:  { savingRatio: o1, expenseRatio: o2, cashFlow: o3, debtRatio: o4 },
      behavioral: { consumptiveRatio: b1, transactionFrequency: b2, impulsiveSpending: b3, budgetDiscipline: b4 },
      subjective: { satisfaction: s1, security: s2, confidence: s3 },
    },
  };
};

// ── INSIGHT & WARNING ENGINE ─────────────────────────────────────
const generateInsightWarning = ({
  income, expense, balance,
  savingRatio, expenseRatio, consumptiveRatio, debtRatio,
  expenseCount, impulsiveScore, kategori, surveyTersedia,
}) => {
  const insight = [];
  const warning = [];

  if (income === 0) {
    warning.push("Belum ada data pendapatan. Mulai catat transaksi pemasukan Anda.");
    return { insight, warning };
  }

  // O3 — Cash Flow
  if (balance > 0) {
    insight.push(`Cash flow positif. Anda berhasil menyisihkan ${fmt(balance)} dari pendapatan.`);
  } else if (balance < 0) {
    warning.push(`Cash flow negatif. Pengeluaran melebihi pendapatan sebesar ${fmt(Math.abs(balance))}.`);
  }

  // O1 — Saving Ratio
  const savingPct = Math.round(savingRatio * 100);
  if (savingRatio >= 0.30) {
    insight.push(`Saving ratio sangat baik: ${savingPct}%. Anda menyisihkan lebih dari 30% pendapatan.`);
  } else if (savingRatio >= 0.20) {
    insight.push(`Saving ratio baik: ${savingPct}%. Target ideal 30% — Anda hampir mencapainya.`);
  } else if (savingRatio >= 0.10) {
    warning.push(`Saving ratio masih rendah: ${savingPct}%. Coba tingkatkan tabungan hingga minimal 20-30%.`);
  } else if (savingRatio >= 0) {
    warning.push(`Saving ratio sangat rendah: ${savingPct}%. Prioritaskan menyisihkan minimal 10% dari pendapatan.`);
  }

  // O2 — Expense Ratio
  const expensePct = Math.round(expenseRatio * 100);
  if (expenseRatio > 0.90 && balance >= 0) {
    warning.push(`Rasio pengeluaran sangat tinggi: ${expensePct}% dari pendapatan. Hampir tidak ada ruang untuk saving.`);
  }

  // O4 — Debt Ratio
  const debtPct = Math.round(debtRatio * 100);
  if (debtRatio >= 0.40) {
    warning.push(`Beban cicilan/hutang sangat berat: ${debtPct}% dari pendapatan. Pertimbangkan restrukturisasi utang.`);
  } else if (debtRatio >= 0.20) {
    warning.push(`Cicilan/hutang cukup signifikan: ${debtPct}% dari pendapatan. Jaga agar tidak terus bertambah.`);
  } else if (debtRatio > 0) {
    insight.push(`Beban cicilan masih terkendali: ${debtPct}% dari pendapatan.`);
  }

  // B1 — Consumptive Ratio
  const konsumtifTotal = kategori.konsumtif.reduce((s, k) => s + k.total, 0);
  const konsumtifPct = Math.round(consumptiveRatio * 100);
  if (kategori.konsumtif.length > 0) {
    const top = kategori.konsumtif[0];
    if (consumptiveRatio >= 0.70) {
      warning.push(`Pengeluaran konsumtif sangat tinggi: ${konsumtifPct}% dari total belanja (${fmt(konsumtifTotal)}). Terbesar: "${top.category}".`);
    } else if (consumptiveRatio >= 0.50) {
      warning.push(`Pengeluaran konsumtif tinggi: ${konsumtifPct}% (${fmt(konsumtifTotal)}). Terbesar di "${top.category}".`);
    } else if (consumptiveRatio >= 0.35) {
      warning.push(`Pengeluaran konsumtif cukup tinggi: ${konsumtifPct}%. Pertimbangkan untuk dikurangi.`);
    } else {
      insight.push(`Pengeluaran konsumtif terkendali: ${konsumtifPct}% (${fmt(konsumtifTotal)}). Terbesar: "${top.category}".`);
    }
  }

  // B2 — Transaction Frequency
  if (expenseCount > 50) {
    warning.push(`Frekuensi transaksi sangat tinggi: ${expenseCount} pengeluaran. Banyak transaksi kecil berulang dapat menggerus anggaran.`);
  } else if (expenseCount > 35) {
    warning.push(`Frekuensi transaksi cukup tinggi: ${expenseCount} pengeluaran. Perhatikan pola belanja Anda.`);
  } else if (expenseCount <= 10 && expense > 0) {
    insight.push(`Transaksi sangat terkontrol: hanya ${expenseCount} pengeluaran — pola belanja yang disiplin.`);
  }

  // B3 — Impulsive Spending
  if (impulsiveScore <= 2) {
    warning.push("Banyak transaksi kecil berulang terdeteksi — indikasi impulsive spending. Buat anggaran harian untuk kontrol lebih baik.");
  } else if (impulsiveScore >= 5) {
    insight.push("Hampir tidak ada transaksi kecil berulang. Pola belanja Anda sangat terkontrol.");
  }

  // Produktif
  const produktifTotal = kategori.produktif.reduce((s, k) => s + k.total, 0);
  if (produktifTotal > 0) {
    const produktifPct = Math.round((produktifTotal / expense) * 100);
    insight.push(`Pengeluaran produktif (investasi/tabungan/pendidikan): ${fmt(produktifTotal)} — ${produktifPct}% dari total. Bagus!`);
  } else if (income > 0 && expense > 0) {
    warning.push("Belum ada pengeluaran produktif (investasi/tabungan/pendidikan). Pertimbangkan mulai mengalokasikan dana ke sini.");
  }

  // S — Survey reminder
  if (!surveyTersedia) {
    insight.push("Komponen Subjektif (S) belum tersedia. Isi survey bulanan di Dashboard untuk skor OBS yang lengkap.");
  }

  return { insight, warning };
};

// ── ENTRY POINT ──────────────────────────────────────────────────
export const calculateSummary = (transactions, survey = null) => {
  let income = 0;
  let expense = 0;

  transactions.forEach((t) => {
    if (t.type === "income") income += Number(t.amount);
    else                      expense += Number(t.amount);
  });

  const balance      = income - expense;
  const expenseRatio = income > 0 ? expense / income : 0;
  const savingRatio  = income > 0 ? balance / income : 0;
  const expenseCount = transactions.filter((t) => t.type === "expense").length;

  const kategori = groupByCategory(transactions, expense, income);

  const konsumtifTotal   = kategori.konsumtif.reduce((s, k) => s + k.total, 0);
  const consumptiveRatio = expense > 0 ? konsumtifTotal / expense : 0;

  const debtTotal = kategori.kebutuhan
    .filter((k) => isDebtCategory(k.category))
    .reduce((s, k) => s + k.total, 0);
  const debtRatio = income > 0 ? debtTotal / income : 0;

  const noData = income === 0 && expense === 0;

  const { total: skorKesehatan, surveyTersedia, dimensi } = noData
    ? {
        total: 0,
        surveyTersedia: false,
        dimensi: {
          objective:  { savingRatio: 0, expenseRatio: 0, cashFlow: 0, debtRatio: 0 },
          behavioral: { consumptiveRatio: 0, transactionFrequency: 0, impulsiveSpending: 0, budgetDiscipline: 0 },
          subjective: { satisfaction: null, security: null, confidence: null },
        },
      }
    : hitungSkorOBS({
        savingRatio, expenseRatio, balance, income,
        debtRatio, consumptiveRatio, expenseCount,
        transactions, survey,
      });

  const { insight, warning } = generateInsightWarning({
    income, expense, balance,
    savingRatio, expenseRatio, consumptiveRatio, debtRatio,
    expenseCount,
    impulsiveScore: dimensi.behavioral.impulsiveSpending,
    kategori, surveyTersedia,
  });

  return {
    totalPendapatan: income,
    totalPengeluaran: expense,
    saldoAkhir: balance,

    rasio: {
      pengeluaran: Math.round(expenseRatio * 100),
      tabungan:    Math.round(savingRatio * 100),
      konsumtif:   Math.round(consumptiveRatio * 100),
      hutang:      Math.round(debtRatio * 100),
    },

    skorKesehatan,
    surveyTersedia,
    dimensiSkor: dimensi,

    kategori,
    insight,
    warning,
  };
};
