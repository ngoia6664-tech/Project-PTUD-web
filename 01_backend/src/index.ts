import "dotenv/config";
import express from "express";
import { pool } from "./db/pool";

const app = express();
app.use(express.json());

app.get("/api/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false });
  }
});

const PORT = Number(process.env.PORT) || 4000;
app.listen(PORT, () => console.log(`Server chạy ở cổng ${PORT}`));
