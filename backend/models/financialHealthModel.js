import db from "../config/db.js";


const getHealthCategory = (score) => {
 if (score >= 80) return "Sangat Sehat";
 if (score >= 60) return "Sehat";
 if (score >= 40) return "Cukup";
 if (score >= 20) return "Berisiko";
 return "Tidak Sehat";
};


const avgSubjectiveScore = (survey) => {
 if (!survey) return null;


 const values = [
   survey.financial_satisfaction,
   survey.financial_security,
   survey.financial_confidence,
 ]
   .map((v) => Number(v))
   .filter((v) => Number.isFinite(v));


 if (values.length === 0) return null;
 return Math.round(values.reduce((sum, v) => sum + v, 0) / values.length);
};


export const saveFinancialHealthAnalysis = async ({ userId, year, month, summary, survey }) => {
 const connection = await db.getConnection();


 try {
   await connection.beginTransaction();


   const subjectiveScore = avgSubjectiveScore(survey);
   const objective = summary.dimensiSkor?.objective || {};
   const behavioral = summary.dimensiSkor?.behavioral || {};
   const totalIndicatorScore = summary.indicatorScore?.total || 0;
   const maxIndicatorScore = summary.indicatorScore?.max || 0;
   const kategori = summary.kategori || {};


   const [result] = await connection.execute(
     `INSERT INTO financial_health_results (
       user_id, period_year, period_month,
       total_income, total_expense, total_saving_investment, total_debt_payment, total_consumptive_expense,
       transaction_count, consumptive_transaction_count,
       saving_ratio, expense_ratio, cash_flow, debt_ratio, consumptive_ratio, transaction_frequency_ratio,
       saving_score, expense_score, cash_flow_score, debt_score, consumptive_score, frequency_score, budget_discipline_score, subjective_score,
       total_indicator_score, max_indicator_score, financial_health_score, health_category
     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       total_income = VALUES(total_income),
       total_expense = VALUES(total_expense),
       total_saving_investment = VALUES(total_saving_investment),
       total_debt_payment = VALUES(total_debt_payment),
       total_consumptive_expense = VALUES(total_consumptive_expense),
       transaction_count = VALUES(transaction_count),
       consumptive_transaction_count = VALUES(consumptive_transaction_count),
       saving_ratio = VALUES(saving_ratio),
       expense_ratio = VALUES(expense_ratio),
       cash_flow = VALUES(cash_flow),
       debt_ratio = VALUES(debt_ratio),
       consumptive_ratio = VALUES(consumptive_ratio),
       transaction_frequency_ratio = VALUES(transaction_frequency_ratio),
       saving_score = VALUES(saving_score),
       expense_score = VALUES(expense_score),
       cash_flow_score = VALUES(cash_flow_score),
       debt_score = VALUES(debt_score),
       consumptive_score = VALUES(consumptive_score),
       frequency_score = VALUES(frequency_score),
       budget_discipline_score = VALUES(budget_discipline_score),
       subjective_score = VALUES(subjective_score),
       total_indicator_score = VALUES(total_indicator_score),
       max_indicator_score = VALUES(max_indicator_score),
       financial_health_score = VALUES(financial_health_score),
       health_category = VALUES(health_category),
       updated_at = CURRENT_TIMESTAMP`,
     [
       userId,
       year,
       month,
       summary.totalPendapatan,
       summary.totalPengeluaran,
       kategori.totalProduktif || 0,
       kategori.totalHutang || 0,
       kategori.totalKonsumtif || 0,
       summary.transactionCount || 0,
       summary.consumptiveTransactionCount || 0,
       summary.rawRatio?.tabungan || 0,
       summary.rawRatio?.pengeluaran || 0,
       summary.saldoAkhir,
       summary.rawRatio?.hutang || 0,
       summary.rawRatio?.konsumtif || 0,
       summary.rawRatio?.frekuensiTransaksi || 0,
       objective.savingRatio || 1,
       objective.expenseRatio || 1,
       objective.cashFlow || 1,
       objective.debtRatio || 1,
       behavioral.consumptiveRatio || 1,
       behavioral.transactionFrequency || 1,
       behavioral.budgetDiscipline || 1,
       subjectiveScore,
       totalIndicatorScore,
       maxIndicatorScore,
       summary.skorKesehatan,
       getHealthCategory(summary.skorKesehatan),
     ]
   );


   let healthResultId = result.insertId;
   if (!healthResultId) {
     const [rows] = await connection.execute(
       `SELECT id FROM financial_health_results WHERE user_id = ? AND period_year = ? AND period_month = ? LIMIT 1`,
       [userId, year, month]
     );
     healthResultId = rows[0]?.id;
   }


   await connection.execute(`DELETE FROM insights WHERE financial_health_result_id = ?`, [healthResultId]);
   await connection.execute(`DELETE FROM warnings WHERE financial_health_result_id = ?`, [healthResultId]);
   await connection.execute(`DELETE FROM recommendations WHERE financial_health_result_id = ?`, [healthResultId]);


   for (const item of summary.insightRecords || []) {
     await connection.execute(
       `INSERT INTO insights (user_id, financial_health_result_id, insight_type, title, message, severity)
        VALUES (?, ?, ?, ?, ?, ?)`,
       [userId, healthResultId, item.insight_type, item.title, item.message, item.severity]
     );
   }


   for (const item of summary.warningRecords || []) {
     await connection.execute(
       `INSERT INTO warnings (user_id, financial_health_result_id, warning_code, title, message, trigger_value, threshold_value)
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
       [
         userId,
         healthResultId,
         item.warning_code,
         item.title,
         item.message,
         item.trigger_value ?? null,
         item.threshold_value ?? null,
       ]
     );
   }


   for (const item of summary.recommendationRecords || []) {
     await connection.execute(
       `INSERT INTO recommendations (user_id, financial_health_result_id, recommendation_type, title, message, priority)
        VALUES (?, ?, ?, ?, ?, ?)`,
       [userId, healthResultId, item.recommendation_type, item.title, item.message, item.priority]
     );
   }


   await connection.commit();
   return healthResultId;
 } catch (error) {
   await connection.rollback();
   throw error;
 } finally {
   connection.release();
 }
};



