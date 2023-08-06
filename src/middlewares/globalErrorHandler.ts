import { HTTPException } from "@/errors";
import { ErrorRequestHandler } from "express";

export const globalErrorHandler: ErrorRequestHandler = (err, _, res, next) => {
  if (err) {
    if (err instanceof HTTPException) {
      res.status(err.status).json({ message: err.message });
    } else if (err instanceof Error) {
      res.status(500).json({ message: err.message });
    }
  }

  res.status(500).json({ message: "Internal Server Error" });

  return next();
};
