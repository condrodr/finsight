import app from "./app.js";
import db from "./config/db.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await db.query("SELECT 1");
    console.log("Database terhubung");
    app.listen(PORT, () => {
      console.log(`Server FinSight berjalan di http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Gagal koneksi database:", err.message);
    console.error("DB_HOST:", process.env.DB_HOST);
    console.error("DB_PORT:", process.env.DB_PORT);
    console.error("DB_NAME:", process.env.DB_NAME);
    process.exit(1);
  }
}

start();