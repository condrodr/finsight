import express from "express";
import { checkSurvey, submitSurvey } from "../controllers/surveyController.js";

const router = express.Router();

router.get("/check/:user_id/:year/:month", checkSurvey);
router.post("/submit", submitSurvey);

export default router;
