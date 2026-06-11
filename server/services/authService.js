import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

function normalizeEmail(email) {
  return email.toLowerCase().trim();
}

function getJwtSecret() {
  if (process.env.JWT_SECRET) {
    return process.env.JWT_SECRET;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("JWT_SECRET is required in production.");
  }

  return "dev-secret-change-me";
}

function createToken(user) {
  return jwt.sign(
    { id: user._id || user.id, email: user.email, role: user.role },
    getJwtSecret(),
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

export async function registerUser({ name, email, password }) {
  if (!name || !email || !password) {
    const error = new Error("Name, email, and password are required.");
    error.statusCode = 400;
    throw error;
  }

  const normalizedEmail = normalizeEmail(email);
  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    const error = new Error("An account with this email already exists.");
    error.statusCode = 409;
    throw error;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    passwordHash,
  });

  return {
    user: safeUser(user),
    token: createToken(user),
    mode: "mongodb",
  };
}

export async function loginUser({ email, password }) {
  if (!email || !password) {
    const error = new Error("Email and password are required.");
    error.statusCode = 400;
    throw error;
  }

  const normalizedEmail = normalizeEmail(email);
  const user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    const error = new Error("Invalid email or password.");
    error.statusCode = 401;
    throw error;
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);

  if (!passwordMatches) {
    const error = new Error("Invalid email or password.");
    error.statusCode = 401;
    throw error;
  }

  return {
    user: safeUser(user),
    token: createToken(user),
    mode: "mongodb",
  };
}

export function verifyAuthToken(token) {
  return jwt.verify(token, getJwtSecret());
}

export { createToken, normalizeEmail, safeUser };
