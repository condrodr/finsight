import db from "../config/db.js";

export const createTransaction = async (data) => {
  const [result] = await db.execute(
    `INSERT INTO transactions (user_id, type, id_kategori, id_subkategori, category, subcategory, amount, description, date)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [data.user_id, data.type, data.id_kategori, data.id_subkategori || null, data.category, data.subcategory || null, data.amount, data.note || null, data.date]
  );
  return result;
};

export const getTransactions = async (user_id) => {
  const [rows] = await db.execute(
    `SELECT t.*, k.kelompok_analisis
     FROM transactions t
     LEFT JOIN kategori k ON t.id_kategori = k.id_kategori
     WHERE t.user_id = ?
     ORDER BY t.date DESC`,
    [user_id]
  );
  return rows;
};

export const updateTransaction = async (id, user_id, data) => {
  const [result] = await db.execute(
    `UPDATE transactions SET type=?, id_kategori=?, id_subkategori=?, category=?, subcategory=?, amount=?, description=?, date=?
     WHERE id=? AND user_id=?`,
    [data.type, data.id_kategori, data.id_subkategori || null, data.category, data.subcategory || null, data.amount, data.note || null, data.date, id, user_id]
  );
  return result;
};

export const deleteTransaction = async (id, user_id) => {
  const [result] = await db.execute(
    "DELETE FROM transactions WHERE id = ? AND user_id = ?",
    [id, user_id]
  );
  return result;
};
