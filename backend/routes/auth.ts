import { Router } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user";
import { authenticate } from "../middleware/auth";

const router = Router();

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body ?? {};
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // passwordHash is select:false, so ask for it explicitly
    const user = await User.findOne({ email: String(email).toLowerCase() }).select("+passwordHash");

    // same message for "no user" and "wrong password"
    const invalid = () => res.status(401).json({ message: "Invalid email or password" });

    if (!user || !user.isActive) return invalid();
    if (!(await user.comparePassword(String(password)))) return invalid();

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET!, {
      expiresIn: "1d",
    });

    res.json({ token, user }); // toJSON strips passwordHash
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

router.get("/me", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user!.id);
    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

export default router;