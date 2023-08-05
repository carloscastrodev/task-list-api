import { RequestHandler } from "express";

export const validateBody: (
  validatorFn: (body: any) => { isValid: boolean; message?: string }
) => RequestHandler = (validatorFn) => {
  return (req, res, next) => {
    const { isValid, message } = validatorFn(req.body);

    if (!isValid || !req.body) {
      return res.status(400).json({ message: message ?? "Bad Request" });
    }

    return next();
  };
};
