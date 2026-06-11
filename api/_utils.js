import dotenv from "dotenv";
import { resolve } from "node:path";
import { connectDB } from "../server/config/db.js";
import { verifyAuthToken } from "../server/services/authService.js";

dotenv.config({ path: resolve("server", ".env"), quiet: true });

export async function ensureDatabase(res) {
  const dbReady = await connectDB();

  if (!dbReady) {
    res.status(503).json({ message: "Database connection is unavailable." });
    return false;
  }

  return true;
}

export async function readJsonBody(req) {
  if (req.body && typeof req.body === "object") {
    return req.body;
  }

  if (typeof req.body === "string") {
    return JSON.parse(req.body || "{}");
  }

  const chunks = [];

  for await (const chunk of req) {
    chunks.push(chunk);
  }

  const rawBody = Buffer.concat(chunks).toString("utf8");
  return rawBody ? JSON.parse(rawBody) : {};
}

export function allowPostOnly(req, res) {
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return false;
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ message: "Method not allowed." });
    return false;
  }

  return true;
}

export function allowGetPostOnly(req, res) {
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return false;
  }

  if (!["GET", "POST"].includes(req.method)) {
    res.setHeader("Allow", "GET, POST");
    res.status(405).json({ message: "Method not allowed." });
    return false;
  }

  return true;
}

export function requireAuth(req, res) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length)
    : "";

  if (!token) {
    res.status(401).json({ message: "Authentication is required." });
    return false;
  }

  try {
    req.user = verifyAuthToken(token);
    return true;
  } catch {
    res.status(401).json({ message: "Invalid or expired session." });
    return false;
  }
}

export function sendError(res, error) {
  res.status(error.statusCode || 500).json({
    message: error.message || "Request failed.",
  });
}
