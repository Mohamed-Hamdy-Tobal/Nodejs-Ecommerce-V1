import express from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
} from "../controllers/category.controller.js";
import {
  createCategoryValidation,
  getCategoryValidation,
  updateCategoryValidation,
  deleteCategoryValidation,
} from "../validation/categoryValidation.js";
import { subCategoryRouter } from "./subCategory.route.js";

const router = express.Router();

router.use("/:categoryId/sub-category", subCategoryRouter); // Mount the subCategoryRouter on the category router
// This will allow you to access sub-categories under a specific category ID, e.g., /api/v1/category/:categoryId/sub-categories

router.route("/").get(getAllCategories).post(createCategoryValidation, createCategory);

router
  .route("/:id")
  .get(getCategoryValidation, getSingleCategory)
  .put(updateCategoryValidation, updateCategory)
  .delete(deleteCategoryValidation, deleteCategory);

export const categoryRouter = router;
