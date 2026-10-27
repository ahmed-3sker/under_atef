// services/submit_report.ts
import Report from "../models/report";
import Student from "../models/student";

type Status = "present" | "absent" | "late" | "excused";

export async function submitReport(
  classId: string,
  date: string,
  userId: string,
  records: { studentId: string; status: Status; note?: string }[],
) {
    // Array of IDs only
    const ids = records.map((r) => r.studentId);

    const count = await Student.countDocuments({ _id: { $in: ids }, class: classId });
  if (count !== new Set(ids).size) {
    throw Object.assign(new Error("Some students don't belong to this class"), { status: 400 });
  }

  // Get summary of each status
  const summary = { total: records.length, present: 0, absent: 0, late: 0, excused: 0 };
  records.forEach((r) => summary[r.status]++);

  // Update Report
  const report = await Report.findOneAndUpdate(
    { class: classId, date },
    {
      class: classId,
      date,
      summary,
      submittedBy: userId,
      records: records.map((r) => ({ student: r.studentId, status: r.status, note: r.note ?? "" })),
    },
    { upsert: true, new: true },
  );

  // Update Student Report
  await Student.bulkWrite(
    records.flatMap((r) => [
      { updateOne: { filter: { _id: r.studentId }, update: { $pull: { attendance: { date } } } } },
      {
        updateOne: {
          filter: { _id: r.studentId },
          update: { $push: { attendance: { date, status: r.status, note: r.note ?? "", markedBy: userId } } },
        },
      },
    ]),
  );

  return report;
}