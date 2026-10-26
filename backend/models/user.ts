import { Schema, model, type InferSchemaType } from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "teacher", "principal"],
    },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    methods: {
      comparePassword: (text: string) => {
        return bcrypt.compare(text, this?.passwordHash); // Js ignore the never type :sob:
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
