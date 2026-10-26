import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user";

export type Role = "admin" | "teacher" | "principal";

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; role: Role };
    }
  }
}

export async function authenticate(req: Request, res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    const payload = jwt.verify(header.split(" ")[1], process.env.JWT_SECRET!) as { id: string };

    // re-check the DB so deactivated users lose access immediately
    const user = await User.findById(payload.id);
    if (!user || !user.isActive) {
      return res.status(401).json({ message: "Account not found or disabled" });
    }
    req.user = { id: user.id, role: user.role as Role };
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired token" });
  }
}

export function authorize(...roles: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
}
