import bcrypt from "bcryptjs";
import Project from "../models/Project.js";
import Task from "../models/Task.js";
import User from "../models/User.js";
import { getAdminEmail } from "../utils/seedAdmin.js";
import { isValidEmail } from "../utils/validation.js";

export const getUsers = async (req, res) => {
  const users = await User.find({ role: "member" }).select("-password").sort({ createdAt: -1 });
  res.json(users);
};

export const toggleMemberBlockStatus = async (req, res) => {
  const member = await User.findOne({ _id: req.params.id, role: "member" });

  if (!member) {
    return res.status(404).json({ message: "Member not found" });
  }

  member.isBlocked = !member.isBlocked;
  await member.save();

  res.json({
    message: member.isBlocked ? "Member blocked successfully" : "Member unblocked successfully",
    member: {
      _id: member._id,
      name: member.name,
      email: member.email,
      role: member.role,
      isBlocked: member.isBlocked,
      createdAt: member.createdAt,
    },
  });
};

export const deleteMember = async (req, res) => {
  const member = await User.findOne({ _id: req.params.id, role: "member" });

  if (!member) {
    return res.status(404).json({ message: "Member not found" });
  }

  await Promise.all([
    Task.deleteMany({ assignedTo: member._id }),
    Project.updateMany({ members: member._id }, { $pull: { members: member._id } }),
  ]);

  await member.deleteOne();

  res.json({ message: "Member deleted successfully" });
};

export const updateProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const { name, email, password } = req.body;
  const normalizedEmail = email?.trim().toLowerCase();

  if (normalizedEmail && !isValidEmail(normalizedEmail)) {
    return res.status(400).json({ message: "Please enter a valid email address" });
  }

  if (normalizedEmail && normalizedEmail !== user.email) {
    if (normalizedEmail === getAdminEmail() && user.role !== "admin") {
      return res.status(403).json({ message: "This email is reserved for admin access" });
    }

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }
    user.email = normalizedEmail;
  }

  user.name = name || user.name;

  if (password) {
    user.password = await bcrypt.hash(password, 10);
  }

  await user.save();

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    isBlocked: user.isBlocked,
  });
};
