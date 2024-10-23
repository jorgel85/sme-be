import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

export const checkValidationErrors = (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new Error(errors.array()[0].msg);
  }
  return next();
};
