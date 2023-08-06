import { HTTPException } from "@/errors";
import { ErrorRequestHandler } from "express";

export const globalErrorHandler: ErrorRequestHandler = (err, _, res) => {
  if (err) {
    if (err instanceof HTTPException) {
      return res.status(err.status).json({ message: err.message });
    } else if (err instanceof Error) {
      return res.status(500).json({ message: err.message });
    }
  }

  return res.status(500).json({ message: "Internal Server Error" });
};
