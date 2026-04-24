import express from "express";
import { checkHealth } from "../controllers/healthController.js";
import transactionRoutes from "./transactionRoutes.js";
import financeRoutes from "./financeRoutes.js";

const router = express.Router();
router.get("/health", checkHealth);
router.use("/transactions", transactionRoutes);
router.use("/finance", financeRoutes);

export default router;