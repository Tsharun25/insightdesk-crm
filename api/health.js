import { ensureDatabase } from "./_utils.js";

export default async function handler(req, res) {
  const dbReady = await ensureDatabase(res);

  if (!dbReady) {
    return;
  }

  res.status(200).json({
    status: "ok",
    service: "InsightDesk CRM API",
    database: "mongodb",
  });
}
