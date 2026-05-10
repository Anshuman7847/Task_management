import bcrypt from "bcryptjs";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import { getAdminEmail } from "../utils/seedAdmin.js";
import { isValidEmail } from "../utils/validation.js";

const sanitizeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
});

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  const normalizedEmail = email?.trim().toLowerCase();

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email, and password are required" });
  }

  if (!isValidEmail(normalizedEmail)) {
    return res.status(400).json({ message: "Please enter a valid email address" });
  }

  if (normalizedEmail === getAdminEmail()) {
    return res.status(403).json({ message: "This email is reserved for admin access" });
  }

  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    return res.status(400).json({ message: "Email already registered" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email: normalizedEmail,
    password: hashedPassword,
    role: "member",
  });

  res.status(201).json({
    message: "Registration successful",
    user: sanitizeUser(user),
  });
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = email?.trim().toLowerCase();

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  if (!isValidEmail(normalizedEmail)) {
    return res.status(400).json({ message: "Please enter a valid email address" });
  }

  const user = await User.findOne({ email: normalizedEmail });
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  if (user.isBlocked) {
    return res.status(403).json({ message: "Your account has been blocked" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  res.json({
    message: "Login successful",
    token: generateToken(user._id),
    user: sanitizeUser(user),
  });
};

export const getCurrentUser = async (req, res) => {
  res.json({ user: req.user });
};
