import { BadRequestException } from "@/errors";
import { RequestHandler } from "express";

export const validateBody: (
  validatorFn: (body: any) => { isValid: boolean; message?: string }
) => RequestHandler = (validatorFn) => {
  return (req, _, next) => {
    const { isValid, message } = validatorFn(req.body);

    if (!isValid || !req.body) {
      throw new BadRequestException(message);
    }

    return next();
  };
};
