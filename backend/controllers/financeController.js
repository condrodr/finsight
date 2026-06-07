// import db from "../config/db.js";
// import { getTransactions } from "../models/transactionModel.js";
// import { calculateSummary } from "../services/financeService.js";

// export const getDashboard = async (req, res) => {
//   try {
//     const user_id = req.params.user_id;
//     const { year, month } = req.query;

//     if (parseInt(user_id) !== req.user.id) {
//       return res.status(403).json({ error: "Akses ditolak." });
//     }

//     let transactions = await getTransactions(user_id);

//     // Filter by month/year jika diberikan
//     if (year && month) {
//       const targetYear = parseInt(year);
//       const targetMonth = parseInt(month);
//       transactions = transactions.filter((t) => {
//         const date = new Date(t.date);
//         return date.getFullYear() === targetYear && (date.getMonth() + 1) === targetMonth;
//       });
//     }

//     // Fetch survey berdasarkan month/year atau terbaru
//     let survey = null;
//     if (year && month) {
//       const [surveyRows] = await db.execute(
//         "SELECT * FROM subjective_surveys WHERE user_id = ? AND period_year = ? AND period_month = ?",
//         [user_id, year, month]
//       );
//       survey = surveyRows.length > 0 ? surveyRows[0] : null;
//     } else {
//       const [surveyRows] = await db.execute(
//         "SELECT * FROM subjective_surveys WHERE user_id = ? ORDER BY period_year DESC, period_month DESC LIMIT 1",
//         [user_id]
//       );
//       survey = surveyRows.length > 0 ? surveyRows[0] : null;
//     }

//     const summary = calculateSummary(transactions, survey);
//     res.json(summary);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
import db from "../config/db.js";
import { getTransactions } from "../models/transactionModel.js";
import { calculateSummary } from "../services/financeService.js";
import { saveFinancialHealthAnalysis } from "../models/financialHealthModel.js";


export const getDashboard = async (req, res) => {
 try {
   const user_id = req.params.user_id;
   const { year, month } = req.query;


   if (parseInt(user_id) !== req.user.id) {
     return res.status(403).json({ error: "Akses ditolak." });
   }


   let transactions = await getTransactions(user_id);


   // Filter by month/year jika diberikan
   if (year && month) {
     const targetYear = parseInt(year);
     const targetMonth = parseInt(month);
     transactions = transactions.filter((t) => {
       const date = new Date(t.date);
       return date.getFullYear() === targetYear && (date.getMonth() + 1) === targetMonth;
     });
   }


   // Fetch survey berdasarkan month/year atau terbaru
   let survey = null;
   if (year && month) {
     const [surveyRows] = await db.execute(
       "SELECT * FROM subjective_surveys WHERE user_id = ? AND period_year = ? AND period_month = ?",
       [user_id, year, month]
     );
     survey = surveyRows.length > 0 ? surveyRows[0] : null;
   } else {
     const [surveyRows] = await db.execute(
       "SELECT * FROM subjective_surveys WHERE user_id = ? ORDER BY period_year DESC, period_month DESC LIMIT 1",
       [user_id]
     );
     survey = surveyRows.length > 0 ? surveyRows[0] : null;
   }


   const summary = calculateSummary(transactions, survey);


   // hanya untuk analisis bulanan, karena tabel financial_health_results memakai unique key user_id + period_year + period_month.
   if (year && month) {
     const healthResultId = await saveFinancialHealthAnalysis({
       userId: parseInt(user_id),
       year: parseInt(year),
       month: parseInt(month),
       summary,
       survey,
     });
     summary.financialHealthResultId = healthResultId;
   }


   res.json(summary);
 } catch (error) {
   res.status(500).json({ error: error.message });
 }
};


