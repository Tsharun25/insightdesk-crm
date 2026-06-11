import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import crmRoutes from "./routes/crmRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, ".env"), quiet: true });

const app = express();
const port = process.env.PORT || 5000;
const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "http://127.0.0.1:5173",
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`CORS blocked for origin: ${origin}`));
    },
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
app.use("/api/crm", crmRoutes);

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
