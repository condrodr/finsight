import db from "../config/db.js";

export const createTransaction = async (data) => {
  const query = `
    INSERT INTO transactions
    (user_id, type, amount, category, subcategory, date, description)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    data.user_id,
    data.type,
    data.amount,
    data.category,
    data.subcategory || null,
    data.date,
    data.note || null,
  ];

  const [result] = await db.execute(query, values);
  return result;
};

export const getTransactions = async (user_id) => {
  const [rows] = await db.execute(
    "SELECT * FROM transactions WHERE user_id = ? ORDER BY date DESC",
    [user_id]
  );
  return rows;
};