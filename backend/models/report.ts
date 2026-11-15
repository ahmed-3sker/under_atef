import { Schema, model, type InferSchemaType } from "mongoose";

export const STATUSES = ["present", "absent", "excused"] as const;
export type Status = (typeof STATUSES)[number];
export const SESSIONS = [1, 2, 3, 4, 5] as const;

const recordSchema = new Schema(
  {
    student: { type: Schema.Types.ObjectId, ref: "Student", required: true },
    studentName: { type: String, required: true },
    studentCode: { type: String, required: true },
    status: { type: String, enum: STATUSES, required: true },
  },
  { _id: false },
);

const reportSchema = new Schema(
  {
    class: { type: Schema.Types.ObjectId, ref: "Class", required: true },
    className: { type: String, required: true, trim: true },
    date: { type: String, required: true, match: /^\d{4}-\d{2}-\d{2}$/ },
    session: { type: Number, enum: SESSIONS, required: true },
    records: [recordSchema],
    summary: {
      total: Number,
      present: Number,
      absent: Number,
      excused: Number,
    },
    submittedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);

// one report per class per day per session
reportSchema.index({ class: 1, date: 1, session: 1 }, { unique: true });
reportSchema.index({ date: 1 });
reportSchema.index({ "records.student": 1, date: 1 });

export type ReportType = InferSchemaType<typeof reportSchema>;
export default model("Report", reportSchema);
