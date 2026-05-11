import express from "express";
import { checkHealth } from "../controllers/healthController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import authRoutes from "./authRoutes.js";
import transactionRoutes from "./transactionRoutes.js";
import financeRoutes from "./financeRoutes.js";
import categoryRoutes from "./categoryRoutes.js";
import surveyRoutes from "./surveyRoutes.js";

const router = express.Router();

router.get("/health", checkHealth);
router.use("/auth", authRoutes);
router.use("/categories", verifyToken, categoryRoutes);
router.use("/transactions", verifyToken, transactionRoutes);
router.use("/finance", verifyToken, financeRoutes);
router.use("/survey", verifyToken, surveyRoutes);

export default router;
