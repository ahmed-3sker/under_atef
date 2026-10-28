import { Schema, model, type InferSchemaType } from "mongoose";

const STATUSES = ["present","absent","excused"]

const entrySchema = new Schema({
  date:{type:String,required:true,match:/^\d{2}-\d{2}-\d{4}$/},
  status:{type:String,enum:STATUSES,required : true},
},{_id:false})

const studentSchema = new Schema({
  name: { type: String, required: true, trim: true },
  studentId: { type: String, required: true, unique: true, trim: true },
  class: { type: "", ref: "Class", required: true, index: true },
  guardianName: { type: String, trim: true },
  guardianPhone: { type: String, trim: true },
  guardianEmail: { type: String, lowercase: true, trim: true },
  attendance:[entrySchema],
  isActive:{type:Boolean,default:true}
},{timestamps:true});

export type StudentType = InferSchemaType<typeof studentSchema>;

export default model("Student", studentSchema);
