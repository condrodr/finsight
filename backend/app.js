import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes/index.js";

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());

app.use("/api", routes);

app.get("/", (req, res) => {
  res.json({
    message: "FinSight Backend API berjalan"
  });
});

export default app;