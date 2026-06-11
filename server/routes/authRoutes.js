import bcrypt from "bcryptjs";
import { randomUUID } from "node:crypto";
import { Router } from "express";
import {
  createToken,
  loginUser,
  normalizeEmail,
  registerUser,
  safeUser,
} from "../services/authService.js";

const router = Router();
const memoryUsers = [];

function isDatabaseReady(req) {
  return Boolean(req.app.locals.dbReady);
}

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required." });
    }

    const normalizedEmail = normalizeEmail(email);

    if (!isDatabaseReady(req)) {
      const existingMemoryUser = memoryUsers.find(
        (user) => user.email === normalizedEmail,
      );

      if (existingMemoryUser) {
        return res.status(409).json({
          message: "An account with this email already exists in memory mode.",
        });
      }

      const passwordHash = await bcrypt.hash(password, 12);
      const user = {
        id: randomUUID(),
        name: name.trim(),
        email: normalizedEmail,
        passwordHash,
        role: "Sales Manager",
      };

      memoryUsers.push(user);

      return res.status(201).json({
        user: safeUser(user),
        token: createToken(user),
        mode: "memory",
      });
    }

    const data = await registerUser({ name, email, password });
    return res.status(201).json(data);
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const normalizedEmail = normalizeEmail(email);

    if (!isDatabaseReady(req)) {
      const user = memoryUsers.find((item) => item.email === normalizedEmail);

      if (!user) {
        return res.status(401).json({ message: "Invalid email or password." });
      }

      const passwordMatches = await bcrypt.compare(password, user.passwordHash);

      if (!passwordMatches) {
        return res.status(401).json({ message: "Invalid email or password." });
      }

      return res.json({
        user: safeUser(user),
        token: createToken(user),
        mode: "memory",
      });
    }

    const data = await loginUser({ email, password });
    return res.json(data);
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
});

export default router;
