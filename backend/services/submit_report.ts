import mongoose from "mongoose";
import Class from "../models/class";
import Report, { STATUSES, SESSIONS, type Status } from "../models/report";
import Student from "../models/student";
import { isValidDate, today } from "../utils/helpers";

export type IncomingRecord = { studentId: string; status: Status };

const fail = (message: string, status = 400) =>
  Object.assign(new Error(message), { status });

export async function submitReport(input: {
  classId: string;
  date: string;
  session: number;
  records: IncomingRecord[];
  userId: string;
}) {
  const { classId, date, session, records, userId } = input;

  if (!mongoose.isValidObjectId(classId)) throw fail("Invalid class id");
  if (!isValidDate(date)) throw fail("date must be YYYY-MM-DD");
  if (date > today()) throw fail("Can't record attendance for a future date");
  if (!(SESSIONS as readonly number[]).includes(session)) throw fail("session must be 1 to 5");
  if (!Array.isArray(records) || records.length === 0) throw fail("No records provided");
  if (records.some((r) => !(STATUSES as readonly string[]).includes(r.status))) {
    throw fail("Invalid status in records");
  }
  const ids = records.map((r) => r.studentId);
  if (ids.some((id) => !mongoose.isValidObjectId(id))) throw fail("Invalid student id");
  if (new Set(ids).size !== ids.length) throw fail("Duplicate students in records");

  const cls = await Class.findById(classId);
  if (!cls || !cls.isActive) throw fail("Class not found", 404);

  const students = await Student.find({ _id: { $in: ids }, class: classId, isActive: true });
  if (students.length !== ids.length) throw fail("Some students don't belong to this class");
  const byId = new Map(students.map((s) => [s.id as string, s]));

  const summary = { total: records.length, present: 0, absent: 0, excused: 0 };
  for (const r of records) summary[r.status]++;

  const filter: Record<string, unknown> = { class: classId, date, session };
  return Report.findOneAndUpdate(
    filter,
    {
      class: classId,
      className: cls.name,
      date,
      session,
      summary,
      submittedBy: userId,
      records: records.map((r) => {
        const s = byId.get(r.studentId)!;
        return { student: s._id, studentName: s.name, studentCode: s.studentId, status: r.status };
      }),
    },
    { upsert: true, returnDocument: "after", runValidators: true },
  );
}
