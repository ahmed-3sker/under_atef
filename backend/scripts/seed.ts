// Usage: npm run seed            -> first admin + the 18 classes (10A..12F)
//        npm run seed -- --demo  -> also adds 24 demo students to class 10A
import "dotenv/config";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import Class from "../models/class";
import Student from "../models/student";
import User from "../models/user";

async function main() {
  const { MONGO_URI, SEED_ADMIN_EMAIL, SEED_ADMIN_PASSWORD } = process.env;
  if (!MONGO_URI || !SEED_ADMIN_EMAIL || !SEED_ADMIN_PASSWORD) {
    throw new Error("Set MONGO_URI, SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD in .env");
  }
  if (SEED_ADMIN_PASSWORD.length < 8) throw new Error("SEED_ADMIN_PASSWORD must be 8+ characters");

  await mongoose.connect(MONGO_URI);

  const email = SEED_ADMIN_EMAIL.toLowerCase();
  if (await User.exists({ email })) {
    console.log(`Admin ${email} already exists, skipping`);
  } else {
    await User.create({
      name: "Admin",
      email,
      role: "admin",
      passwordHash: await bcrypt.hash(SEED_ADMIN_PASSWORD, 12),
    });
    console.log(`Created admin ${email}`);
  }

  for (const grade of [10, 11, 12]) {
    for (const letter of ["A", "B", "C", "D", "E", "F"] as const) {
      await Class.updateOne(
        { name: `${grade}${letter}` },
        { $setOnInsert: { grade, letter, name: `${grade}${letter}` } },
        { upsert: true },
      );
    }
  }
  console.log("Classes ready (10A to 12F)");

  if (process.argv.includes("--demo")) {
    const cls = await Class.findOne({ name: "10A" });
    for (let i = 1; i <= 24; i++) {
      const n = String(i).padStart(2, "0");
      await Student.updateOne(
        { studentId: `10A-${n}` },
        { $setOnInsert: { name: `Student ${n}`, studentId: `10A-${n}`, class: cls!._id } },
        { upsert: true },
      );
    }
    console.log("Added 24 demo students to 10A");
  }

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
