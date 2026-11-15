import type { RequestHandler } from "express";
import mongoose from "mongoose";
// import Class from "../models/class"

export const wrap = (func:RequestHandler):RequestHandler => (req,res,next)=>{
    Promise.resolve(func(req,res,next)).catch(next)
}

export const today = ()=>
    new Date().toLocaleDateString("en-GB",{timeZone:"Africa/Cairo"}).replace("/","-")

export const isValidDate = (d: unknown): d is string =>
  typeof d === "string" && /^\d{4}-\d{2}-\d{2}$/.test(d) && !isNaN(Date.parse(d));

export const validId: RequestHandler = (req, res, next) => {
  if (Object.values(req.params).some((v) => !mongoose.isValidObjectId(v))) {
    return res.status(400).json({ message: "Invalid id" });
  }
  next();
};

export const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const pick = (obj: any, keys: string[]) =>
  Object.fromEntries(keys.filter((k) => obj?.[k] !== undefined).map((k) => [k, obj[k]]));