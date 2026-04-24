import express from "express";
import {
  addTransaction,
  listTransactions
} from "../controllers/transactionController.js";

const router = express.Router();

router.post("/add", addTransaction);
router.get("/:user_id", listTransactions);

export default router;