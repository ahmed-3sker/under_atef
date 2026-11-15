import dns from "node:dns";
// Some networks can't resolve Atlas SRV records. Opt in with FORCE_PUBLIC_DNS=1.
if (process.env.FORCE_PUBLIC_DNS === "1") dns.setServers(["8.8.8.8", "1.1.1.1"]);
import "dotenv/config";
import mongoose from "mongoose";
import cors from "cors";
import express, { type NextFunction, type Response, type Request } from "express";
import helmet from "helmet";
import morgan from "morgan";
import http from "http";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/users";
import classRoutes from "./routes/classes";
import studentRoutes from "./routes/students";
import reportRoutes from "./routes/reports";

for (const key of ["MONGO_URI", "JWT_SECRET", "CLIENT_URL"]) {
  if (!process.env[key]) {
    console.error(`Missing env var ${key}. Copy .env.example to .env and fill it in.`);
    process.exit(1);
  }
}

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/reports", reportRoutes);

app.use("/api", (_req, res) => res.status(404).json({ message: "Route Not Found" }));

app.use((err: Error & { status?: number }, _req: Request, res: Response, _next: NextFunction) => {
  if (err.status) return res.status(err.status).json({ message: err.message });
  console.error(err);
  res.status(500).json({ message: "Something went wrong" });
});

const server = http.createServer(app);

const start = async () => {
  await mongoose.connect(process.env.MONGO_URI!);
  console.log("MongoDB connected");
  const port = Number(process.env.PORT) || 5000;
  server.listen(port, () => console.log("Server running on port", port));
};

start().catch((err) => {
  console.error(`Failed to start server ${err}`);
  process.exit(1);
});
