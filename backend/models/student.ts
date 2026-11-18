import { Schema, model, type InferSchemaType } from "mongoose";

// Attendance is NOT stored here. Reports are the single source of truth,
// and a student's history is read from them.
const studentSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    studentId: { type: String, required: true, unique: true, trim: true },
    class: { type: Schema.Types.ObjectId, ref: "Class", required: true, index: true },
    guardianName: { type: String, trim: true },
    guardianPhone: { type: String, trim: true },
    guardianEmail: { type: String, lowercase: true, trim: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export type StudentType = InferSchemaType<typeof studentSchema>;
export default model("Student", studentSchema);
