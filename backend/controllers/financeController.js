import { getTransactions } from "../models/transactionModel.js";
import { calculateSummary } from "../services/financeService.js";

export const getDashboard = async (req, res) => {
  try {
    const user_id = req.params.user_id;

    const transactions = await getTransactions(user_id);

    const summary = calculateSummary(transactions);

    res.json(summary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};