import { RequestHandler } from "express";

export const validateRouteParams: (
  validatorFn: (params: Record<string, any>) => {
    isValid: boolean;
    message?: string;
  }
) => RequestHandler = (validatorFn) => {
  return (req, res, next) => {
    const { isValid, message } = validatorFn(req.params);

    if (!isValid) {
      return res.status(400).json({ message: message ?? "Bad Request" });
    }

    return next();
  };
};
