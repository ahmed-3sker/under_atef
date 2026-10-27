import { Schema, model, type InferSchemaType } from "mongoose";

const recordSchema = new Schema(
  {
    student: { type: Schema.Types.ObjectId, ref: "Student", required: true },
    studentName: { type: String, required: true },
    status: {
      type: String,
      enum: ["present", "absent", "excused"],
      required: true,
    },
  },
  { _id: false },
);

const reportSchema = new Schema(
  {
    className: { type: String, required: true, trim: true },
    date: { type: String, required: true, match: /^\d{2}-\d{2}-\d{4}$/ },
    records: [recordSchema],
    summary: {
      total: Number,
      present: Number,
      absent: Number,
      excused: Number,
    },
  },
  { timestamps: true },
);

// one report per class per day
reportSchema.index({ className: 1, date: 1 }, { unique: true });
reportSchema.index({ date: 1 });

export type ReportType = InferSchemaType<typeof reportSchema>;
export default model("Report", reportSchema);
