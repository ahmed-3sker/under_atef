import { Router } from "express";
import Class from "../models/class";
import Student from "../models/student";
import { authenticate, authorize } from "../middleware/auth";
import { pick, validId, wrap } from "../utils/helpers";

const router = Router();
router.use(authenticate);

// any logged-in user can read (teachers need the roster to take attendance)
router.get("/", wrap(async (req, res) => {
  const filter: Record<string, unknown> = { isActive: true };
  if (req.query.class) filter.class = req.query.class;
  const students = await Student.find(filter).sort("studentId").populate("class", "name");
  res.json({ students });
}));

router.get("/:id", validId, wrap(async (req, res) => {
  const student = await Student.findById(req.params.id).populate("class", "name");
  if (!student) return res.status(404).json({ message: "Student not found" });
  res.json({ student });
}));

router.post("/", authorize("admin"), wrap(async (req, res) => {
  const { name, studentId, classId } = req.body ?? {};
  if (!name || !studentId || !classId) {
    return res.status(400).json({ message: "name, studentId and classId are required" });
  }
  if (!(await Class.exists({ _id: classId }))) {
    return res.status(404).json({ message: "Class not found" });
  }
  try {
    const student = await Student.create({
      ...pick(req.body, ["name", "studentId", "guardianName", "guardianPhone", "guardianEmail"]),
      class: classId,
    });
    res.status(201).json({ student });
  } catch (err: any) {
    if (err.code === 11000) return res.status(409).json({ message: "Student ID already exists" });
    throw err;
  }
}));

// bulk add: { classId, students: [{ name, studentId }] }
router.post("/bulk", authorize("admin"), wrap(async (req, res) => {
  const { classId, students } = req.body ?? {};
  if (!classId || !Array.isArray(students) || students.length === 0) {
    return res.status(400).json({ message: "classId and a non-empty students array are required" });
  }
  if (!(await Class.exists({ _id: classId }))) {
    return res.status(404).json({ message: "Class not found" });
  }
  const docs = students
    .filter((s: any) => s?.name && s?.studentId)
    .map((s: any) => ({ name: s.name, studentId: String(s.studentId), class: classId }));
  try {
    const created = await Student.insertMany(docs, { ordered: false });
    res.status(201).json({ created: created.length });
  } catch (err: any) {
    // ordered:false keeps inserting after duplicates, so report what landed
    if (err.code === 11000 || err.writeErrors) {
      return res.status(207).json({
        created: err.insertedDocs?.length ?? 0,
        message: "Some students were skipped (duplicate studentId)",
      });
    }
    throw err;
  }
}));

router.patch("/:id", authorize("admin"), validId, wrap(async (req, res) => {
  const update = pick(req.body, [
    "name", "studentId", "guardianName", "guardianPhone", "guardianEmail", "isActive",
  ]) as Record<string, unknown>;
  if (req.body?.classId) update.class = req.body.classId;
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, update, {
      returnDocument: "after",
      runValidators: true,
    });
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json({ student });
  } catch (err: any) {
    if (err.code === 11000) return res.status(409).json({ message: "Student ID already exists" });
    throw err;
  }
}));

// "delete" = deactivate, so old reports still point to a real student
router.delete("/:id", authorize("admin"), validId, wrap(async (req, res) => {
  const student = await Student.findByIdAndUpdate(req.params.id, { isActive: false }, { returnDocument: "after" });
  if (!student) return res.status(404).json({ message: "Student not found" });
  res.json({ student });
}));

export default router;
