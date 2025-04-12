import express from "express";
import {
  createCategory,
  getAllCategories,
  getSingleCategory,
} from "../controllers/category.controller.js";

const router = express.Router();

router.route("/").get(getAllCategories).post(createCategory);
router.route("/:id").get(getSingleCategory);

export const categoryRouter = router;
