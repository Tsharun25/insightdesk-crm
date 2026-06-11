import { loginUser } from "../../server/services/authService.js";
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
    const data = await loginUser(body);
    res.status(200).json(data);
  } catch (error) {
    sendError(res, error);
  }
}
