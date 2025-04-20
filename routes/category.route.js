import express from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
} from "../controllers/category.controller.js";

const router = express.Router();

router.route("/").get(getAllCategories).post(createCategory);

router
  .route("/:id")
  .get(getSingleCategory)
  .put(updateCategory)
  .delete(deleteCategory);

export const categoryRouter = router;
