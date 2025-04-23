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

const router = express.Router();

router
  .route("/")
  .get(getAllCategories)
  .post(createCategoryValidation, createCategory);

router
  .route("/:id")
  .get(getCategoryValidation, getSingleCategory)
  .put(updateCategoryValidation, updateCategory)
  .delete(deleteCategoryValidation, deleteCategory);

export const categoryRouter = router;
