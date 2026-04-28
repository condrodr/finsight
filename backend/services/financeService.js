import { classifyCategory, groupByCategory } from "./categoryClassifier.js";

/* ─────────────────────────────────────────
   FORMAT RUPIAH (untuk teks insight)
───────────────────────────────────────── */
const fmt = (n) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);

/* ─────────────────────────────────────────
   HITUNG SKOR MULTI-DIMENSI
   Total maks: 100 poin

   Saving Score    (0–40) → seberapa besar saving ratio
   CashFlow Score  (0–30) → apakah balance positif
   Consumptive Score(0–30)→ seberapa kecil rasio konsumtif
───────────────────────────────────────── */
const hitungSkorKesehatan = ({ savingRatio, balance, consumptiveRatio }) => {
  // 1. Saving Score
  let savingScore;
  if (savingRatio >= 0.3)      savingScore = 40;
  else if (savingRatio >= 0.2) savingScore = 30;
  else if (savingRatio >= 0.1) savingScore = 20;
  else if (savingRatio >= 0)   savingScore = 10;
  else                          savingScore = 0;

  // 2. Cash Flow Score
  let cfScore;
  if (balance > 0)      cfScore = 30;
  else if (balance === 0) cfScore = 10;
  else                  cfScore = 0;

  // 3. Consumptive Score
  let consumptiveScore;
  if (consumptiveRatio < 0.3)      consumptiveScore = 30;
  else if (consumptiveRatio < 0.5) consumptiveScore = 20;
  else if (consumptiveRatio < 0.7) consumptiveScore = 10;
  else                              consumptiveScore = 0;

  return {
    total: savingScore + cfScore + consumptiveScore,
    dimensi: { savingScore, cfScore, consumptiveScore },
  };
};

/* ─────────────────────────────────────────
   GENERATE INSIGHT & WARNING
   Berbasis data kategori nyata dari DB
───────────────────────────────────────── */
const generateInsightWarning = ({
  income, expense, balance,
  savingRatio, expenseRatio, consumptiveRatio,
  kategori,
}) => {
  const insight = [];
  const warning = [];

  if (income === 0) {
    warning.push("Belum ada data pendapatan. Mulai catat transaksi pemasukan Anda.");
    return { insight, warning };
  }

  // ── CASH FLOW ──
  if (balance > 0) {
    insight.push(`Cash flow positif. Anda berhasil menyisihkan ${fmt(balance)} dari pendapatan bulan ini.`);
  } else if (balance < 0) {
    warning.push(`Cash flow negatif. Pengeluaran melebihi pendapatan sebesar ${fmt(Math.abs(balance))}.`);
  }

  // ── SAVING RATIO ──
  const savingPct = Math.round(savingRatio * 100);
  if (savingRatio >= 0.3) {
    insight.push(`Saving ratio sangat baik: ${savingPct}%. Anda menyisihkan lebih dari 30% pendapatan.`);
  } else if (savingRatio >= 0.2) {
    insight.push(`Saving ratio baik: ${savingPct}%. Target ideal adalah 30% — Anda hampir mencapainya.`);
  } else if (savingRatio >= 0.1) {
    warning.push(`Saving ratio masih rendah: ${savingPct}%. Coba tingkatkan tabungan hingga minimal 20–30%.`);
  } else if (savingRatio >= 0 && balance >= 0) {
    warning.push(`Saving ratio sangat rendah: ${savingPct}%. Prioritaskan menyisihkan setidaknya 10% dari pendapatan.`);
  }

  // ── PERILAKU KONSUMTIF ──
  const konsumtifTotal = kategori.konsumtif.reduce((s, k) => s + k.total, 0);
  const konsumtifPct = Math.round(consumptiveRatio * 100);

  if (kategori.konsumtif.length > 0) {
    const top = kategori.konsumtif[0];
    if (consumptiveRatio >= 0.5) {
      warning.push(
        `Pengeluaran konsumtif sangat tinggi: ${konsumtifPct}% dari total pengeluaran (${fmt(konsumtifTotal)}). ` +
        `Kategori terbesar: "${top.category}" (${fmt(top.total)}).`
      );
    } else if (consumptiveRatio >= 0.3) {
      warning.push(
        `Pengeluaran konsumtif cukup tinggi: ${konsumtifPct}% (${fmt(konsumtifTotal)}). ` +
        `Terbesar di "${top.category}". Pertimbangkan untuk dikurangi.`
      );
    } else {
      insight.push(
        `Pengeluaran konsumtif terkendali: ${konsumtifPct}% (${fmt(konsumtifTotal)}). ` +
        `Pengeluaran konsumtif terbesar: "${top.category}".`
      );
    }
  }

  // ── PRODUKTIF ──
  const produktifTotal = kategori.produktif.reduce((s, k) => s + k.total, 0);
  if (produktifTotal > 0) {
    const produktifPct = Math.round((produktifTotal / expense) * 100);
    insight.push(
      `Pengeluaran produktif (investasi, tabungan, pendidikan): ${fmt(produktifTotal)} — ${produktifPct}% dari total pengeluaran. Bagus!`
    );
  } else if (income > 0 && expense > 0) {
    warning.push("Belum ada pengeluaran produktif (investasi/tabungan/pendidikan). Pertimbangkan untuk mulai mengalokasikan dana ke sini.");
  }

  // ── EXPENSE RATIO KESELURUHAN ──
  const expensePct = Math.round(expenseRatio * 100);
  if (expenseRatio > 0.9 && balance >= 0) {
    warning.push(`Rasio pengeluaran sangat tinggi: ${expensePct}% dari pendapatan. Hampir tidak ada ruang untuk saving.`);
  } else if (expenseRatio > 0.7 && expenseRatio <= 0.9) {
    warning.push(`Rasio pengeluaran ${expensePct}%. Coba tekan pengeluaran agar saving ratio bisa meningkat.`);
  }

  return { insight, warning };
};

/* ─────────────────────────────────────────
   ENTRY POINT UTAMA
───────────────────────────────────────── */
export const calculateSummary = (transactions) => {
  // 1. Hitung total income & expense
  let income = 0;
  let expense = 0;

  transactions.forEach((t) => {
    if (t.type === "income") income += Number(t.amount);
    else expense += Number(t.amount);
  });

  const balance = income - expense;

  // 2. Rasio-rasio dasar
  const expenseRatio    = income > 0 ? expense / income : 0;
  const savingRatio     = income > 0 ? balance / income : 0;

  // 3. Klasifikasi & grouping kategori dari data DB
  const kategori = groupByCategory(transactions, expense, income);

  // 4. Consumptive ratio (konsumtif / total expense)
  const konsumtifTotal  = kategori.konsumtif.reduce((s, k) => s + k.total, 0);
  const consumptiveRatio = expense > 0 ? konsumtifTotal / expense : 0;

  // 5. Skor kesehatan multi-dimensi
  const { total: skorKesehatan, dimensi } = hitungSkorKesehatan({
    savingRatio,
    balance,
    consumptiveRatio,
  });

  // 6. Insight & warning berbasis data nyata
  const { insight, warning } = generateInsightWarning({
    income, expense, balance,
    savingRatio, expenseRatio, consumptiveRatio,
    kategori,
  });

  return {
    // Ringkasan nominal
    totalPendapatan: income,
    totalPengeluaran: expense,
    saldoAkhir: balance,

    // Rasio (untuk tampilan detail)
    rasio: {
      pengeluaran: Math.round(expenseRatio * 100),   // %
      tabungan:    Math.round(savingRatio * 100),     // %
      konsumtif:   Math.round(consumptiveRatio * 100),// %
    },

    // Skor & breakdown dimensi
    skorKesehatan,
    dimensiSkor: {
      tabungan:   dimensi.savingScore,      // maks 40
      cashFlow:   dimensi.cfScore,          // maks 30
      konsumtif:  dimensi.consumptiveScore, // maks 30
    },

    // Breakdown kategori dari DB
    kategori,

    // Insight & warning
    insight,
    warning,
  };
};
