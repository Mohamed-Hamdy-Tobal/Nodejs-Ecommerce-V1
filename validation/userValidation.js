import { check } from "express-validator";
import { validatorMiddleware } from "../middleware/validatorMiddleware.js";
import UserModel from "../models/user.model.js";

export const getUserValidation = [
  check("id").isMongoId().withMessage("Invalid user ID format"),
  validatorMiddleware,
];

export const createUserValidation = [
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

  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Phone not valid")
    .custom(async (val) => {
      const User = await UserModel.findOne({ phone: val });
      if (User) {
        throw new Error("Phone already exist");
      }
      return true;
    }),

  check("profileImg").optional().isString().withMessage("Profile image must be a string"),
  check("role")
    .optional()
    .isIn(["user", "admin"])
    .withMessage("Role must be either 'user' or 'admin'"),
  check("active").optional().isBoolean().withMessage("Active must be a boolean"),
  check("wishlist").optional().isArray().withMessage("Wishlist must be an array of product IDs"),
  check("address").optional().isString().withMessage("Address must be a string"),

  validatorMiddleware,
];

export const updateUserValidation = [
  check("id").isMongoId().withMessage("Invalid user ID format"),

  check("name")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Too short name")
    .isLength({ max: 32 })
    .withMessage("Too long name"),

  check("email")
    .optional()
    .isEmail()
    .withMessage("Invalid email format")
    .custom(async (val, { req }) => {
      const User = await UserModel.findOne({ email: val });
      if (User && User._id.toString() !== req.params.id) {
        throw new Error("Email already exist");
      }
      return true;
    }),

  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Phone not valid")
    .custom(async (val, { req }) => {
      const User = await UserModel.findOne({ phone: val });
      if (User && User._id.toString() !== req.params.id) {
        throw new Error("Phone already exist");
      }
      return true;
    }),

  check("password").optional().isLength({ min: 6 }).withMessage("Too short password"),
  check("profileImg").optional().isString().withMessage("Profile image must be a string"),
  check("role")
    .optional()
    .isIn(["user", "admin"])
    .withMessage("Role must be either 'user' or 'admin'"),
  check("active").optional().isBoolean().withMessage("Active must be a boolean"),
  check("wishlist").optional().isArray().withMessage("Wishlist must be an array of product IDs"),
  check("address").optional().isString().withMessage("Address must be a string"),

  validatorMiddleware,
];

export const deleteUserValidation = [
  check("id").isMongoId().withMessage("Invalid user ID format"),
  validatorMiddleware,
];

export const changeUserPasswordValidation = [
  check("id").isMongoId().withMessage("Invalid user ID format"),

  check("currentPassword").notEmpty().withMessage("Current password is required"),

  check("newPassword")
    .notEmpty()
    .withMessage("New password is required")
    .isLength({ min: 6 })
    .withMessage("New password is too short, minimum 6 characters"),

  check("confirmPassword")
    .notEmpty()
    .withMessage("Confirm password is required")
    .custom((val, { req }) => {
      if (val !== req.body.newPassword) {
        throw new Error("Confirm password does not match new password");
      }
      return true;
    }),

  validatorMiddleware,
];
