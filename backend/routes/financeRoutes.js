import express from "express";
import { getDashboard } from "../controllers/financeController.js";

const router = express.Router();

router.get("/dashboard/:user_id", getDashboard);

export default router;