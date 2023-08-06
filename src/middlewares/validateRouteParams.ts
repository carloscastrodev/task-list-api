import { BadRequestException } from "@/errors";
import { RequestHandler } from "express";

export const validateRouteParams: (
  validatorFn: (params: Record<string, any>) => {
    isValid: boolean;
    message?: string;
  }
) => RequestHandler = (validatorFn) => {
  return (req, _, next) => {
    const { isValid, message } = validatorFn(req.params);

    if (!isValid) {
      throw new BadRequestException(message);
    }

    return next();
  };
};
