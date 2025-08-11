import { check } from "express-validator";
import { validatorMiddleware } from "../middleware/validatorMiddleware.js";
import UserModel from "../models/user.model.js";

export const registerValidation = [
  check("name")
    .notEmpty()
    .withMessage("User name is required")
    .isLength({ min: 3 })
    .withMessage("Too short name"),

  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .custom(async (val) => {
      const User = await UserModel.findOne({ email: val });
      if (User) {
        throw new Error("Email already exist");
      }
      return true;
    }),

  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Too short password"),
  check("confirmPassword")
    .notEmpty()
    .withMessage("Confirm password is required")
    .custom((val, { req }) => {
      if (val !== req.body.password) {
        throw new Error("Password confirmation does not match password");
      }
      return true;
    }),

  validatorMiddleware,
];

export const loginValidation = [
  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),

  check("password").notEmpty().withMessage("Password is required"),

  validatorMiddleware,
];
