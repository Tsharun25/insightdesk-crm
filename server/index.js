import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config({ path: "./server/.env", quiet: true });

const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://127.0.0.1:5173",
    credentials: true,
  }),
);
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "InsightDesk CRM API",
    database: app.locals.dbReady ? "mongodb" : "memory",
  });
});

app.use("/api/auth", authRoutes);

connectDB()
  .then((dbReady) => {
    app.locals.dbReady = dbReady;
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
      console.log(
        dbReady
          ? "Auth mode: MongoDB"
          : "Auth mode: temporary memory store",
      );
    });
  })
  .catch((error) => {
    console.error("Server failed to start:", error.message);
    process.exit(1);
  });
