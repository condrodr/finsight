import db from "../config/db.js";

export const checkSurvey = async (req, res) => {
  try {
    const { user_id, year, month } = req.params;
    const [rows] = await db.execute(
      "SELECT id FROM subjective_surveys WHERE user_id = ? AND period_year = ? AND period_month = ?",
      [user_id, year, month]
    );
    res.json({ exists: rows.length > 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const submitSurvey = async (req, res) => {
  try {
    const {
      user_id, period_year, period_month,
      financial_satisfaction, financial_security, financial_confidence, note,
    } = req.body;

    await db.execute(
      `INSERT INTO subjective_surveys
        (user_id, period_year, period_month, financial_satisfaction, financial_security, financial_confidence, note)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
        financial_satisfaction = VALUES(financial_satisfaction),
        financial_security = VALUES(financial_security),
        financial_confidence = VALUES(financial_confidence),
        note = VALUES(note)`,
      [user_id, period_year, period_month, financial_satisfaction, financial_security, financial_confidence, note || null]
    );

    res.json({ message: "Survey berhasil disimpan" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
