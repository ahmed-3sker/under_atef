import dns from "node:dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);
import "dotenv/config";
import mongoose from "mongoose";
import cors from "cors";
import express, {
  type NextFunction,
  type Response,
  type Request,
} from "express";
import helmet from "helmet";
import morgan from "morgan";
import http from "http";
import authRoutes from "./routes/auth"

const app = express(); // Initialize app

app.use(helmet()); // Automatic Security Headers
app.use(cors({ origin: process.env.CLIENT_URL })); // Only accept localhost for now
app.use(express.json()); // Use json :P
app.use(morgan("dev")); //  Get live http requests 

// Check api updown status
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// Add auth routes for usage
app.use("/api/auth", authRoutes);

app.use("/api", (_req, res) =>
  res.status(404).json({ message: "Route Not Found" }),
);

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ message: "Uhhh smth broke idk" });
});

const server = http.createServer(app);

const start = async () => {
  await mongoose.connect(process.env.MONGO_URI ?? "");
  console.log("MONGO BATATIS CONNECTEDDDD");
  const port = Number(process.env.PORT) || 5000;
  server.listen(port, () => {
    console.log("SERVER RUNNNNING On Port : ", port);
  });
};

start().catch((err) => {
  console.error(`Failed to start server ${err}`);
  process.exit(1);
});
