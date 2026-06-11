import { createDeal, listDeals } from "../../server/services/crmService.js";
import {
  allowGetPostOnly,
  ensureDatabase,
  readJsonBody,
  requireAuth,
  sendError,
} from "../_utils.js";

export default async function handler(req, res) {
  if (!allowGetPostOnly(req, res)) {
    return;
  }

  if (!requireAuth(req, res)) {
    return;
  }

  try {
    if (!(await ensureDatabase(res))) {
      return;
    }

    if (req.method === "GET") {
      res.status(200).json(await listDeals());
      return;
    }

    const body = await readJsonBody(req);
    res.status(201).json(await createDeal(body));
  } catch (error) {
    sendError(res, error);
  }
}
