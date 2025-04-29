import express from "express";
import {
  createSubCategory,
  deleteSubCategory,
  getAllSubCategories,
  getSingleSubCategory,
  setCategoryID,
  updateSubCategory,
} from "../controllers/subCategory.controller.js";
import {
  createSubCategoryValidation,
  deleteSubCategoryValidation,
  getSubCategoryValidation,
  updateSubCategoryValidation,
} from "../validation/subCategoryValidation.js";

// mergeParams allows you to access params from parent routes
// Because Express does not automatically inherit parameters in sub-routers.
// For example, if you have a route like /api/v1/category/:categoryId/sub-categories/:subCategoryId, you can access categoryId in the subCategoryRouter
const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(getAllSubCategories)
  .post(setCategoryID, createSubCategoryValidation, createSubCategory);

router
  .route("/:id")
  .get(getSubCategoryValidation, getSingleSubCategory)
  .put(updateSubCategoryValidation, updateSubCategory)
  .delete(deleteSubCategoryValidation, deleteSubCategory);

export const subCategoryRouter = router;
