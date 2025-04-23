import { check } from "express-validator";
import { validatorMiddleware } from "../middleware/validatorMiddleware.js";

export const getCategoryValidation = [
  check("id").isMongoId().withMessage("Invalid category ID format"),
  validatorMiddleware,
];

export const createCategoryValidation = [
  check("name")
    .notEmpty()
    .withMessage("Category name is required")
    .isLength({ min: 3 })
    .withMessage("Too short name")
    .isLength({ max: 32 })
    .withMessage("Too long name"),

  check("slug").optional().isString().withMessage("Slug must be a string"),

  check("image").optional().isString().withMessage("Image must be a string"),

  validatorMiddleware,
];

export const updateCategoryValidation = [
  check("id").isMongoId().withMessage("Invalid category ID format"),

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

export const deleteCategoryValidation = [
  check("id").isMongoId().withMessage("Invalid category ID format"),
  validatorMiddleware,
];
