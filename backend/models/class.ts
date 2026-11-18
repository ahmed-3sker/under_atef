import { Schema, model, type InferSchemaType } from "mongoose";

const classSchema = new Schema({
  grade: { type: Number, enum: [10, 11, 12], required: true },
  letter: { type: String, enum: ["A", "B", "C", "D", "E", "F"], required: true, trim: true },
  name: { type: String, required: true, unique: true, trim: true },
  isActive: { type: Boolean, default: true },
});

classSchema.index({ grade: 1, letter: 1 }, { unique: true });

export type ClassType = InferSchemaType<typeof classSchema>;
export default model("Class", classSchema);
