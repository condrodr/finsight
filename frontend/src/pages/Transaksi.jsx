import { useState, useEffect } from "react";
import { Plus, ArrowUpCircle, ArrowDownCircle, X } from "lucide-react";
import Sidebar from "../components/Sidebar.jsx";
import API from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import styles from "../styles/pages/Transaksi.module.css";

const formatRupiah = (angka) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(angka);

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const emptyForm = {
  type: "income",
  amount: "",
  category: "",
  subcategory: "",
  date: new Date().toISOString().split("T")[0],
  note: "",
};

function Transaksi() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const [kategoriList, setKategoriList] = useState([]);
  const [subkategoriList, setSubkategoriList] = useState([]);
  const [kategoriId, setKategoriId] = useState("");
  const [loadingKategori, setLoadingKategori] = useState(false);
  const [loadingSub, setLoadingSub] = useState(false);

  const fetchTransactions = () => {
    setLoading(true);
    API.get(`/transactions/${user.id}`)
      .then((res) => setTransactions(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Ambil kategori dari DB setiap kali tipe berubah atau form dibuka
  useEffect(() => {
    if (!showForm) return;
    setLoadingKategori(true);
    setKategoriList([]);
    setSubkategoriList([]);
    setKategoriId("");
    setForm((prev) => ({ ...prev, category: "", subcategory: "" }));
    API.get(`/categories?type=${form.type}`)
      .then((res) => setKategoriList(res.data))
      .catch(console.error)
      .finally(() => setLoadingKategori(false));
  }, [form.type, showForm]);

  // Ambil subkategori dari DB saat kategori dipilih
  useEffect(() => {
    if (!kategoriId) {
      setSubkategoriList([]);
      return;
    }
    setLoadingSub(true);
    API.get(`/categories/${kategoriId}/sub`)
      .then((res) => setSubkategoriList(res.data))
      .catch(console.error)
      .finally(() => setLoadingSub(false));
  }, [kategoriId]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleKategoriChange = (e) => {
    const id = e.target.value;
    const selected = kategoriList.find((k) => String(k.id_kategori) === id);
    setKategoriId(id);
    setForm((prev) => ({
      ...prev,
      category: selected?.nama_kategori || "",
      subcategory: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await API.post("/transactions/add", {
        ...form,
        user_id: user.id,
        amount: Number(form.amount),
      });
      setForm(emptyForm);
      setKategoriId("");
      setSubkategoriList([]);
      setShowForm(false);
      fetchTransactions();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const closeForm = () => {
    setShowForm(false);
    setForm(emptyForm);
    setKategoriId("");
    setSubkategoriList([]);
  };

  return (
    <div className={styles.page}>
      <Sidebar />

      <main className={styles.main}>
        <div className={styles.topBar}>
          <div>
            <p className={styles.label}>Pencatatan</p>
            <h1 className={styles.title}>Transaksi</h1>
            <p className={styles.subtitle}>Catat pemasukan dan pengeluaran Anda.</p>
          </div>
          <button onClick={() => setShowForm(true)} className={styles.addBtn}>
            <Plus size={18} />
            Tambah
          </button>
        </div>

        {showForm && (
          <div className={styles.formPanel}>
            <div className={styles.formHeader}>
              <h2 className={styles.formTitle}>Transaksi Baru</h2>
              <button onClick={closeForm} className={styles.closeBtn}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className={styles.formGrid}>
              {/* Tipe */}
              <div>
                <label className={styles.fieldLabel}>Tipe</label>
                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  className={styles.input}
                >
                  <option value="income">Pemasukan</option>
                  <option value="expense">Pengeluaran</option>
                </select>
              </div>

              {/* Jumlah */}
              <div>
                <label className={styles.fieldLabel}>Jumlah (Rp)</label>
                <input
                  type="number"
                  name="amount"
                  value={form.amount}
                  onChange={handleChange}
                  placeholder="0"
                  required
                  min="1"
                  className={styles.input}
                />
              </div>

              {/* Kategori */}
              <div>
                <label className={styles.fieldLabel}>Kategori</label>
                <select
                  value={kategoriId}
                  onChange={handleKategoriChange}
                  required
                  className={styles.input}
                  disabled={loadingKategori}
                >
                  <option value="">
                    {loadingKategori ? "Memuat..." : "— Pilih Kategori —"}
                  </option>
                  {kategoriList.map((k) => (
                    <option key={k.id_kategori} value={k.id_kategori}>
                      {k.nama_kategori}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subkategori — tampil jika ada */}
              <div>
                <label className={styles.fieldLabel}>
                  Subkategori
                  {subkategoriList.length === 0 && kategoriId && !loadingSub && (
                    <span className={styles.optionalTag}> (tidak ada)</span>
                  )}
                </label>
                <select
                  name="subcategory"
                  value={form.subcategory}
                  onChange={handleChange}
                  className={styles.input}
                  disabled={!kategoriId || loadingSub || subkategoriList.length === 0}
                >
                  <option value="">
                    {loadingSub
                      ? "Memuat..."
                      : subkategoriList.length === 0 && kategoriId
                      ? "Tidak ada subkategori"
                      : "— Pilih Subkategori —"}
                  </option>
                  {subkategoriList.map((s) => (
                    <option key={s.id_subkategori} value={s.nama_subkategori}>
                      {s.nama_subkategori}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tanggal */}
              <div>
                <label className={styles.fieldLabel}>Tanggal</label>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  required
                  className={styles.input}
                />
              </div>

              {/* Catatan */}
              <div>
                <label className={styles.fieldLabel}>Catatan (opsional)</label>
                <input
                  type="text"
                  name="note"
                  value={form.note}
                  onChange={handleChange}
                  placeholder="Keterangan tambahan..."
                  className={styles.input}
                />
              </div>

              <div className={styles.formActions}>
                <button type="button" onClick={closeForm} className={styles.cancelBtn}>
                  Batal
                </button>
                <button type="submit" disabled={submitting} className={styles.saveBtn}>
                  {submitting ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className={styles.tablePanel}>
          {loading ? (
            <div className={styles.loadingBox}>
              <div className={styles.spinner} />
              <p className={styles.loadingText}>Memuat transaksi...</p>
            </div>
          ) : transactions.length === 0 ? (
            <div className={styles.emptyBox}>
              <p className={styles.emptyTitle}>Belum ada transaksi</p>
              <p className={styles.emptySubtitle}>
                Klik &quot;Tambah&quot; untuk mencatat transaksi pertama Anda.
              </p>
            </div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>Tanggal</th>
                  <th className={styles.th}>Kategori</th>
                  <th className={styles.th}>Catatan</th>
                  <th className={styles.thRight}>Jumlah</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => (
                  <tr key={t.id} className={styles.tr}>
                    <td className={styles.tdDate}>{formatDate(t.date)}</td>
                    <td className={styles.tdCategory}>
                      <div className={styles.categoryCell}>
                        {t.type === "income" ? (
                          <ArrowUpCircle size={16} className={styles.iconIncome} />
                        ) : (
                          <ArrowDownCircle size={16} className={styles.iconExpense} />
                        )}
                        <div>
                          <span className={styles.categoryName}>{t.category}</span>
                          {t.subcategory && (
                            <span className={styles.subcategoryName}>{t.subcategory}</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className={styles.tdNote}>{t.description || "—"}</td>
                    <td
                      className={`${styles.tdAmount} ${
                        t.type === "income" ? styles.amountIncome : styles.amountExpense
                      }`}
                    >
                      {t.type === "income" ? "+" : "−"}
                      {formatRupiah(t.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}

export default Transaksi;
