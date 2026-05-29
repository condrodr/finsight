/**
 * Classifier berbasis kelompok_analisis dari tabel kategori di DB.
 * Tidak lagi menggunakan keyword matching — klasifikasi mengikuti
 * data yang sudah didefinisikan di tabel kategori.
 *
 * Mapping kelompok_analisis DB → kelompok output:
 *   pendapatan         → pendapatan
 *   kebutuhan          → kebutuhan
 *   kewajiban          → kebutuhan
 *   konsumtif          → konsumtif
 *   tabungan_investasi → produktif
 *   lainnya            → kebutuhan  (default)
 */

const DB_TO_GROUP = {
  pendapatan:         "pendapatan",
  kebutuhan:          "kebutuhan",
  kewajiban:          "kebutuhan",
  konsumtif:          "konsumtif",
  tabungan_investasi: "produktif",
  lainnya:            "kebutuhan",
};

/**
 * Petakan kelompok_analisis dari DB ke kelompok output classifier.
 * @param {string} kelompok_analisis - nilai dari kolom kelompok_analisis di tabel kategori
 * @returns {'pendapatan'|'konsumtif'|'kebutuhan'|'produktif'}
 */
export const classifyCategory = (kelompok_analisis) => {
  return DB_TO_GROUP[kelompok_analisis] ?? "kebutuhan";
};

/**
 * Kelompokkan semua transaksi per kategori dengan total & persentasenya.
 * Setiap transaksi harus memiliki field kelompok_analisis (dari JOIN ke tabel kategori).
 * @param {Array} transactions
 * @param {number} totalExpense
 * @param {number} totalIncome
 * @returns {{ konsumtif, kebutuhan, produktif, pendapatan }}
 */
export const groupByCategory = (transactions, totalExpense, totalIncome) => {
  const map = {};

  transactions.forEach((t) => {
    const key = (t.category || "Lainnya").trim();
    const tipe = classifyCategory(t.kelompok_analisis);
    const amount = Number(t.amount);

    if (!map[key]) {
      map[key] = { category: key, tipe, total: 0, count: 0 };
    }
    map[key].total += amount;
    map[key].count += 1;
  });

  const groups = { konsumtif: [], kebutuhan: [], produktif: [], pendapatan: [] };

  Object.values(map).forEach((item) => {
    const base = item.tipe === "pendapatan" ? totalIncome : totalExpense;
    const pct = base > 0 ? Math.round((item.total / base) * 100) : 0;
    groups[item.tipe].push({ ...item, pct });
  });

  // Urutkan tiap grup dari terbesar
  Object.keys(groups).forEach((g) => {
    groups[g].sort((a, b) => b.total - a.total);
  });

  return groups;
};
