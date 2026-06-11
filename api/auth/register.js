import { registerUser } from "../../server/services/authService.js";
import {
  allowPostOnly,
  ensureDatabase,
  readJsonBody,
  sendError,
} from "../_utils.js";

export default async function handler(req, res) {
  if (!allowPostOnly(req, res)) {
    return;
  }

  try {
    if (!(await ensureDatabase(res))) {
      return;
    }

    const body = await readJsonBody(req);
    const data = await registerUser(body);
    res.status(201).json(data);
  } catch (error) {
    sendError(res, error);
  }
}
