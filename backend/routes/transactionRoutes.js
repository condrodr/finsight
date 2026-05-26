import express from "express";
import {
  addTransaction,
  listTransactions,
  editTransaction,
  removeTransaction,
} from "../controllers/transactionController.js";

const router = express.Router();

router.post("/add", addTransaction);
router.get("/:user_id", listTransactions);
router.put("/:id", editTransaction);
router.delete("/:id", removeTransaction);

export default router;
