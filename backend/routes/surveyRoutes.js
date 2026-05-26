import express from "express";
import { checkSurvey, getSurvey, getLatestSurvey, submitSurvey } from "../controllers/surveyController.js";

const router = express.Router();

router.get("/check/:user_id/:year/:month", checkSurvey);
router.get("/get/:user_id/:year/:month", getSurvey);
router.get("/latest/:user_id", getLatestSurvey);
router.post("/submit", submitSurvey);

export default router;
