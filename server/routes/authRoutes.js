import bcrypt from "bcryptjs";
import { randomUUID } from "node:crypto";
import jwt from "jsonwebtoken";
import { Router } from "express";
import User from "../models/User.js";

const router = Router();
const memoryUsers = [];

function createToken(user) {
  return jwt.sign(
    { id: user._id || user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );
}

function safeUser(user) {
  return {
    id: user._id || user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

function isDatabaseReady(req) {
  return Boolean(req.app.locals.dbReady);
}

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required." });
    }

    if (!isDatabaseReady(req)) {
      const normalizedEmail = email.toLowerCase().trim();
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

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ message: "An account with this email already exists." });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, passwordHash });

    return res.status(201).json({
      user: safeUser(user),
      token: createToken(user),
      mode: "mongodb",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    if (!isDatabaseReady(req)) {
      const normalizedEmail = email.toLowerCase().trim();
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

    const user = await User.findOne({ email });

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
      mode: "mongodb",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export default router;
