import { verifyAuthToken } from "../services/authService.js";

export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length)
    : "";

  if (!token) {
    res.status(401).json({ message: "Authentication is required." });
    return;
  }

  try {
    req.user = verifyAuthToken(token);
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired session." });
  }
}
