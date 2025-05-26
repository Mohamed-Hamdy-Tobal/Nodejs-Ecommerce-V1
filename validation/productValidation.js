import { check } from "express-validator";
import { validatorMiddleware } from "../middleware/validatorMiddleware.js";
import CategoryModel from "../models/category.model.js";
import BrandModel from "../models/brand.model.js";
import SubCategoryModel from "../models/subCategory.model.js";

export const getProductValidation = [
  check("id").isMongoId().withMessage("Invalid Product ID format"),
  validatorMiddleware,
];

export const createProductValidation = [
  check("title")
    .notEmpty()
    .withMessage("Product title is required")
    .isLength({ min: 3 })
    .withMessage("Too short title")
    .isLength({ max: 100 })
    .withMessage("Too long title"),

  check("slug").optional().isString().withMessage("Slug must be a string"),

  check("description")
    .notEmpty()
    .withMessage("Product description is required")
    .isLength({ min: 20 })
    .withMessage("Too short product description"),

  check("price")
    .notEmpty()
    .withMessage("Product price is required")
    .isFloat({ min: 0 })
    .withMessage("Price must be above 0"),

  check("price_after_discount")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Discounted price must be a positive number")
    .custom((value, { req }) => {
      if (req.body.price && parseFloat(value) >= parseFloat(req.body.price)) {
        throw new Error("Discounted price must be less than original price");
      }
      return true;
    }),

  check("colors").optional().isArray().withMessage("Colors must be an array of strings"),

  check("image").optional().isArray().withMessage("Image must be an array of strings"),

  check("quantity")
    .notEmpty()
    .withMessage("Product quantity is required")
    .isInt({ min: 0 })
    .withMessage("Quantity must be a non-negative number"),

  check("sold").optional().isInt({ min: 0 }).withMessage("Sold must be a non-negative number"),

  check("category")
    .notEmpty()
    .withMessage("Product category is required")
    .isMongoId()
    .withMessage("Invalid category ID format")
    .custom(async (value) => {
      const category = await CategoryModel.findById(value);
      if (!category) {
        throw new Error("Category not found");
      }
      return true;
    }),

  check("brand")
    .notEmpty()
    .withMessage("Product brand is required")
    .isMongoId()
    .withMessage("Invalid brand ID format")
    .custom(async (value) => {
      const brand = await BrandModel.findById(value);
      if (!brand) {
        throw new Error("Brand not found");
      }
      return true;
    }),

  check("subCategory")
    .optional()
    .isMongoId()
    .withMessage("Invalid subCategory ID format")
    .custom(async (value) => {
      const subCategory = await SubCategoryModel.findById(value);
      if (!subCategory) {
        throw new Error("subCategory not found");
      }
      return true;
    }),

  check("ratings")
    .optional()
    .isFloat({ min: 1, max: 5 })
    .withMessage("Ratings must be between 1 and 5"),

  check("totalRating")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Total ratings must be a non-negative number"),

  check("isActive").optional().isBoolean().withMessage("isActive must be true or false"),

  validatorMiddleware,
];

export const updateProductValidation = [
  check("id").isMongoId().withMessage("Invalid Product ID format"),

  check("title")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Too short title")
    .isLength({ max: 32 })
    .withMessage("Too long title"),

  check("slug").optional().isString().withMessage("Slug must be a string"),

  check("description")
    .optional()
    .isLength({ min: 20 })
    .withMessage("Too short product description"),

  check("price").optional().isFloat({ min: 0 }).withMessage("Price must be above 0"),

  check("price_after_discount")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Discounted price must be a positive number")
    .custom((value, { req }) => {
      if (req.body.price && parseFloat(value) >= parseFloat(req.body.price)) {
        throw new Error("Discounted price must be less than original price");
      }
      return true;
    }),

  check("colors").optional().isArray().withMessage("Colors must be an array of strings"),

  check("image").optional().isArray().withMessage("Image must be an array of strings"),

  check("quantity")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Quantity must be a non-negative number"),

  check("sold").optional().isInt({ min: 0 }).withMessage("Sold must be a non-negative number"),

  check("category")
    .optional()
    .isMongoId()
    .withMessage("Invalid category ID format")
    .custom(async (value) => {
      const category = await CategoryModel.findById(value);
      if (!category) {
        throw new Error("Category not found");
      }
      return true;
    }),

  check("brand")
    .optional()
    .isMongoId()
    .withMessage("Invalid brand ID format")
    .custom(async (value) => {
      const brand = await BrandModel.findById(value);
      if (!brand) {
        throw new Error("Brand not found");
      }
      return true;
    }),
  check("subCategory")
    .optional()
    .isMongoId()
    .withMessage("Invalid subCategory ID format")
    .custom(async (value) => {
      const subCategory = await SubCategoryModel.findById(value);
      if (!subCategory) {
        throw new Error("subCategory not found");
      }
      return true;
    }),

  check("ratings")
    .optional()
    .isFloat({ min: 1, max: 5 })
    .withMessage("Ratings must be between 1 and 5"),

  check("totalRating")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Total ratings must be a non-negative number"),

  check("isActive").optional().isBoolean().withMessage("isActive must be true or false"),

  validatorMiddleware,
];

export const deleteProductValidation = [
  check("id").isMongoId().withMessage("Invalid Product ID format"),
  validatorMiddleware,
];
