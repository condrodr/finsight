import {
  createTransaction,
  getTransactions
} from "../models/transactionModel.js";

export const addTransaction = async (req, res) => {
  try {
    const data = req.body;

    await createTransaction(data);

    res.json({
      message: "Transaksi berhasil ditambahkan"
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const listTransactions = async (req, res) => {
  try {
    const user_id = req.params.user_id;

    const transactions = await getTransactions(user_id);

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};