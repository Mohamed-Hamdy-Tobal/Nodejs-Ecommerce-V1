import { check } from "express-validator";
import { validatorMiddleware } from "../middleware/validatorMiddleware.js";

export const getBrandValidation = [
  check("id").isMongoId().withMessage("Invalid brand ID format"),
  validatorMiddleware,
];

export const createBrandValidation = [
  check("name")
    .notEmpty()
    .withMessage("Brand name is required")
    .isLength({ min: 3 })
    .withMessage("Too short name")
    .isLength({ max: 32 })
    .withMessage("Too long name"),

  check("slug").optional().isString().withMessage("Slug must be a string"),

  check("image").optional().isString().withMessage("Image must be a string"),

  validatorMiddleware,
];

export const updateBrandValidation = [
  check("id").isMongoId().withMessage("Invalid brand ID format"),

  check("name")
    .notEmpty()
    .isLength({ min: 3 })
    .withMessage("Too short name")
    .isLength({ max: 32 })
    .withMessage("Too long name"),

  check("slug").optional().isString().withMessage("Slug must be a string"),

  check("image").optional().isString().withMessage("Image must be a string"),

  validatorMiddleware,
];

export const deleteBrandValidation = [
  check("id").isMongoId().withMessage("Invalid brand ID format"),
  validatorMiddleware,
];
