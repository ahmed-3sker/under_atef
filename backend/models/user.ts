import { Schema, model, type InferSchemaType } from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ["admin", "teacher", "principal"],
      required: true,
    },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    methods: {
      comparePassword(text: string) {
        return bcrypt.compare(text, this.passwordHash);
      },
    },
  },
);

userSchema.set("toJSON", {
  transform: (_doc, ret: Record<string, unknown>) => {
    delete ret.passwordHash;
    delete ret.__v;
    return ret;
  },
});

export type UserType = InferSchemaType<typeof userSchema>;
export default model("User", userSchema);