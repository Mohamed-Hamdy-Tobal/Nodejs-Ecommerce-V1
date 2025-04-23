import { validationResult } from "express-validator";

export const validatorMiddleware = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      status: "fail",
      message: "Validation Error",
      errors: errors.array(),
    });
  }
  next();
};
