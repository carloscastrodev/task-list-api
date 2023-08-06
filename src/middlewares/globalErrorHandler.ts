import { HTTPException } from "@/errors";
import { RequestHandler } from "express";

export const globalErrorHandler: RequestHandler = async (_, res, next) => {
  try {
    return next();
  } catch (err) {
    if (err instanceof HTTPException) {
      return res.status(err.status).json({ message: err.message });
    } else if (err instanceof Error) {
      return res.status(500).json({ message: err.message });
    }

    return res.status(500).json({ message: "Internal Server Error" });
  }
};
