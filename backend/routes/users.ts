import { Router } from "express";
import bcrypt from "bcryptjs";
import User from "../models/user";
import { authenticate, authorize } from "../middleware/auth";
import { validId, wrap } from "../utils/tools";

const router = Router();
const ROLES = ["admin", "staff", "teacher"];

router.use(authenticate, authorize("admin"));

router.get("/", wrap(async (req, res) => {
  const filter = req.query.role ? { role: req.query.role } : {};
  res.json({ users: await User.find(filter).sort("name") });
}));

router.post("/", wrap(async (req, res) => {
  const { name, email, password, role } = req.body ?? {};
  if (!name || !email || !ROLES.includes(role) || String(password ?? "").length < 8) {
    return res.status(400).json({ message: "name, email, role and a password of 8+ characters are required" });
  }
  try {
    const user = await User.create({
      name, email, role,
      passwordHash: await bcrypt.hash(String(password), 12),
    });
    res.status(201).json({ user });
  } catch (err: any) {
    if (err.code === 11000) return res.status(409).json({ message: "Email already in use" });
    throw err;
  }
}));

router.patch("/:id", validId, wrap(async (req, res) => {
  const { name, email, role, isActive, password } = req.body ?? {};
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  // stop an admin locking themselves out
  if (user.id === req.user!.id && (isActive === false || (role && role !== "admin"))) {
    return res.status(400).json({ message: "You can't deactivate or demote yourself" });
  }
  if (role && !ROLES.includes(role)) return res.status(400).json({ message: "Invalid role" });
  if (password && String(password).length < 8) {
    return res.status(400).json({ message: "Password must be 8+ characters" });
  }

  if (name) user.name = name;
  if (email) user.email = email;
  if (role) user.role = role;
  if (typeof isActive === "boolean") user.isActive = isActive;
  if (password) user.passwordHash = await bcrypt.hash(String(password), 12);

  try {
    await user.save();
  } catch (err: any) {
    if (err.code === 11000) return res.status(409).json({ message: "Email already in use" });
    throw err;
  }
  res.json({ user });
}));

// "delete" = deactivate, so old records still point to a real user
router.delete("/:id", validId, wrap(async (req, res) => {
  if (req.params.id === req.user!.id) {
    return res.status(400).json({ message: "You can't deactivate yourself" });
  }
  const user = await User.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({ user });
}));

export default router;