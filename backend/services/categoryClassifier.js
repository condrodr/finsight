/**
 * Classifier dinamis berbasis keyword untuk kategori transaksi.
 * Kategori dibaca dari data yang user masukkan ke database,
 * lalu diklasifikasikan otomatis via pencocokan keyword.
 *
 * Tipe pengeluaran:
 *   - konsumtif  : bukan kebutuhan pokok, bisa dikurangi
 *   - kebutuhan  : kebutuhan primer / utilitas
 *   - produktif  : investasi, tabungan, pendidikan, asuransi
 *
 * Tipe pemasukan selalu → 'pendapatan'
 */

const KONSUMTIF = [
  // Makanan & minuman non-pokok
  "makan", "minum", "kopi", "cafe", "kafe", "resto", "restoran",
  "warung", "jajan", "jajanan", "snack", "camilan", "fastfood",
  "pizza", "burger", "boba", "bubble", "bakso", "mie", "nasi goreng",
  "sushi", "dinner", "lunch", "brunch",

  // Hiburan
  "hiburan", "nonton", "bioskop", "cinema", "konser", "event",
  "game", "gaming", "steam", "playstation", "xbox", "netflix",
  "spotify", "streaming", "youtube premium", "disney",

  // Fashion & penampilan
  "belanja", "shopping", "baju", "pakaian", "fashion", "sepatu",
  "tas", "dompet", "aksesoris", "jam tangan", "perhiasan",
  "kecantikan", "skincare", "makeup", "kosmetik", "salon",
  "spa", "perawatan", "manicure", "pedicure", "barbershop",

  // Rokok & sejenisnya
  "rokok", "vape", "tembakau", "cerutu",

  // Liburan & travel
  "liburan", "wisata", "hotel", "resort", "villa", "penginapan",
  "travel", "tiket", "airbnb", "booking", "pariwisata",

  // Gadget & elektronik non-produktif
  "gadget", "handphone", "hp baru", "laptop baru", "aksesoris hp",
  "headphone", "earphone", "airpods",

  // Lain konsumtif
  "hadiah", "kado", "souvenir", "donasi pribadi", "traktir",
];

const KEBUTUHAN = [
  // Pangan pokok
  "sembako", "bahan makanan", "groceries", "supermarket", "minimarket",
  "indomaret", "alfamart", "pasar", "sayur", "buah", "beras", "telur",
  "daging", "ikan", "susu", "dapur", "bumbu",

  // Transportasi
  "transportasi", "bensin", "bbm", "pertamax", "pertalite", "solar",
  "parkir", "tol", "busway", "transjakarta", "krl", "mrt", "lrt",
  "ojek", "gojek", "grab", "taxi", "angkot", "bus", "kereta",
  "servis motor", "servis mobil", "bengkel", "oli", "ban",

  // Kesehatan
  "kesehatan", "obat", "dokter", "klinik", "rumah sakit", "rs",
  "apotek", "farmasi", "vitamin", "suplemen", "medical",

  // Utilitas & tagihan
  "listrik", "pln", "air", "pdam", "gas", "elpiji",
  "internet", "wifi", "indihome", "firstmedia", "biznet",
  "pulsa", "paket data", "telepon", "hp", "kartu",

  // Tempat tinggal
  "sewa", "kontrak", "kost", "kos", "kontrakan", "apartemen",
  "cicilan", "kpr", "mortgage", "rumah", "renovasi",

  // Kebutuhan rumah
  "rumah tangga", "perabotan", "furnitur", "alat rumah",
  "kebersihan", "sabun", "deterjen", "tisu", "pembersih",

  // Pendidikan dasar
  "spp", "uang sekolah", "les", "bimbel",
];

const PRODUKTIF = [
  // Investasi
  "investasi", "saham", "reksa dana", "reksadana", "mutual fund",
  "obligasi", "sukuk", "sbn", "crypto", "bitcoin", "ethereum",
  "emas", "logam mulia", "antam", "deposito", "tabungan berjangka",
  "p2p", "crowdfunding", "properti investasi",

  // Tabungan
  "tabungan", "saving", "menabung", "dana darurat", "emergency fund",

  // Pendidikan tinggi & pengembangan diri
  "kuliah", "universitas", "kursus", "pelatihan", "training",
  "seminar", "workshop", "bootcamp", "sertifikasi", "buku",
  "langganan buku", "udemy", "coursera", "skill", "pendidikan",

  // Asuransi
  "asuransi", "premi", "bpjs", "jamsostek", "jkn",
  "asuransi jiwa", "asuransi kesehatan", "asuransi kendaraan",

  // Bisnis & modal
  "modal usaha", "modal bisnis", "stok", "inventory",
  "operasional bisnis", "peralatan kerja", "software bisnis",

  // Pengembangan karir
  "laptop kerja", "peralatan kerja", "coworking", "domain", "hosting",
];

const PENDAPATAN = [
  // Gaji & upah
  "gaji", "salary", "upah", "honor", "fee",

  // Bonus & tunjangan
  "bonus", "thr", "insentif", "komisi", "tunjangan",

  // Freelance & proyek
  "freelance", "proyek", "project", "jasa", "klien",

  // Hasil investasi
  "dividen", "dividen saham", "bunga", "return investasi",
  "hasil saham", "profit trading", "keuntungan investasi",

  // Bisnis
  "penjualan", "omset", "pendapatan bisnis", "hasil jualan",

  // Transfer & lain
  "transfer masuk", "pembayaran", "pelunasan piutang",
];

/**
 * Klasifikasikan satu kategori transaksi.
 * @param {string} category - nama kategori dari DB
 * @param {string} type - 'income' | 'expense'
 * @returns {'pendapatan'|'konsumtif'|'kebutuhan'|'produktif'}
 */
export const classifyCategory = (category, type) => {
  if (type === "income") return "pendapatan";

  const name = (category || "").toLowerCase().trim();
  if (!name) return "kebutuhan";

  if (KONSUMTIF.some((kw) => name.includes(kw))) return "konsumtif";
  if (PRODUKTIF.some((kw) => name.includes(kw))) return "produktif";
  if (KEBUTUHAN.some((kw) => name.includes(kw))) return "kebutuhan";

  // Default: anggap kebutuhan jika tidak cocok keyword manapun
  return "kebutuhan";
};

/**
 * Kelompokkan semua transaksi per kategori dengan total & tipenya.
 * @param {Array} transactions
 * @returns {Object} { konsumtif, kebutuhan, produktif, pendapatan }
 *   masing-masing array: [{ category, total, count, pct }]
 */
export const groupByCategory = (transactions, totalExpense, totalIncome) => {
  const map = {};

  transactions.forEach((t) => {
    const key = (t.category || "Lainnya").trim();
    const tipe = classifyCategory(key, t.type);
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
