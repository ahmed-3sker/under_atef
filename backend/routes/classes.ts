import { Router } from "express";
import Class from "../models/class";
import { authenticate, authorize } from "../middleware/auth";
import { validId, wrap } from "../utils/helpers";

const router = Router();
router.use(authenticate);

router.get("/", wrap(async (_req, res) => {
  const classes = await Class.find({ isActive: true }).sort({ grade: 1, letter: 1 });
  res.json({ classes });
}));

router.post("/", authorize("admin"), wrap(async (req, res) => {
  const grade = Number(req.body?.grade);
  const letter = String(req.body?.letter ?? "").toUpperCase();
  if (![10, 11, 12].includes(grade) || !/^[A-F]$/.test(letter)) {
    return res.status(400).json({ message: "grade must be 10-12 and letter A-F" });
  }
  try {
    const cls = await Class.create({ grade, letter: letter as "A", name: `${grade}${letter}` });
    res.status(201).json({ class: cls });
  } catch (err: any) {
    if (err.code === 11000) return res.status(409).json({ message: "Class already exists" });
    throw err;
  }
}));

router.delete("/:id", authorize("admin"), validId, wrap(async (req, res) => {
  const cls = await Class.findByIdAndUpdate(req.params.id, { isActive: false }, { returnDocument: "after" });
  if (!cls) return res.status(404).json({ message: "Class not found" });
  res.json({ class: cls });
}));

export default router;
