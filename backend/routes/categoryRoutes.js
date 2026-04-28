import express from "express";
import { getKategori, getSubkategori } from "../controllers/categoryController.js";

const router = express.Router();

router.get("/", getKategori);
router.get("/:id/sub", getSubkategori);

export default router;
