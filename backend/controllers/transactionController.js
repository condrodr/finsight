import {
  createTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
} from "../models/transactionModel.js";

const validateAmount = (raw) => {
  const n = Number(raw);
  if (!isFinite(n) || n <= 0) return null;
  return n;
};

export const addTransaction = async (req, res) => {
  try {
    const data = req.body;

    const amount = validateAmount(data.amount);
    if (!amount) return res.status(400).json({ error: "Nominal harus berupa angka positif." });

    if (parseInt(data.user_id) !== req.user.id) {
      return res.status(403).json({ error: "Akses ditolak." });
    }

    await createTransaction({ ...data, amount });
    res.json({ message: "Transaksi berhasil ditambahkan" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const listTransactions = async (req, res) => {
  try {
    const user_id = req.params.user_id;

    if (parseInt(user_id) !== req.user.id) {
      return res.status(403).json({ error: "Akses ditolak." });
    }

    const transactions = await getTransactions(user_id);
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const editTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const amount = validateAmount(data.amount);
    if (!amount) return res.status(400).json({ error: "Nominal harus berupa angka positif." });

    const result = await updateTransaction(id, req.user.id, { ...data, amount });
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Transaksi tidak ditemukan atau bukan milik Anda." });
    }
    res.json({ message: "Transaksi berhasil diperbarui" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const removeTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteTransaction(id, req.user.id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Transaksi tidak ditemukan atau bukan milik Anda." });
    }
    res.json({ message: "Transaksi berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
