import { Router } from "express";
import mongoose from "mongoose";
import Report from "../models/report";
import { authenticate, authorize } from "../middleware/auth";
import { submitReport } from "../services/submit_report";
import { isValidDate, validId, wrap } from "../utils/helpers";

const router = Router();
router.use(authenticate);

router.post("/", authorize("teacher", "admin"), wrap(async (req, res) => {
  const { classId, date, session, records } = req.body ?? {};
  const report = await submitReport({
    classId, date, session: Number(session), records, userId: req.user!.id,
  });
  res.status(201).json({ report });
}));

router.get("/class/:id", validId, wrap(async (req, res) => {
  const { date } = req.query;
  const session = Number(req.query.session);
  if (!isValidDate(date) || !session) {
    return res.status(400).json({ message: "date (YYYY-MM-DD) and session are required" });
  }
  const filter: Record<string, unknown> = { class: req.params.id, date, session };
  const report = await Report.findOne(filter);
  res.json({ report }); // null when nothing is saved yet
}));

router.get("/", authorize("principal", "admin"), wrap(async (req, res) => {
  const { date } = req.query;
  if (!isValidDate(date)) return res.status(400).json({ message: "date must be YYYY-MM-DD" });
  const reports = await Report.find({ date }).sort({ className: 1, session: 1 });
  res.json({ reports });
}));

router.get("/dates", authorize("principal", "admin"), wrap(async (_req, res) => {
  const dates = await Report.distinct("date");
  res.json({ dates: dates.sort().reverse() });
}));

router.get("/student/:id", validId, wrap(async (req, res) => {
  const studentId = new mongoose.Types.ObjectId(String(req.params.id));
  const rows = await Report.find({ "records.student": studentId }, { date: 1, session: 1, records: 1 })
    .sort({ date: 1, session: 1 })
    .lean();

  const days = new Map<string, Record<number, string>>();
  for (const row of rows) {
    const status = row.records.find((r) => r.student.equals(studentId))?.status;
    if (!status) continue;
    if (!days.has(row.date)) days.set(row.date, {});
    days.get(row.date)![row.session] = status;
  }
  res.json({ days: Array.from(days, ([date, sessions]) => ({ date, sessions })) });
}));

export default router;
